import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

async function verifySubscriptionStructure() {
  console.log("🔍 Verifying Subscriptions table data structure...");

  try {
    // Scan for a few items to see the structure
    const scanResult = await docClient.send(new ScanCommand({
      TableName: "Subscriptions",
      Limit: 5 // Just check a few records
    }));

    if (!scanResult.Items || scanResult.Items.length === 0) {
      console.log("⚠️ No items found in Subscriptions table");
      return;
    }

    console.log(`📊 Found ${scanResult.Items.length} subscription records`);
    console.log("🔧 Analyzing data structure...");

    // Analyze the structure of each item
    scanResult.Items.forEach((item, index) => {
      console.log(`\n📋 Record ${index + 1}:`);
      console.log("   userId:", item.userId);
      console.log("   plan:", item.plan);
      console.log("   status:", item.status);
      console.log("   expiry:", item.expiry ? new Date(item.expiry * 1000).toISOString() : "null");
      console.log("   paymentId:", item.paymentId);
      console.log("   purchasedAt:", item.purchasedAt);
      console.log("   billingPeriod:", item.billingPeriod || "NOT SET");
      console.log("   limits:", JSON.stringify(item.limits, null, 2));

      // Check for annual plans specifically
      if (item.billingPeriod === 'annual') {
        console.log("   🎯 Annual Plan Detected:");
        console.log("      Plan:", item.plan);
        console.log("      Expiry:", item.expiry ? new Date(item.expiry * 1000).toISOString() : "null");

        if (item.expiry) {
          const now = new Date();
          const expiryDate = new Date(item.expiry * 1000);
          const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          console.log("      Days remaining:", daysRemaining);

          if (daysRemaining >= 360 && daysRemaining <= 370) {
            console.log("      ✅ Annual expiry calculation correct");
          } else {
            console.log("      ❌ Annual expiry calculation incorrect");
          }
        }
      }
    });

    // Summary statistics
    const totalRecords = scanResult.Items.length;
    const annualRecords = scanResult.Items.filter(item => item.billingPeriod === 'annual').length;
    const monthlyRecords = scanResult.Items.filter(item => item.billingPeriod === 'monthly').length;
    const noBillingPeriod = scanResult.Items.filter(item => !item.billingPeriod).length;

    console.log("\n📈 Summary Statistics:");
    console.log("   Total records analyzed:", totalRecords);
    console.log("   Annual billing records:", annualRecords);
    console.log("   Monthly billing records:", monthlyRecords);
    console.log("   Records without billing period:", noBillingPeriod);

    if (annualRecords > 0) {
      console.log("✅ Annual payment functionality is active and working");
    } else {
      console.log("ℹ️ No annual payment records found in this sample");
    }

    // Check data structure completeness
    console.log("\n🔧 Data Structure Verification:");
    const requiredFields = ['userId', 'plan', 'status', 'purchasedAt', 'limits'];
    const optionalFields = ['expiry', 'paymentId', 'billingPeriod'];

    scanResult.Items.forEach((item, index) => {
      console.log(`   Record ${index + 1} completeness:`);

      requiredFields.forEach(field => {
        const hasField = item.hasOwnProperty(field);
        console.log(`      ${field}: ${hasField ? '✅' : '❌'}`);
      });

      optionalFields.forEach(field => {
        const hasField = item.hasOwnProperty(field);
        console.log(`      ${field}: ${hasField ? '✅' : '⚠️ (optional)'}`);
      });
    });

  } catch (error) {
    console.error("❌ Error verifying subscription structure:", error.message);
  }
}

verifySubscriptionStructure();