interface UsageData {
  pdfUploads: number;
  pdfCompress: number;
  pdfReorder: number;
  photoToPdf: number;
  lastReset: string; // ISO date string
}

interface PlanLimits {
  pdfUploads: number;
  pdfCompress: number;
  pdfReorder: number;
  photoToPdf: number;
  dailyReset: boolean;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    pdfUploads: 1,
    pdfCompress: 1,
    pdfReorder: 1,
    photoToPdf: 1,
    dailyReset: true,
  },
  pro: {
    pdfUploads: 5,
    pdfCompress: 2,
    pdfReorder: 2,
    photoToPdf: 2,
    dailyReset: true,
  },
  'pro+': {
    pdfUploads: -1, // unlimited daily
    pdfCompress: -1,
    pdfReorder: -1,
    photoToPdf: -1,
    dailyReset: false,
  },
};

export const getCurrentPlan = async (userId?: string): Promise<string> => {
  // Check for special users first
  if (userId === 'special-user-id') {
    return 'pro+';
  }

  if (!userId) return 'free';

  try {
    const res = await fetch(`/api/subscription/get/${userId}`);
    const subscription = await res.json();
    if (subscription && subscription.status === 'active') {
      return subscription.plan || 'free';
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
  }
  return 'free';
};

export const isSubscriptionActive = (subscriptionData: any): boolean => {
  if (!subscriptionData || !subscriptionData.purchasedAt) {
    return false;
  }

  const purchaseDate = new Date(subscriptionData.purchasedAt);
  const now = new Date();

  // For Pro plan (weekly)
  if (subscriptionData.plan === 'pro' || subscriptionData.plan === 'Pro') {
    const weekLater = new Date(purchaseDate);
    weekLater.setDate(purchaseDate.getDate() + 7);
    return now <= weekLater;
  }

  // For Pro+ plan (monthly)
  if (subscriptionData.plan === 'pro+' || subscriptionData.plan === 'Pro+') {
    const monthLater = new Date(purchaseDate);
    monthLater.setMonth(purchaseDate.getMonth() + 1);
    return now <= monthLater;
  }

  return false;
};

export const getSubscriptionExpiry = (subscriptionData: any): Date | null => {
  if (!subscriptionData || !subscriptionData.purchasedAt) {
    return null;
  }

  const purchaseDate = new Date(subscriptionData.purchasedAt);

  if (subscriptionData.plan === 'pro' || subscriptionData.plan === 'Pro') {
    const weekLater = new Date(purchaseDate);
    weekLater.setDate(purchaseDate.getDate() + 7);
    return weekLater;
  }

  if (subscriptionData.plan === 'pro+' || subscriptionData.plan === 'Pro+') {
    const monthLater = new Date(purchaseDate);
    monthLater.setMonth(purchaseDate.getMonth() + 1);
    return monthLater;
  }

  return null;
};

export const getUsageLimits = (plan: string = 'free'): PlanLimits => {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
};

export const getCurrentUsage = async (userId?: string): Promise<UsageData> => {
  if (!userId) {
    // For non-logged in users, use localStorage
    const usage = localStorage.getItem('usage_data');
    if (usage) {
      const data = JSON.parse(usage);
      // Check if we need to reset daily usage
      const limits = getUsageLimits();
      if (limits.dailyReset && shouldResetUsage(data.lastReset)) {
        resetUsage();
        return getDefaultUsage();
      }
      return data;
    }
    return getDefaultUsage();
  }

  // For logged in users, try API first
  try {
    const response = await fetch(`/api/usage/get/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return {
        pdfUploads: data.pdfUploads || 0,
        pdfCompress: data.pdfCompress || 0,
        pdfReorder: data.pdfReorder || 0,
        photoToPdf: data.photoToPdf || 0,
        lastReset: data.lastReset || new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Failed to fetch usage from API:', error);
  }

  // Fallback to default usage for logged in users (don't use shared localStorage)
  return getDefaultUsage();
};

const getDefaultUsage = (): UsageData => ({
  pdfUploads: 0,
  pdfCompress: 0,
  pdfReorder: 0,
  photoToPdf: 0,
  lastReset: new Date().toISOString(),
});

const shouldResetUsage = (lastReset: string): boolean => {
  const lastResetDate = new Date(lastReset);
  const now = new Date();
  return now.getDate() !== lastResetDate.getDate() ||
         now.getMonth() !== lastResetDate.getMonth() ||
         now.getFullYear() !== lastResetDate.getFullYear();
};

export const incrementUsage = async (action: keyof UsageData, userId?: string): Promise<boolean> => {
  console.log("🔄 incrementUsage called:");
  console.log("  UserId:", userId);
  console.log("  Action:", action);

  if (!userId) {
    // For non-logged in users, use localStorage
    console.log("  Using localStorage for non-logged user");
    const limits = getUsageLimits();
    const currentUsage = await getCurrentUsage();

    if (limits[action] === -1) {
      console.log("  ✅ Unlimited - allowing increment");
      return true; // unlimited
    }

    if (currentUsage[action] >= limits[action]) {
      console.log("  ❌ Limit exceeded - blocking increment");
      return false; // limit exceeded
    }

    currentUsage[action]++;
    localStorage.setItem('usage_data', JSON.stringify({
      ...currentUsage,
      lastReset: new Date().toISOString(),
    }));

    console.log("  ✅ Incremented localStorage usage");
    return true;
  }

  // For logged in users, use API
  console.log("  Using API for logged in user");
  try {
    const response = await fetch(`/api/usage/increment/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (response.ok) {
      console.log("  ✅ API increment successful");
      return true;
    } else {
      const error = await response.json();
      console.error('❌ Usage increment failed:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to increment usage via API:', error);
    // For logged in users, don't fallback to localStorage - return false
    return false;
  }
};

export const canPerformAction = async (action: keyof UsageData, userId?: string): Promise<boolean> => {
  const plan = await getCurrentPlan(userId);
  const limits = getUsageLimits(plan);
  const currentUsage = await getCurrentUsage(userId);

  console.log("🔍 canPerformAction Debug:");
  console.log("  UserId:", userId);
  console.log("  Action:", action);
  console.log("  Plan:", plan);
  console.log("  Limits for action:", limits[action]);
  console.log("  Current usage:", currentUsage[action]);

  if (limits[action] === -1) {
    console.log("  ✅ Unlimited - allowing action");
    return true; // unlimited
  }

  // For free plan, be more strict - don't allow any actions if any limit is exceeded
  if (plan === 'free') {
    const usage = await getCurrentUsage(userId);
    const planLimits = getUsageLimits(plan);
    const actions: (keyof Omit<UsageData, 'lastReset'>)[] = ['pdfUploads', 'pdfCompress', 'pdfReorder', 'photoToPdf'];

    // If any action has reached its limit, block all actions
    for (const act of actions) {
      if (usage[act] >= planLimits[act]) {
        console.log("  ❌ Free plan - blocking all actions (limit exceeded for", act + ")");
        return false;
      }
    }
  }

  const canPerform = currentUsage[action] < limits[action];
  console.log("  Result:", canPerform ? "✅ Allowed" : "❌ Blocked", `(usage: ${currentUsage[action]}, limit: ${limits[action]})`);
  return canPerform;
};

export const getRemainingUsage = async (action: keyof Omit<UsageData, 'lastReset'>, userId?: string): Promise<number> => {
  const limits = getUsageLimits(await getCurrentPlan(userId));
  const currentUsage = await getCurrentUsage(userId);

  if (limits[action] === -1) return -1; // unlimited
  return Math.max(0, limits[action] - currentUsage[action]);
};

export const resetUsage = (): void => {
  localStorage.setItem('usage_data', JSON.stringify(getDefaultUsage()));
};

export const getUsageSummary = async (userId?: string) => {
  const plan = await getCurrentPlan(userId);
  const limits = getUsageLimits(plan);
  const usage = await getCurrentUsage(userId);

  console.log("🔍 Usage Summary Debug:");
  console.log("  UserId:", userId);
  console.log("  Plan:", plan);
  console.log("  Limits:", limits);
  console.log("  Current Usage:", usage);

  return {
    plan,
    limits,
    usage,
    remaining: {
      pdfUploads: limits.pdfUploads === -1 ? -1 : Math.max(0, limits.pdfUploads - usage.pdfUploads),
      pdfCompress: limits.pdfCompress === -1 ? -1 : Math.max(0, limits.pdfCompress - usage.pdfCompress),
      pdfReorder: limits.pdfReorder === -1 ? -1 : Math.max(0, limits.pdfReorder - usage.pdfReorder),
      photoToPdf: limits.photoToPdf === -1 ? -1 : Math.max(0, limits.photoToPdf - usage.photoToPdf),
    }
  };
};