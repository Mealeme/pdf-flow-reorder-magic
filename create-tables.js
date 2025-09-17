import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createTables() {
  console.log("🛠️ Creating DynamoDB tables...");

  try {
    // Create UserUsage table
    console.log("\n📊 Creating UserUsage table...");
    await client.send(new CreateTableCommand({
      TableName: "UserUsage",
      KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" }
      ],
      AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: "S" }
      ],
      BillingMode: "PAY_PER_REQUEST",
    }));
    console.log("✅ UserUsage table created successfully");

  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log("ℹ️ UserUsage table already exists");
    } else {
      console.error("❌ Error creating UserUsage table:", error.message);
    }
  }
}

createTables();