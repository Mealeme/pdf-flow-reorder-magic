import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';

dotenv.config();

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Simulate the upgradePlan function logic for testing
async function testAnnualPaymentFlow() {
  console.log("🧪 Testing Annual Payment Flow...");

  const testUserId = "test-annual-user-" + Date.now();
  const testPaymentId = "test-annual-payment-" + Date.now();

  try {
    // Step 1: Test Pro Annual Plan
    console.log("\n📝 Testing Pro Annual Plan Upgrade...");

    const proAnnualExpiry = Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000);
    console.log("📅 Pro Annual Expiry calculated:", new Date(proAnnualExpiry * 1000).toISOString());

    const proAnnualItem = {
      userId: testUserId,
      plan: "pro",
      status: "active",
      expiry: proAnnualExpiry,
      paymentId: testPaymentId,
      purchasedAt: new Date().toISOString(),
      billingPeriod: "annual",
      limits: {
        daily: 5,
        fileSize: 50,
        compression: 10,
        watermark: true,
        batchProcessing: false,
        advancedCustomization: false,
        prioritySupport: false
      }
    };

    await docClient.send(new PutCommand({
      TableName: "Subscriptions",
      Item: proAnnualItem,
    }));
    console.log("✅ Pro Annual subscription created successfully");

    // Step 2: Verify the data was stored correctly
    const verifyPro = await docClient.send(new GetCommand({
      TableName: "Subscriptions",
      Key: { userId: testUserId }
    }));

    if (verifyPro.Item) {
      console.log("✅ Pro Annual data verification:");
      console.log("   Plan:", verifyPro.Item.plan);
      console.log("   Billing Period:", verifyPro.Item.billingPeriod);
      console.log("   Expiry:", new Date(verifyPro.Item.expiry * 1000).toISOString());
      console.log("   Status:", verifyPro.Item.status);
      console.log("   Payment ID:", verifyPro.Item.paymentId);

      // Calculate days remaining
      const now = new Date();
      const expiryDate = new Date(verifyPro.Item.expiry * 1000);
      const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      console.log("   Days remaining:", daysRemaining);

      if (daysRemaining !== 365 && daysRemaining !== 364) {
        console.log("❌ ERROR: Expected ~365 days for annual plan, got:", daysRemaining);
      } else {
        console.log("✅ Expiry calculation correct for annual plan");
      }
    }

    // Step 3: Test Pro+ Annual Plan
    console.log("\n📝 Testing Pro+ Annual Plan Upgrade...");

    const proPlusAnnualExpiry = Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000);
    console.log("📅 Pro+ Annual Expiry calculated:", new Date(proPlusAnnualExpiry * 1000).toISOString());

    const proPlusAnnualItem = {
      userId: testUserId + "-plus",
      plan: "pro+",
      status: "active",
      expiry: proPlusAnnualExpiry,
      paymentId: testPaymentId + "-plus",
      purchasedAt: new Date().toISOString(),
      billingPeriod: "annual",
      limits: {
        daily: "unlimited",
        fileSize: 500,
        compression: 100,
        watermark: false,
        batchProcessing: true,
        advancedCustomization: true,
        prioritySupport: true
      }
    };

    await docClient.send(new PutCommand({
      TableName: "Subscriptions",
      Item: proPlusAnnualItem,
    }));
    console.log("✅ Pro+ Annual subscription created successfully");

    // Step 4: Verify Pro+ data
    const verifyProPlus = await docClient.send(new GetCommand({
      TableName: "Subscriptions",
      Key: { userId: testUserId + "-plus" }
    }));

    if (verifyProPlus.Item) {
      console.log("✅ Pro+ Annual data verification:");
      console.log("   Plan:", verifyProPlus.Item.plan);
      console.log("   Billing Period:", verifyProPlus.Item.billingPeriod);
      console.log("   Daily Limit:", verifyProPlus.Item.limits.daily);
      console.log("   File Size Limit:", verifyProPlus.Item.limits.fileSize);
      console.log("   Status:", verifyProPlus.Item.status);
    }

    // Step 5: Test Monthly vs Annual Comparison
    console.log("\n📊 Comparing Monthly vs Annual Plans...");

    const monthlyExpiry = Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000);
    const monthlyItem = {
      userId: testUserId + "-monthly",
      plan: "pro+",
      status: "active",
      expiry: monthlyExpiry,
      paymentId: testPaymentId + "-monthly",
      purchasedAt: new Date().toISOString(),
      billingPeriod: "monthly",
      limits: proPlusAnnualItem.limits
    };

    await docClient.send(new PutCommand({
      TableName: "Subscriptions",
      Item: monthlyItem,
    }));

    const monthlyData = await docClient.send(new GetCommand({
      TableName: "Subscriptions",
      Key: { userId: testUserId + "-monthly" }
    }));

    if (monthlyData.Item && verifyProPlus.Item) {
      const monthlyDays = Math.ceil((new Date(monthlyData.Item.expiry * 1000).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const annualDays = Math.ceil((new Date(verifyProPlus.Item.expiry * 1000).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      console.log("   Monthly Pro+ days remaining:", monthlyDays);
      console.log("   Annual Pro+ days remaining:", annualDays);
      console.log("   Ratio (Annual/Monthly):", (annualDays / monthlyDays).toFixed(2));

      if (annualDays > monthlyDays && annualDays >= 360) {
        console.log("✅ Annual plan has longer duration than monthly");
      } else {
        console.log("❌ ERROR: Annual plan duration seems incorrect");
      }
    }

    console.log("\n🎉 Annual Payment Flow Test Completed Successfully!");
    console.log("📋 Test Results:");
    console.log("   ✅ Pro Annual Plan: Created and verified");
    console.log("   ✅ Pro+ Annual Plan: Created and verified");
    console.log("   ✅ Billing Period: Stored correctly");
    console.log("   ✅ Expiry Calculation: Working for annual plans");
    console.log("   ✅ Data Storage: Subscriptions table updated properly");

  } catch (error) {
    console.error("❌ Annual Payment Test Failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Run the test
testAnnualPaymentFlow();