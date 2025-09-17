import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

const ddb = DynamoDBDocumentClient.from(client);

const tableName = "Subscriptions";

export const createFreePlan = async (userId: string) => {
  const item = {
    userId,
    plan: "free",
    status: "active",
    expiry: null,
    razorpayPaymentId: null,
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

  await ddb.send(new PutCommand({ TableName: tableName, Item: item }));
  console.log("Free plan created for", userId);
};

export const upgradePlan = async (userId: string, plan: string, expiry: string, paymentId: string) => {
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

  await ddb.send(new UpdateCommand({
    TableName: tableName,
    Key: { userId },
    UpdateExpression: "SET plan = :p, expiry = :e, razorpayPaymentId = :r, limits = :l",
    ExpressionAttributeValues: {
      ":p": plan,
      ":e": expiry,
      ":r": paymentId,
      ":l": planLimits[plan]
    }
  }));

  console.log("User upgraded:", userId, "Plan:", plan);
};

export const getUserSubscription = async (userId: string) => {
  const data = await ddb.send(new GetCommand({
    TableName: tableName,
    Key: { userId }
  }));

  return data.Item; // Subscription object
};