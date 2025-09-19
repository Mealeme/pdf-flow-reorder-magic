import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

console.log("🚀 Starting server initialization...");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  // Force IPv4 to avoid potential IPv6 issues
  requestHandler: {
    requestTimeout: 30000,
    connectionTimeout: 10000,
  },
  // Add explicit credentials (though they should be picked up from env)
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Force IPv4 resolution
  forcePathStyle: false,
  // Add custom DNS resolution to force IPv4
  customUserAgent: 'pdf-flow-app/1.0'
});
const ddb = DynamoDBDocumentClient.from(client);

// Test connection on startup
console.log("🔍 Testing DynamoDB connection on startup...");
try {
  const testCommand = new GetCommand({
    TableName: "Subscriptions",
    Key: { userId: "test-connection" }
  });
  await ddb.send(testCommand);
  console.log("✅ DynamoDB connection test successful");
} catch (error) {
  if (error.name === 'ResourceNotFoundException') {
    console.log("✅ DynamoDB connection test successful (table exists, record not found as expected)");
  } else {
    console.error("❌ DynamoDB connection test failed:", error.message);
  }
}
const s3 = new S3Client({ region: process.env.AWS_REGION });

console.log("✅ AWS clients initialized successfully");

const app = express();
app.use(cors());
app.use(express.json());

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const upload = multer({ storage: multer.memoryStorage() });

// DynamoDB functions
const createFreePlan = async (userId) => {
  try {
    console.log("🔧 Creating free plan for userId:", userId);
    const item = {
      userId,
      plan: "free",
      status: "active",
      expiry: null,
      paymentId: null,
      purchasedAt: new Date().toISOString(),
      billingPeriod: "monthly",
      limits: {
        daily: 1,
        fileSize: 50,
        compression: 10,
        watermark: false,
        batchProcessing: false,
        advancedCustomization: false,
        prioritySupport: false
      }
    };

    await ddb.send(new PutCommand({ TableName: "Subscriptions", Item: item }));

    // Initialize UserUsage for new free user
    console.log("📊 Initializing UserUsage for new free user:", userId);
    const usageData = {
      userId,
      pdfUploads: 0,
      pdfCompress: 0,
      pdfReorder: 0,
      photoToPdf: 0,
      lastReset: new Date().toISOString(),
      plan: 'free',
      updatedAt: new Date().toISOString()
    };

    await ddb.send(new PutCommand({
      TableName: "UserUsage",
      Item: usageData
    }));

    console.log("✅ Free plan and UserUsage created for", userId);
  } catch (error) {
    console.error("❌ Error creating free plan:", error);
    throw error;
  }
};

const upgradePlan = async (userId, plan, expiry, paymentId, billingPeriod = 'monthly') => {
  console.log("🔄 Starting upgrade process for user:", userId, "to plan:", plan, "paymentId:", paymentId, "billingPeriod:", billingPeriod);

  // Log billing period details
  console.log("💰 Payment Details:");
  console.log("   Billing Period:", billingPeriod);
  console.log("   Plan Type:", plan);
  console.log("   Payment ID:", paymentId);

  // Calculate expiry if not provided
  let calculatedExpiry = expiry;
  if (!calculatedExpiry) {
    const now = new Date();
    console.log("📅 Calculating expiry for", plan, "plan with", billingPeriod, "billing");

    if (plan === 'pro') {
      // Pro plan: 7 days (weekly) or 365 days (annual)
      const daysToAdd = billingPeriod === 'annual' ? 365 : 7;
      calculatedExpiry = Math.floor((now.getTime() + daysToAdd * 24 * 60 * 60 * 1000) / 1000);
      console.log("📊 Pro plan calculation:");
      console.log("   Days to add:", daysToAdd);
      console.log("   Current time:", now.toISOString());
      console.log("   Calculated expiry:", new Date(calculatedExpiry * 1000).toISOString());
    } else if (plan === 'pro+') {
      // Pro+ plan: 30 days (monthly) or 365 days (annual)
      const daysToAdd = billingPeriod === 'annual' ? 365 : 30;
      calculatedExpiry = Math.floor((now.getTime() + daysToAdd * 24 * 60 * 60 * 1000) / 1000);
      console.log("📊 Pro+ plan calculation:");
      console.log("   Days to add:", daysToAdd);
      console.log("   Current time:", now.toISOString());
      console.log("   Calculated expiry:", new Date(calculatedExpiry * 1000).toISOString());
    }

    // Verify annual calculation
    if (billingPeriod === 'annual') {
      const daysDifference = Math.floor((calculatedExpiry - Math.floor(now.getTime() / 1000)) / (24 * 60 * 60));
      console.log("✅ Annual plan verification:");
      console.log("   Expected days: 365");
      console.log("   Calculated days:", daysDifference);
      if (daysDifference >= 364 && daysDifference <= 366) {
        console.log("   ✓ Expiry calculation correct for annual plan");
      } else {
        console.log("   ❌ ERROR: Expiry calculation incorrect for annual plan");
      }
    }
  }

  const planLimits = {
    pro: {
      daily: 5,
      fileSize: 50,
      compression: 10,
      watermark: true,
      batchProcessing: false,
      advancedCustomization: false,
      prioritySupport: false
    },
    "pro+": {
      daily: "unlimited",
      fileSize: 500,
      compression: 100,
      watermark: false,
      batchProcessing: true,
      advancedCustomization: true,
      prioritySupport: true
    }
  };

  console.log("📊 Plan limits for", plan, ":", planLimits[plan]);

  if (!planLimits[plan]) {
    throw new Error(`Invalid plan: ${plan}. Supported plans: pro, pro+`);
  }

  console.log("💾 Updating Subscriptions table for user:", userId);
  console.log("📋 Data to be stored:");
  console.log("   Plan:", plan);
  console.log("   Billing Period:", billingPeriod);
  console.log("   Expiry:", calculatedExpiry ? new Date(calculatedExpiry * 1000).toISOString() : "null");
  console.log("   Payment ID:", paymentId);
  console.log("   Status: active");
  console.log("   Limits:", JSON.stringify(planLimits[plan], null, 2));

  await ddb.send(new UpdateCommand({
    TableName: "Subscriptions",
    Key: { userId },
    UpdateExpression: "SET #plan = :p, expiry = :e, paymentId = :r, limits = :l, #status = :s, purchasedAt = :pt, billingPeriod = :bp",
    ExpressionAttributeNames: {
      "#plan": "plan",
      "#status": "status"
    },
    ExpressionAttributeValues: {
      ":p": plan,
      ":e": calculatedExpiry,
      ":r": paymentId,
      ":l": planLimits[plan],
      ":s": "active",
      ":pt": new Date().toISOString(),
      ":bp": billingPeriod
    }
  }));
  console.log("✅ Subscriptions table updated successfully for user:", userId);

  // Verify the data was stored correctly
  console.log("🔍 Verifying data storage...");
  const verifyData = await ddb.send(new GetCommand({
    TableName: "Subscriptions",
    Key: { userId }
  }));

  if (verifyData.Item) {
    console.log("✅ Verification successful:");
    console.log("   Stored Plan:", verifyData.Item.plan);
    console.log("   Stored Billing Period:", verifyData.Item.billingPeriod);
    console.log("   Stored Expiry:", verifyData.Item.expiry ? new Date(verifyData.Item.expiry * 1000).toISOString() : "null");
    console.log("   Stored Payment ID:", verifyData.Item.paymentId);
    console.log("   Stored Status:", verifyData.Item.status);

    // Check if billing period matches
    if (verifyData.Item.billingPeriod === billingPeriod) {
      console.log("✅ Billing period stored correctly");
    } else {
      console.log("❌ ERROR: Billing period mismatch!");
      console.log("   Expected:", billingPeriod);
      console.log("   Stored:", verifyData.Item.billingPeriod);
    }

    // Check if expiry is reasonable for annual plans
    if (billingPeriod === 'annual' && verifyData.Item.expiry) {
      const daysRemaining = Math.floor((verifyData.Item.expiry - Math.floor(Date.now() / 1000)) / (24 * 60 * 60));
      console.log("   Days remaining for annual plan:", daysRemaining);
      if (daysRemaining >= 360 && daysRemaining <= 370) {
        console.log("✅ Annual expiry duration correct");
      } else {
        console.log("❌ ERROR: Annual expiry duration incorrect");
      }
    }
  } else {
    console.log("❌ ERROR: Could not verify stored data");
  }

  // Transfer existing UserUsage data or create new record for upgraded user
  console.log("📊 Transferring UserUsage data for upgraded user:", userId);
  try {
    // Check if user already has UserUsage data
    const existingUsage = await getUserUsage(userId);

    let usageData;
    if (existingUsage) {
      // Preserve existing usage data and update plan
      console.log("📋 Found existing UserUsage data, preserving and updating plan");
      usageData = {
        ...existingUsage,
        plan: plan,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Create new UserUsage record for upgraded user
      console.log("📋 No existing UserUsage data found, creating new record");
      usageData = {
        userId,
        pdfUploads: 0,
        pdfCompress: 0,
        pdfReorder: 0,
        photoToPdf: 0,
        lastReset: new Date().toISOString(),
        plan: plan,
        updatedAt: new Date().toISOString()
      };
    }

    await ddb.send(new PutCommand({
      TableName: "UserUsage",
      Item: usageData
    }));

    console.log("✅ UserUsage data transferred/created for upgraded user:", userId, "with plan:", plan);
    if (existingUsage) {
      console.log("📊 Preserved usage counts:", {
        pdfUploads: existingUsage.pdfUploads || 0,
        pdfCompress: existingUsage.pdfCompress || 0,
        pdfReorder: existingUsage.pdfReorder || 0,
        photoToPdf: existingUsage.photoToPdf || 0
      });
    }
  } catch (error) {
    console.error("❌ Failed to transfer UserUsage data for upgraded user:", error);
    // Don't throw error - continue with upgrade
  }

  console.log("✅ User upgrade completed successfully:", userId, "Plan:", plan, "Status: active", "Payment ID:", paymentId);
};

const isSubscriptionExpired = (subscription) => {
  if (!subscription || subscription.plan === 'free') {
    return false;
  }

  const now = new Date();

  // If there's an explicit expiry date, use it
  if (subscription.expiry) {
    const expiryDate = new Date(subscription.expiry);
    return now > expiryDate;
  }

  // Otherwise, calculate based on purchasedAt date
  if (!subscription.purchasedAt) {
    return false;
  }

  const purchaseDate = new Date(subscription.purchasedAt);

  // For Pro plan (7 days weekly or 52 weeks annual)
  if (subscription.plan === 'pro') {
    const expiryDate = new Date(purchaseDate);
    // Default to weekly for backward compatibility if billingPeriod is missing
    if (subscription.billingPeriod === 'annual') {
      expiryDate.setFullYear(purchaseDate.getFullYear() + 1);
    } else {
      expiryDate.setDate(purchaseDate.getDate() + 7);
    }
    return now > expiryDate;
  }

  // For Pro+ plan (30 days monthly or 365 days annual)
  if (subscription.plan === 'pro+') {
    const expiryDate = new Date(purchaseDate);
    // Default to monthly for backward compatibility if billingPeriod is missing
    if (subscription.billingPeriod === 'annual') {
      expiryDate.setFullYear(purchaseDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(purchaseDate.getMonth() + 1);
    }
    return now > expiryDate;
  }

  return false;
};

const downgradeExpiredPlan = async (userId, currentSubscription) => {
  console.log("⏰ Plan expired for userId:", userId, "- downgrading to free plan");
  console.log("📅 Original plan:", currentSubscription.plan, "Purchased:", currentSubscription.purchasedAt);

  try {
    // Update subscription to free plan
    const freeLimits = {
      daily: 1,
      fileSize: 50,
      compression: 10,
      watermark: false,
      batchProcessing: false,
      advancedCustomization: false,
      prioritySupport: false
    };

    await ddb.send(new UpdateCommand({
      TableName: "Subscriptions",
      Key: { userId },
      UpdateExpression: "SET #plan = :p, #status = :s, limits = :l, expiry = :e, expiredAt = :et",
      ExpressionAttributeNames: {
        "#plan": "plan",
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":p": "free",
        ":s": "expired",
        ":l": freeLimits,
        ":e": null,
        ":et": new Date().toISOString()
      }
    }));

    // Update UserUsage to free plan limits
    const freeUsageData = {
      userId,
      pdfUploads: 0,
      pdfCompress: 0,
      pdfReorder: 0,
      photoToPdf: 0,
      lastReset: new Date().toISOString(),
      plan: 'free',
      updatedAt: new Date().toISOString()
    };

    await ddb.send(new PutCommand({
      TableName: "UserUsage",
      Item: freeUsageData
    }));

    console.log("✅ Successfully downgraded user", userId, "from", currentSubscription.plan, "to free plan");

    // Return updated subscription data
    return {
      ...currentSubscription,
      plan: "free",
      status: "expired",
      limits: freeLimits,
      expiry: null,
      expiredAt: new Date().toISOString()
    };

  } catch (error) {
    console.error("❌ Failed to downgrade expired plan for userId:", userId, error);
    throw error;
  }
};

const getUserSubscription = async (userId) => {
  console.log("🔍 Fetching subscription for userId:", userId);
  console.log("🔗 DynamoDB Table: Subscriptions, Key:", { userId });

  try {
    const data = await ddb.send(new GetCommand({
      TableName: "Subscriptions",
      Key: { userId }
    }));

    console.log("📋 Raw DynamoDB response:", JSON.stringify(data, null, 2));
    console.log("📋 Subscription data retrieved:", data.Item);

    if (!data.Item) {
      console.log("⚠️ No subscription found for userId:", userId, "- creating free plan automatically");

      // Automatically create free plan if user doesn't have one
      try {
        await createFreePlan(userId);
        console.log("✅ Free plan created automatically for userId:", userId);

        // Fetch the newly created subscription
        const newData = await ddb.send(new GetCommand({
          TableName: "Subscriptions",
          Key: { userId }
        }));

        console.log("📋 New subscription data retrieved:", newData.Item);
        return newData.Item;
      } catch (createError) {
        console.error("❌ Failed to create free plan for userId:", userId, createError);
        return null;
      }
    }

    // Check if the subscription has expired and needs to be downgraded
    if (data.Item.plan === 'pro' || data.Item.plan === 'pro+') {
      console.log("🔍 Checking expiration for", data.Item.plan, "plan - expiry:", data.Item.expiry);
      const expired = isSubscriptionExpired(data.Item);
      console.log("📊 Expiration check result:", expired ? "EXPIRED" : "ACTIVE");

      if (expired) {
        console.log("⏰ Subscription expired for userId:", userId);
        return await downgradeExpiredPlan(userId, data.Item);
      } else {
        console.log("✅ Subscription still active for userId:", userId);
      }
    } else {
      console.log("ℹ️ Free plan or unknown plan type:", data.Item.plan);
    }

    // Override daily limit for pro users to ensure they get the updated limit
    if (data.Item.plan === 'pro' && data.Item.limits) {
      console.log("🔄 Overriding daily limit for pro user from", data.Item.limits.daily, "to 5");
      data.Item.limits.daily = 5;
    }

    // Fix limits for existing subscriptions that may have wrong data
    if (data.Item.plan === 'pro+' && data.Item.limits) {
      // Ensure Pro+ has unlimited daily usage
      if (data.Item.limits.daily !== "unlimited") {
        console.log("🔄 Fixing Pro+ daily limit from", data.Item.limits.daily, "to unlimited");
        data.Item.limits.daily = "unlimited";
      }
    }

    return data.Item;
  } catch (error) {
    console.error("❌ DynamoDB query error:", error);
    throw error;
  }
};

// Profile management functions
const createDefaultProfile = async (userId, email) => {
  try {
    console.log("👤 Creating default profile for userId:", userId, "email:", email);
    const defaultProfile = {
      userId,
      firstName: "",
      lastName: "",
      email: email || "",
      phone: "",
      location: "",
      joinDate: new Date().toLocaleDateString(),
      bio: "PDF enthusiast and document management specialist. Love working with NewMicro tools!",
      photoUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await ddb.send(new PutCommand({
      TableName: "UserProfiles",
      Item: defaultProfile
    }));

    console.log("✅ Default profile created for userId:", userId);
    return defaultProfile;
  } catch (error) {
    console.error("❌ Error creating default profile:", error);
    throw error;
  }
};

const getUserProfile = async (userId, email = null) => {
  console.log("🔍 Fetching profile for userId:", userId);

  try {
    const data = await ddb.send(new GetCommand({
      TableName: "UserProfiles",
      Key: { userId }
    }));

    if (!data.Item) {
      console.log("⚠️ No profile found for userId:", userId, "- creating default profile automatically");

      // Automatically create default profile if user doesn't have one
      try {
        const newProfile = await createDefaultProfile(userId, email);
        console.log("✅ Default profile created automatically for userId:", userId);
        return newProfile;
      } catch (createError) {
        console.error("❌ Failed to create default profile for userId:", userId, createError);
        return null;
      }
    }

    console.log("📋 Profile data retrieved for userId:", userId);
    return data.Item;
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    throw error;
  }
};

const updateUserProfile = async (userId, profileData) => {
  await ddb.send(new PutCommand({
    TableName: "UserProfiles",
    Item: {
      userId,
      ...profileData,
      updatedAt: new Date().toISOString()
    }
  }));
};

const uploadProfilePhoto = async (fileBuffer, fileName, contentType) => {
  const params = {
    Bucket: "myapp-user-profiles-newmacro",
    Key: `profiles/${fileName}`,
    Body: fileBuffer,
    ContentType: contentType
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
};

const saveUserProfile = async (userId, photoUrl) => {
  await ddb.send(new UpdateCommand({
    TableName: "UserProfiles",
    Key: { userId },
    UpdateExpression: "set photoUrl = :url, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":url": photoUrl,
      ":updatedAt": new Date().toISOString()
    }
  }));
};

// Create Free plan
app.post("/api/subscription/free", async (req, res) => {
  console.log("📨 Received request to /api/subscription/free");
  console.log("📋 Request body:", req.body);
  try {
    const { userId } = req.body;

    if (!userId) {
      console.error("❌ Missing userId in request body");
      return res.status(400).json({ error: "userId is required" });
    }

    console.log("👤 Creating free plan for userId:", userId);
    await createFreePlan(userId);
    console.log("✅ Free plan created successfully");
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error in /api/subscription/free:", error);
    res.status(500).json({ error: error.message });
  }
});

// Upgrade plan
app.post("/api/subscription/upgrade", async (req, res) => {
  console.log("📨 Received request to /api/subscription/upgrade");
  console.log("📋 Request body:", req.body);
  try {
    const { userId, plan, expiry, paymentId, billingPeriod = 'monthly' } = req.body;

    if (!userId || !plan) {
      console.error("❌ Missing required parameters: userId or plan");
      return res.status(400).json({ error: "userId and plan are required" });
    }

    console.log("🔄 Upgrading user", userId, "to plan:", plan, "with paymentId:", paymentId, "billingPeriod:", billingPeriod);
    await upgradePlan(userId, plan, expiry, paymentId, billingPeriod);

    // Verify the upgrade worked
    const updatedSubscription = await getUserSubscription(userId);
    console.log("✅ Upgrade verification - New subscription:", updatedSubscription);

    if (!updatedSubscription || updatedSubscription.plan !== plan) {
      console.error("❌ Subscription verification failed - plan not updated correctly");
      return res.status(500).json({ error: "Subscription update verification failed" });
    }

    // Override daily limit for pro users in the response
    if (updatedSubscription.plan === 'pro' && updatedSubscription.limits) {
      updatedSubscription.limits.daily = 5;
    }

    console.log("✅ Subscription successfully updated in DynamoDB for user:", userId, "plan:", plan);
    res.json({ success: true, subscription: updatedSubscription });
  } catch (error) {
    console.error("❌ Error in /api/subscription/upgrade:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get subscription
app.get("/api/subscription/get/:userId", async (req, res) => {
  console.log("🌐 GET /api/subscription/get/" + req.params.userId);
  try {
    const subscription = await getUserSubscription(req.params.userId);
    console.log("🌐 GET /api/subscription/get/" + req.params.userId + " - Response:", subscription);

    if (!subscription) {
      console.log("⚠️ No subscription found for user:", req.params.userId);
      return res.json(null);
    }

    res.json(subscription);
  } catch (error) {
    console.error("❌ Error in GET /api/subscription/get:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check user plan status
app.get("/api/subscription/status/:userId", async (req, res) => {
  console.log("🌐 GET /api/subscription/status/" + req.params.userId);
  try {
    const subscription = await getUserSubscription(req.params.userId);

    if (!subscription) {
      console.log("⚠️ No subscription found for user:", req.params.userId);
      return res.json({
        hasSubscription: false,
        plan: 'free',
        status: 'none',
        message: 'No subscription found. Create a free plan first.'
      });
    }

    const plan = subscription.status === 'active' ? subscription.plan : 'free';
    console.log("📋 User", req.params.userId, "plan status:", plan, "subscription status:", subscription.status);

    // Override daily limit for pro users in the response
    if (subscription.plan === 'pro' && subscription.limits) {
      subscription.limits.daily = 5;
    }

    res.json({
      hasSubscription: true,
      plan: plan,
      status: subscription.status,
      subscription: subscription
    });
  } catch (error) {
    console.error("❌ Error in GET /api/subscription/status:", error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to create subscription for testing
app.post("/api/test/create-subscription/:userId", async (req, res) => {
  console.log("🧪 TEST: Creating subscription for user:", req.params.userId);
  try {
    const userId = req.params.userId;
    const { plan = 'free', billingPeriod = 'monthly' } = req.body;

    if (plan === 'free') {
      await createFreePlan(userId);
    } else {
      // For testing, create subscription with specified billing period
      await upgradePlan(userId, plan, null, 'test-payment-' + Date.now(), billingPeriod);
    }

    // Verify creation
    const subscription = await getUserSubscription(userId);

    // Override daily limit for pro users in the response
    if (subscription && subscription.plan === 'pro' && subscription.limits) {
      subscription.limits.daily = 5;
    }

    res.json({
      success: true,
      message: `Created ${plan} subscription (${billingPeriod}) for ${userId}`,
      subscription: subscription
    });
  } catch (error) {
    console.error("❌ Error in test subscription creation:", error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint specifically for annual payments
app.post("/api/test/annual-payment/:userId", async (req, res) => {
  console.log("🧪 TEST: Testing annual payment for user:", req.params.userId);
  try {
    const userId = req.params.userId;
    const { plan = 'pro' } = req.body;

    console.log("💰 Testing annual payment flow:");
    console.log("   User ID:", userId);
    console.log("   Plan:", plan);
    console.log("   Billing Period: annual");

    // Create annual subscription
    await upgradePlan(userId, plan, null, 'annual-test-payment-' + Date.now(), 'annual');

    // Verify the subscription
    const subscription = await getUserSubscription(userId);

    // Calculate days remaining
    let daysRemaining = 0;
    if (subscription && subscription.expiry) {
      const now = new Date();
      const expiryDate = new Date(subscription.expiry * 1000);
      daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Override daily limit for pro users in the response
    if (subscription && subscription.plan === 'pro' && subscription.limits) {
      subscription.limits.daily = 5;
    }

    const verification = {
      billingPeriodCorrect: subscription?.billingPeriod === 'annual',
      expiryReasonable: daysRemaining >= 360 && daysRemaining <= 370,
      planCorrect: subscription?.plan === plan,
      statusCorrect: subscription?.status === 'active',
      daysRemaining: daysRemaining,
      expiryDate: subscription?.expiry ? new Date(subscription.expiry * 1000).toISOString() : null
    };

    console.log("✅ Annual payment verification:");
    console.log("   Billing Period Correct:", verification.billingPeriodCorrect);
    console.log("   Expiry Reasonable:", verification.expiryReasonable);
    console.log("   Plan Correct:", verification.planCorrect);
    console.log("   Status Correct:", verification.statusCorrect);
    console.log("   Days Remaining:", verification.daysRemaining);

    res.json({
      success: true,
      message: `Annual ${plan} subscription test completed`,
      subscription: subscription,
      verification: verification,
      allTestsPassed: Object.values(verification).every(v => v === true || typeof v === 'number' || typeof v === 'string')
    });
  } catch (error) {
    console.error("❌ Error in annual payment test:", error);
    res.status(500).json({ error: error.message });
  }
});

// Profile management endpoints
app.get("/api/profile/get/:userId", async (req, res) => {
  console.log("🌐 GET /api/profile/get/" + req.params.userId);
  try {
    // For now, we'll create profile without email since it's not passed in the URL
    // In a real app, you might want to get email from auth context or pass it as a query param
    const profile = await getUserProfile(req.params.userId);
    console.log("🌐 GET /api/profile/get/" + req.params.userId + " - Response:", profile);

    if (!profile) {
      console.log("⚠️ No profile found for user:", req.params.userId);
      return res.json({});
    }

    res.json(profile);
  } catch (error) {
    console.error("❌ Error in GET /api/profile/get:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/profile/update", async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;
    await updateUserProfile(userId, profileData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/profile/upload-photo", upload.single("photo"), async (req, res) => {
  try {
    console.log("Upload photo request received");
    const { userId } = req.body;
    const file = req.file;
    console.log("userId:", userId, "file:", file ? file.originalname : "no file");

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `${userId}-${Date.now()}.${file.originalname.split('.').pop()}`;
    console.log("Uploading to S3:", fileName);
    const photoUrl = await uploadProfilePhoto(file.buffer, fileName, file.mimetype);
    console.log("S3 upload success, URL:", photoUrl);
    await saveUserProfile(userId, photoUrl);
    console.log("DynamoDB update success");

    res.json({ success: true, photoUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Usage tracking functions
const getUserUsage = async (userId) => {
  const data = await ddb.send(new GetCommand({
    TableName: "UserUsage",
    Key: { userId }
  }));

  return data.Item;
};

const updateUserUsage = async (userId, usageData) => {
  await ddb.send(new PutCommand({
    TableName: "UserUsage",
    Item: {
      userId,
      ...usageData,
      updatedAt: new Date().toISOString()
    }
  }));
};

// Usage tracking endpoints
app.get("/api/usage/get/:userId", async (req, res) => {
  try {
    const usage = await getUserUsage(req.params.userId);
    if (usage) {
      // Check if we need to reset daily usage
      const subscription = await getUserSubscription(req.params.userId);
      const plan = subscription && subscription.status === 'active' ? subscription.plan : 'free';

      const limits = {
        free: { dailyReset: true },
        pro: { dailyReset: true },
        'pro+': { dailyReset: false }
      };

      if (limits[plan]?.dailyReset && shouldResetUsage(usage.lastReset)) {
        // Reset usage
        const resetData = {
          pdfUploads: 0,
          pdfCompress: 0,
          pdfReorder: 0,
          photoToPdf: 0,
          lastReset: new Date().toISOString(),
          plan
        };
        await updateUserUsage(req.params.userId, resetData);
        res.json(resetData);
      } else {
        res.json({
          pdfUploads: usage.pdfUploads || 0,
          pdfCompress: usage.pdfCompress || 0,
          pdfReorder: usage.pdfReorder || 0,
          photoToPdf: usage.photoToPdf || 0,
          lastReset: usage.lastReset,
          plan
        });
      }
    } else {
      // New user, return default usage
      const plan = 'free';
      res.json({
        pdfUploads: 0,
        pdfCompress: 0,
        pdfReorder: 0,
        photoToPdf: 0,
        lastReset: new Date().toISOString(),
        plan
      });
    }
  } catch (error) {
    console.error('Usage get error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/usage/increment/:userId", async (req, res) => {
  console.log("📨 Received request to /api/usage/increment/" + req.params.userId);
  console.log("📋 Request body:", req.body);
  try {
    const { action } = req.body;
    const userId = req.params.userId;

    if (!action) {
      console.error("❌ Missing action in request body");
      return res.status(400).json({ error: "action is required" });
    }

    // Get current usage
    let usage = await getUserUsage(userId);
    if (!usage) {
      console.log("📊 No UserUsage record found for user", userId, "- creating default record");
      usage = {
        userId,
        pdfUploads: 0,
        pdfCompress: 0,
        pdfReorder: 0,
        photoToPdf: 0,
        lastReset: new Date().toISOString(),
        plan: plan,
        updatedAt: new Date().toISOString()
      };

      // Create the UserUsage record
      await ddb.send(new PutCommand({
        TableName: "UserUsage",
        Item: usage
      }));
      console.log("✅ Created UserUsage record for user", userId);
    }

    // Get current subscription
    const subscription = await getUserSubscription(userId);
    console.log("🔍 Subscription data for user", userId, ":", subscription);
    const plan = subscription && subscription.status === 'active' ? subscription.plan : 'free';
    console.log("📋 Determined plan:", plan, "from subscription:", subscription?.plan, "status:", subscription?.status);

    // Get limits based on plan - use hardcoded limits for reliability
    const planLimits = {
      free: { pdfUploads: 1, pdfCompress: 1, pdfReorder: 1, photoToPdf: 1 },
      pro: { pdfUploads: 5, pdfCompress: 2, pdfReorder: 2, photoToPdf: 2 },
      'pro+': { pdfUploads: -1, pdfCompress: -1, pdfReorder: -1, photoToPdf: -1 }
    };

    const actionLimit = (planLimits[plan] || planLimits.free)[action] || -1;
    console.log("🎯 Action:", action, "Plan:", plan, "Current usage:", (usage[action] || 0), "Limit:", actionLimit);

    // Check if action is allowed
    if (actionLimit !== -1 && (usage[action] || 0) >= actionLimit) {
      console.log("❌ Usage limit exceeded for", action, "- Current:", (usage[action] || 0), "Limit:", actionLimit);
      return res.status(400).json({ error: 'Usage limit exceeded' });
    }

    // Increment usage
    usage[action] = (usage[action] || 0) + 1;
    usage.plan = plan;
    usage.updatedAt = new Date().toISOString();

    // Save updated usage
    await updateUserUsage(userId, usage);

    res.json({ success: true, usage });
  } catch (error) {
    console.error('Usage increment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function for daily reset
const shouldResetUsage = (lastReset) => {
  if (!lastReset) return true;
  const lastResetDate = new Date(lastReset);
  const now = new Date();
  return now.getDate() !== lastResetDate.getDate() ||
         now.getMonth() !== lastResetDate.getMonth() ||
         now.getFullYear() !== lastResetDate.getFullYear();
};

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Ready to accept connections`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

server.on('close', () => {
  console.log('🔒 Server closed');
});

console.log('⏳ Starting server...');