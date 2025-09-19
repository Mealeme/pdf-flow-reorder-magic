import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Menu, X, LogOut, User, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TypewriterEffect from "@/components/TypewriterEffect";
import FloatingParticlesBackground from "@/components/ParticlesBackground";
import DynamicToggle from "@/components/DynamicToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import ThreeDCube from "@/components/ThreeDCube";
import { getUsageSummary, getCurrentPlan, getSubscriptionExpiry } from "@/utils/usageUtils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState('free');
  const [usageSummary, setUsageSummary] = useState(null);
  const [subscriptionUpdated, setSubscriptionUpdated] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load profile photo from API
  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (user?.userId) {
        try {
          const res = await fetch(`/api/profile/get/${user.userId}`);
          const profile = await res.json();
          if (profile?.photoUrl) {
            setPhotoUrl(profile.photoUrl);
          }
        } catch (error) {
          console.error('Error loading profile photo:', error);
        }
      }
    };

    loadProfilePhoto();

    // Listen for photo update events
    const handlePhotoUpdate = (event: CustomEvent) => {
      setPhotoUrl(event.detail);
    };

    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate as EventListener);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate as EventListener);
    };
  }, [user?.userId]);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const refreshData = () => {
    setSubscriptionUpdated(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.userId) {
        try {
          console.log('🔄 Fetching current plan and usage for user:', user.userId);
          const plan = await getCurrentPlan(user.userId);
          console.log('📋 Current plan from DynamoDB:', plan);
          setUserPlan(plan || 'free');

          const summary = await getUsageSummary(user.userId);
          console.log('📊 Usage summary:', summary);
          setUsageSummary(summary);

          // Also fetch subscription data for expiry calculation
          const subscriptionResponse = await fetch(`/api/subscription/get/${user.userId}`);
          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            console.log('📅 Subscription data:', subscriptionData);

            // Update localStorage with latest data for consistency
            if (subscriptionData) {
              const localStorageData = {
                userId: user.userId,
                email: user.email,
                plan: subscriptionData.plan,
                paymentId: subscriptionData.paymentId,
                amount: null, // We don't store amount in DB
                period: subscriptionData.plan === 'pro+' ? 'per month' : 'per week',
                purchasedAt: subscriptionData.purchasedAt,
              };
              localStorage.setItem('subscription_current', JSON.stringify(localStorageData));
            }
          }
        } catch (error) {
          console.error('❌ Error fetching plan data:', error);
          setUserPlan('free');
          // Fallback to default usage
          setUsageSummary({
            plan: 'free',
            limits: { pdfUploads: 1, pdfCompress: 1, pdfReorder: 1, photoToPdf: 1, dailyReset: true },
            usage: { pdfUploads: 0, pdfCompress: 0, pdfReorder: 0, photoToPdf: 0, lastReset: new Date().toISOString() },
            remaining: { pdfUploads: 1, pdfCompress: 1, pdfReorder: 1, photoToPdf: 1 }
          });
        }
      }
    };
    fetchData();
  }, [user, subscriptionUpdated]);

  const getCurrentSubscription = () => {
    if (!user) return null;

    // First try to get from localStorage
    const subscription = localStorage.getItem('subscription_current');
    if (subscription) {
      const parsed = JSON.parse(subscription);
      console.log('📋 Subscription from localStorage:', parsed);
      return parsed;
    }

    // If no localStorage data, try to create from current plan
    if (userPlan && userPlan !== 'free') {
      console.log('📋 Creating subscription data from current plan:', userPlan);
      const mockSubscription = {
        userId: user.userId,
        email: user.email,
        plan: userPlan,
        paymentId: null,
        amount: null,
        period: userPlan === 'pro+' ? 'per month' : 'per week',
        purchasedAt: new Date().toISOString(), // This is approximate
      };
      return mockSubscription;
    }

    return null;
  };

  const currentSubscription = getCurrentSubscription();

  // Use the actual expiry date from the database instead of calculating it
  const subscriptionExpiry = currentSubscription && currentSubscription.expiry
    ? new Date(currentSubscription.expiry)
    : (currentSubscription ? getSubscriptionExpiry(currentSubscription) : null);

  const getDaysRemaining = () => {
    if (!subscriptionExpiry) {
      console.log('⏰ No subscription expiry found');
      return 0;
    }

    const now = new Date();
    const diffTime = subscriptionExpiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log('⏰ Days remaining calculation:');
    console.log('  Current time:', now.toISOString());
    console.log('  Expiry time:', subscriptionExpiry.toISOString());
    console.log('  Diff time (ms):', diffTime);
    console.log('  Days remaining:', Math.max(0, diffDays));

    return Math.max(0, diffDays);
  };

  const daysRemaining = getDaysRemaining();

  console.log('📊 Pricing page state:');
  console.log('  User Plan:', userPlan);
  console.log('  Current Subscription:', currentSubscription);
  console.log('  Subscription Expiry:', subscriptionExpiry);
  console.log('  Days Remaining:', daysRemaining);

  const getPricingTiers = () => {
    const isAnnual = billingPeriod === 'annual';

    return [
      {
        name: "Free",
        price: "₹0",
        period: "forever",
        description: "Perfect for occasional PDF processing",
        features: [
          "Up to 1 PDFs per day",
          "Basic reordering patterns",
          "PDF compression up to 10MB",
          "Standard support",
          "File size limit: 50MB"
        ],
        buttonText: "Get Started",
        buttonVariant: "outline" as const,
        popular: false
      },
      {
        name: "Pro",
        price: isAnnual ? "₹180" : "₹20",
        originalPrice: isAnnual ? "₹240" : undefined,
        period: isAnnual ? "per year" : "per week",
        savings: isAnnual ? "Save ₹60" : undefined,
        description: "For regular users who need more power",
        features: [
          "Daily 5 PDFs",
          "WaterMark Add to Pdf",
          "All reordering patterns",
          "PDF compression up to 10MB",
          "NO Priority support",
          "File size limit: 50MB",
          "NO Batch processing",
          "NO Advanced customization"
        ],
        buttonText: "Start Pro Trial",
        buttonVariant: "default" as const,
        popular: false
      },
      {
        name: "Pro+",
        price: isAnnual ? "₹360" : "₹40",
        originalPrice: isAnnual ? "₹480" : undefined,
        period: isAnnual ? "per year" : "per month",
        savings: isAnnual ? "Save ₹120" : undefined,
        description: "Advanced features for power users",
        features: [
          "Everything in Pro",
          "Daily Unlimited PDFs",
          "Unlimited file sizes",
          "No watermark",
          "All reordering patterns",
          "PDF compression up to 100MB",
          "Priority support",
          "File size limit: 500MB",
          "Batch processing",
          "Advanced customization"
        ],
        buttonText: "Start Pro+ Trial",
        buttonVariant: "default" as const,
        popular: true
      }
    ];
  };

  const pricingTiers = getPricingTiers();

  const handlePayment = async (tier: any) => {
    if (tier.name === "Free") {
      toast({
        title: "Free plan activated!",
        description: "You can now use all free features without any limitations.",
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase a paid plan.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const isAnnual = billingPeriod === 'annual';
    let baseAmount;
    if (tier.name === "Pro+") {
      baseAmount = isAnnual ? 36000 : 4000; // Pro+ annual: ₹360, monthly: ₹40
    } else if (tier.name === "Pro") {
      baseAmount = isAnnual ? 18000 : 2000; // Pro annual: ₹180, weekly: ₹20
    } else {
      baseAmount = 0; // Free plan
    }
    const amount = baseAmount;

    const options = {
      key: "rzp_live_RFzqd2degwIWwJ",
      amount: amount,
      currency: "INR",
      name: "NewMicro",
      description: `${tier.name} Plan Subscription`,
      handler: async function (response: any) {
        console.log('Payment successful, updating subscription for user:', user.userId);

        try {
          // Calculate expiry based on billing period
          const isAnnual = billingPeriod === 'annual';
          let expiry;
          if (tier.name === "Pro+") {
            expiry = new Date(Date.now() + (isAnnual ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString();
          } else if (tier.name === "Pro") {
            expiry = new Date(Date.now() + (isAnnual ? 365 : 7) * 24 * 60 * 60 * 1000).toISOString();
          } else {
            expiry = null; // Free plan
          }

          // Immediately update subscription in DynamoDB
          const upgradeResponse = await fetch("/api/subscription/upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.userId,
              plan: tier.name.toLowerCase(),
              expiry: expiry,
              paymentId: response.razorpay_payment_id,
              billingPeriod: billingPeriod
            })
          });

          if (!upgradeResponse.ok) {
            const errorText = await upgradeResponse.text();
            console.error('Subscription upgrade failed:', errorText);
            throw new Error('Failed to update subscription in database');
          }

          console.log('Subscription successfully updated in DynamoDB');

          // Store subscription info in localStorage after successful DB update
          const subscriptionData = {
            userId: user.userId,
            email: user.email,
            plan: tier.name,
            paymentId: response.razorpay_payment_id,
            amount: amount,
            period: tier.period,
            purchasedAt: new Date().toISOString(),
          };
          localStorage.setItem('subscription_current', JSON.stringify(subscriptionData));

          // Show success message only after successful DB update
          toast({
            title: "Payment successful!",
            description: `Welcome to ${tier.name}! Your subscription has been activated. Payment ID: ${response.razorpay_payment_id}`,
          });

          // Refresh the dashboard data
          refreshData();

          setLoading(false);
          // Refresh the page to show updated plan
          window.location.reload();

        } catch (error) {
          console.error('Error updating subscription after payment:', error);
          toast({
            title: "Payment processed but subscription update failed",
            description: "Your payment was successful, but there was an issue activating your subscription. Please contact support with payment ID: " + response.razorpay_payment_id,
            variant: "destructive",
          });
          setLoading(false);
        }
      },
      prefill: {
        name: user.username,
        email: user.email,
        contact: "",
      },
      theme: {
        color: "#3B82F6",
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
          toast({
            title: "Payment cancelled",
            description: "You cancelled the payment process.",
            variant: "destructive",
          });
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setLoading(false);
      toast({
        title: "Payment failed",
        description: "There was an error initializing the payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <FloatingParticlesBackground />
      <ThreeDCube />
      <Navigation onMenuClick={handleToggleMobileMenu} />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-extrabold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              <TypewriterEffect
                text="Simple, Transparent Pricing"
                speed={80}
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                cursorClassName="text-blue-400"
              />
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that fits your PDF processing needs. No hidden fees, no surprises.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 shadow-lg glow-border">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Choose Billing Period</h3>
                <p className="text-sm text-gray-300">Save up to 25% with annual billing</p>
              </div>
              <DynamicToggle
                options={[
                  { label: "Monthly", value: "monthly" },
                  { label: "Annual", value: "annual" }
                ]}
                defaultValue="monthly"
                onChange={setBillingPeriod}
                className="shadow-md"
              />
              {billingPeriod === 'annual' && (
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    🎉 Save 25% with annual billing!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Current Plan Benefits */}
          {isAuthenticated && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 mb-8 border border-gray-600 shadow-xl glow-border">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Your Current Plan: <span className={`${
                    userPlan === 'pro+' ? 'text-purple-400' :
                    userPlan === 'pro' ? 'text-blue-400' :
                    'text-gray-400'
                  } font-semibold`}>
                    {userPlan === 'pro+' ? 'Pro+' :
                     userPlan === 'pro' ? 'Pro' :
                     'Free'}
                  </span>
                  {subscriptionExpiry && daysRemaining > 0 && userPlan !== 'free' && (
                    <span className="text-sm text-gray-300 ml-4">
                      ({daysRemaining} days remaining)
                    </span>
                  )}
                  {subscriptionExpiry && daysRemaining === 0 && userPlan !== 'free' && (
                    <span className="text-sm text-red-400 ml-4">
                      (Expired - Renew to continue)
                    </span>
                  )}
                  {!subscriptionExpiry && userPlan !== 'free' && (
                    <span className="text-sm text-orange-400 ml-4">
                      (Subscription data loading...)
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {userPlan === "free" && usageSummary && (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {usageSummary.remaining.pdfUploads === -1 ? '∞' : usageSummary.remaining.pdfUploads}
                        </div>
                        <div className="text-gray-300">PDF uploads left</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Used: {usageSummary.usage.pdfUploads}/{usageSummary.limits.pdfUploads}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {usageSummary.remaining.pdfCompress === -1 ? '∞' : usageSummary.remaining.pdfCompress}
                        </div>
                        <div className="text-gray-300">Compress left</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Used: {usageSummary.usage.pdfCompress}/{usageSummary.limits.pdfCompress}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {usageSummary.remaining.pdfReorder === -1 ? '∞' : usageSummary.remaining.pdfReorder}
                        </div>
                        <div className="text-gray-300">Reorder left</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Used: {usageSummary.usage.pdfReorder}/{usageSummary.limits.pdfReorder}
                        </div>
                      </div>
                    </>
                  )}
                  {userPlan === "pro" && usageSummary && (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">
                          {usageSummary.remaining.pdfUploads === -1 ? '∞' : usageSummary.remaining.pdfUploads}
                        </div>
                        <div className="text-gray-300">PDFs left today</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Used: {usageSummary.usage.pdfUploads}/{usageSummary.limits.pdfUploads}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">50MB</div>
                        <div className="text-gray-300">Max file size</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${daysRemaining <= 3 ? 'text-red-400' : 'text-blue-400'}`}>
                          {daysRemaining}
                        </div>
                        <div className="text-gray-300">Days remaining</div>
                      </div>
                    </>
                  )}
                  {userPlan === "pro+" && usageSummary && (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">Unlimited</div>
                        <div className="text-gray-300">Daily PDFs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">Unlimited</div>
                        <div className="text-gray-300">File sizes</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${daysRemaining <= 7 ? 'text-red-400' : 'text-purple-400'}`}>
                          {daysRemaining}
                        </div>
                        <div className="text-gray-300">Days remaining</div>
                      </div>
                    </>
                  )}
                  {!usageSummary && (
                    <div className="col-span-3 text-center py-8">
                      <div className="text-gray-500">Loading usage data...</div>
                    </div>
                  )}
                </div>
                {userPlan === "Free" && (
                  <div className="mt-6">
                    <p className="text-gray-300 mb-4">Ready to unlock more features?</p>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => document.getElementById('pro-card')?.scrollIntoView({ behavior: 'smooth' })}
                        variant="outline"
                        className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400"
                      >
                        View Pro Plans
                      </Button>
                    </div>
                  </div>
                )}
                {(userPlan === "pro" || userPlan === "pro+") && subscriptionExpiry && daysRemaining <= 7 && daysRemaining > 0 && (
                  <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-300 font-medium">
                          Subscription expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                        </p>
                        <p className="text-yellow-400 text-sm mt-1">
                          Renew your {userPlan} plan to continue enjoying premium features.
                        </p>
                      </div>
                      <Button
                        onClick={() => document.getElementById(`${userPlan.toLowerCase().replace('+', 'plus')}-card`)?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Renew Now
                      </Button>
                    </div>
                  </div>
                )}
                {(userPlan === "pro" || userPlan === "pro+") && subscriptionExpiry && daysRemaining === 0 && (
                  <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-300 font-medium">
                          Your subscription has expired
                        </p>
                        <p className="text-red-400 text-sm mt-1">
                          All premium features are now disabled. Renew to continue using our services.
                        </p>
                      </div>
                      <Button
                        onClick={() => document.getElementById(`${userPlan.toLowerCase().replace('+', 'plus')}-card`)?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Renew Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {pricingTiers.map((tier, index) => (
              <Card
                key={tier.name}
                id={`${tier.name.toLowerCase().replace('+', 'plus')}-card`}
                className={`relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 glow-border ${
                  tier.popular
                    ? "border-2 border-blue-500 shadow-xl bg-gray-800/50 dark:bg-gray-800/50 backdrop-blur-sm"
                    : "border border-gray-600 hover:border-gray-500 bg-gray-800/50 dark:bg-gray-800/50 backdrop-blur-sm"
                }`}
                role="article"
                aria-labelledby={`tier-${tier.name}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg border border-blue-400/50">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-12">
                  <CardTitle id={`tier-${tier.name}`} className="text-3xl font-bold text-white dark:text-white mb-4">
                    {tier.name}
                  </CardTitle>
                  <div className="mt-4 mb-4">
                    <div className="flex items-center justify-center gap-2">
                      {tier.originalPrice && (
                        <span className="text-2xl text-gray-400 dark:text-gray-400 line-through">
                          {tier.originalPrice}
                        </span>
                      )}
                      <span className="text-5xl font-extrabold text-white dark:text-white">
                        {tier.price}
                      </span>
                    </div>
                    {tier.period !== "pricing" && (
                      <span className="text-gray-300 dark:text-gray-300 ml-2 text-lg">/{tier.period}</span>
                    )}
                    {tier.savings && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/50 dark:bg-green-900/50 text-green-300 dark:text-green-300 border border-green-700/50">
                          {tier.savings}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="mt-4 text-gray-300 dark:text-gray-300 text-lg">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 px-8">
                  <ul className="space-y-4" role="list">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start" role="listitem">
                        <Check className="h-6 w-6 text-green-400 dark:text-green-400 mr-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-gray-300 dark:text-gray-300 text-base leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-8 px-8 pb-8">
                  <Button
                    className={`w-full text-lg font-semibold transition-all duration-200 ${
                      tier.popular
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
                        : ""
                    }`}
                    variant={tier.buttonVariant}
                    size="lg"
                    aria-label={`Select ${tier.name} plan`}
                    onClick={() => handlePayment(tier)}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : tier.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-600 p-12 glow-border">
            <h2 className="text-4xl font-bold text-white mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/20 px-6 hover:bg-white/20 dark:hover:bg-white/20 transition-all duration-300">
                  <AccordionTrigger className="text-left text-xl font-semibold text-white dark:text-white hover:text-blue-400 dark:hover:text-blue-400 py-6 hover:no-underline">
                    Can I change plans anytime?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 dark:text-gray-300 leading-relaxed pb-6">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing adjusts accordingly.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/20 px-6 hover:bg-white/20 dark:hover:bg-white/20 transition-all duration-300">
                  <AccordionTrigger className="text-left text-xl font-semibold text-white dark:text-white hover:text-blue-400 dark:hover:text-blue-400 py-6 hover:no-underline">
                    Is my data secure?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 dark:text-gray-300 leading-relaxed pb-6">
                    Absolutely. Your files are processed securely with end-to-end encryption and never stored on our servers without your explicit consent.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/20 px-6 hover:bg-white/20 dark:hover:bg-white/20 transition-all duration-300">
                  <AccordionTrigger className="text-left text-xl font-semibold text-white dark:text-white hover:text-blue-400 dark:hover:text-blue-400 py-6 hover:no-underline">
                    Do you offer refunds?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 dark:text-gray-300 leading-relaxed pb-6">
                    Due to the nature of our digital service, we do not offer refunds once a subscription has been purchased. Please review your plan choice carefully before purchasing.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/20 px-6 hover:bg-white/20 dark:hover:bg-white/20 transition-all duration-300">
                  <AccordionTrigger className="text-left text-xl font-semibold text-white dark:text-white hover:text-blue-400 dark:hover:text-blue-400 py-6 hover:no-underline">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 dark:text-gray-300 leading-relaxed pb-6">
                    We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers for Enterprise plans.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm" onClick={handleToggleMobileMenu}>
          <div className="bg-gray-800/95 backdrop-blur-md w-80 h-full p-6 rounded-r-3xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Menu</h2>
              <button
                onClick={handleToggleMobileMenu}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <ul className="space-y-4 pb-4">
                {/* All Navigation Items */}
                <li>
                  <button
                    onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                    className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                      location.pathname === "/"
                        ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                        : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">PDF Reordering</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/photo-to-image'); setIsMobileMenuOpen(false); }}
                    className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                      location.pathname === "/photo-to-image"
                        ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                        : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Photo to PDF</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/pdf-compress'); setIsMobileMenuOpen(false); }}
                    className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                      location.pathname === "/pdf-compress"
                        ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                        : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">PDF Compression</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/pdf-to-world'); setIsMobileMenuOpen(false); }}
                    className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                      location.pathname === "/pdf-to-world"
                        ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                        : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">PDF to Text</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }}
                    className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                      location.pathname === "/pricing"
                        ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                        : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Pricing</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/footer-info'); setIsMobileMenuOpen(false); }}
                    className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                      location.pathname === "/footer-info"
                        ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                        : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">About Us</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/footer-info'); setIsMobileMenuOpen(false); }}
                    className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                      location.pathname === "/footer-info"
                        ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                        : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Contact & Support</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/privacy-policy'); setIsMobileMenuOpen(false); }}
                    className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                      location.pathname === "/privacy-policy"
                        ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                        : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Privacy Policy</span>
                  </button>
                </li>

                {/* Account Section */}
                {isAuthenticated ? (
                  <>
                    <li className="pt-4 border-t border-gray-600">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full py-3 px-4 hover:bg-blue-900/30 hover:text-blue-300 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left border-2 border-transparent hover:border-blue-700"
                      >
                        <div className="flex items-center">
                          {photoUrl ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-blue-600">
                              <img
                                src={photoUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <User className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                          )}
                          <span className="truncate text-gray-300">My Profile</span>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="block w-full py-3 px-4 hover:bg-red-900/30 hover:text-red-400 hover:scale-105 hover:shadow-md rounded-xl transition-all duration-300 font-medium text-left border-2 border-transparent hover:border-red-700"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">Sign Out</span>
                        </div>
                      </button>
                    </li>
                  </>
                ) : (
                 <li className="pt-4 border-t border-gray-600">
                   <button
                     onClick={() => {
                       navigate('/login');
                       setIsMobileMenuOpen(false);
                     }}
                     className={`group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm overflow-hidden ${
                       location.pathname === "/login"
                         ? "bg-gray-700/50 text-blue-300 border-2 border-gray-600 shadow-lg backdrop-blur-md"
                         : "text-gray-300 hover:text-blue-400 bg-gray-800/30 hover:bg-gray-700/40 border-2 border-gray-600 hover:border-gray-500 backdrop-blur-sm"
                     }`}
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                     <FileText className="mr-2 h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
                     <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Sign In</span>
                   </button>
                 </li>
               )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;