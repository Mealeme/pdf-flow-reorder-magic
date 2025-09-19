
export interface Subscription {
  userId: string;
  plan: string;
  status: string;
  expiry: number | null;
  paymentId: string | null;
  purchasedAt: string;
  limits: {
    daily: number | string;
    fileSize: number;
    compression: number;
    watermark: boolean;
    batchProcessing: boolean;
    advancedCustomization: boolean;
    prioritySupport: boolean;
  };
}

export const createFreePlan = async (userId: string) => {
  try {
    console.log("📨 Creating free plan for userId:", userId);
    const response = await fetch('/api/subscription/free', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create free plan');
    }

    console.log("✅ Free plan created for", userId);
    return data;
  } catch (error) {
    console.error('❌ Error creating free plan:', error);
    throw error;
  }
};

export const upgradePlan = async (userId: string, plan: string, expiry: string, paymentId: string, billingPeriod: 'monthly' | 'annual' = 'monthly') => {
  try {
    console.log("🔄 Upgrading user", userId, "to plan:", plan, "billingPeriod:", billingPeriod);
    const response = await fetch('/api/subscription/upgrade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, plan, expiry, paymentId, billingPeriod }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upgrade plan');
    }

    console.log("✅ User upgraded:", userId, "Plan:", plan, "Billing Period:", billingPeriod);
    return data;
  } catch (error) {
    console.error('❌ Error upgrading plan:', error);
    throw error;
  }
};

export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    console.log("🔍 Fetching subscription for userId:", userId);
    const response = await fetch(`/api/subscription/get/${userId}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log("⚠️ No subscription found for user:", userId);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📋 Subscription data retrieved:", data);
    return data;
  } catch (error) {
    console.error('❌ Error getting subscription:', error);
    return null;
  }
};