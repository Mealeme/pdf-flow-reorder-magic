import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
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

async function testDynamoDB() {
  console.log("🧪 Testing DynamoDB connection...");

  try {
    // Test 1: Put item in Subscriptions table
    console.log("\n📝 Testing Subscriptions table...");
    const testSubscription = {
      userId: "test-user-123",
      plan: "Pro",
      purchasedAt: new Date().toISOString(),
      paymentId: "test-payment-123",
    };

    await docClient.send(new PutCommand({
      TableName: "Subscriptions",
      Item: testSubscription,
    }));
    console.log("✅ Successfully wrote to Subscriptions table");

    // Test 2: Get item from Subscriptions table
    const getResult = await docClient.send(new GetCommand({
      TableName: "Subscriptions",
      Key: { userId: "test-user-123" },
    }));

    if (getResult.Item) {
      console.log("✅ Successfully read from Subscriptions table:", getResult.Item.plan);
    } else {
      console.log("❌ Item not found in Subscriptions table");
    }

    // Test 3: Put item in UserProfiles table
    console.log("\n👤 Testing UserProfiles table...");
    const testProfile = {
      userId: "test-user-123",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      profileImage: null,
    };

    await docClient.send(new PutCommand({
      TableName: "UserProfiles",
      Item: testProfile,
    }));
    console.log("✅ Successfully wrote to UserProfiles table");

    // Test 4: Get item from UserProfiles table
    const profileResult = await docClient.send(new GetCommand({
      TableName: "UserProfiles",
      Key: { userId: "test-user-123" },
    }));

    if (profileResult.Item) {
      console.log("✅ Successfully read from UserProfiles table:", profileResult.Item.email);
    } else {
      console.log("❌ Item not found in UserProfiles table");
    }

    // Test 5: Put item in UserUsage table
    console.log("\n📈 Testing UserUsage table...");
    const testUsage = {
      userId: "test-user-123",
      pdfUploads: 1,
      pdfCompress: 0,
      pdfReorder: 1,
      photoToPdf: 0,
      lastReset: new Date().toISOString(),
      plan: "pro",
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: "UserUsage",
      Item: testUsage,
    }));
    console.log("✅ Successfully wrote to UserUsage table");

    // Test 6: Get item from UserUsage table
    const usageResult = await docClient.send(new GetCommand({
      TableName: "UserUsage",
      Key: { userId: "test-user-123" },
    }));

    if (usageResult.Item) {
      console.log("✅ Successfully read from UserUsage table:", usageResult.Item.pdfUploads, "uploads");
    } else {
      console.log("❌ Item not found in UserUsage table");
    }

    console.log("\n🎉 DynamoDB is working correctly!");
    console.log("📊 Tables 'Subscriptions', 'UserProfiles', and 'UserUsage' are accessible");
    console.log("🔐 AWS credentials are valid");

  } catch (error) {
    console.error("❌ DynamoDB test failed:", error.message);

    if (error.name === 'ResourceNotFoundException') {
      console.log("💡 Solution: Create the DynamoDB tables in AWS console");
      console.log("   - Table 1: Subscriptions (Primary key: userId - String)");
      console.log("   - Table 2: UserProfiles (Primary key: userId - String)");
    } else if (error.name === 'UnrecognizedClientException') {
      console.log("💡 Solution: Check AWS credentials in .env file");
    } else if (error.name === 'AccessDeniedException') {
      console.log("💡 Solution: Add DynamoDB permissions to IAM user");
    }
  }
}

// Run the test
testDynamoDB();