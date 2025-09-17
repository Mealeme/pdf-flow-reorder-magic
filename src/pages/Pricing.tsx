import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
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
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

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

  const pricingTiers = [
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
      price: "₹20",
      period: "per week",
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
      price: "₹40",
      period: "per month",
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

    const amount = tier.name === "Pro+" ? 4000 : 2000; // ₹40 or ₹20 in paisa

    const options = {
      key: "rzp_live_RFzqd2degwIWwJ",
      amount: amount,
      currency: "INR",
      name: "NewMicro",
      description: `${tier.name} Plan Subscription`,
      handler: async function (response: any) {
        console.log('Payment successful, updating subscription for user:', user.userId);

        try {
          // Calculate expiry
          const expiry = tier.name === "Pro+" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

          // Immediately update subscription in DynamoDB
          const upgradeResponse = await fetch("/api/subscription/upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.userId,
              plan: tier.name.toLowerCase(),
              expiry: expiry,
              paymentId: response.razorpay_payment_id
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation onMenuClick={() => {}} />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that fits your PDF processing needs. No hidden fees, no surprises.
            </p>
          </div>

          {/* Current Plan Benefits */}
          {isAuthenticated && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Current Plan: <span className={`${
                    userPlan === 'pro+' ? 'text-purple-600' :
                    userPlan === 'pro' ? 'text-blue-600' :
                    'text-gray-600'
                  } font-semibold`}>
                    {userPlan === 'pro+' ? 'Pro+' :
                     userPlan === 'pro' ? 'Pro' :
                     'Free'}
                  </span>
                  {subscriptionExpiry && daysRemaining > 0 && userPlan !== 'free' && (
                    <span className="text-sm text-gray-500 ml-4">
                      ({daysRemaining} days remaining)
                    </span>
                  )}
                  {subscriptionExpiry && daysRemaining === 0 && userPlan !== 'free' && (
                    <span className="text-sm text-red-500 ml-4">
                      (Expired - Renew to continue)
                    </span>
                  )}
                  {!subscriptionExpiry && userPlan !== 'free' && (
                    <span className="text-sm text-orange-500 ml-4">
                      (Subscription data loading...)
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {userPlan === "free" && usageSummary && (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {usageSummary.remaining.pdfUploads === -1 ? '∞' : usageSummary.remaining.pdfUploads}
                        </div>
                        <div className="text-gray-600">PDF uploads left</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Used: {usageSummary.usage.pdfUploads}/{usageSummary.limits.pdfUploads}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {usageSummary.remaining.pdfCompress === -1 ? '∞' : usageSummary.remaining.pdfCompress}
                        </div>
                        <div className="text-gray-600">Compress left</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Used: {usageSummary.usage.pdfCompress}/{usageSummary.limits.pdfCompress}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {usageSummary.remaining.pdfReorder === -1 ? '∞' : usageSummary.remaining.pdfReorder}
                        </div>
                        <div className="text-gray-600">Reorder left</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Used: {usageSummary.usage.pdfReorder}/{usageSummary.limits.pdfReorder}
                        </div>
                      </div>
                    </>
                  )}
                  {userPlan === "pro" && usageSummary && (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {usageSummary.remaining.pdfUploads === -1 ? '∞' : usageSummary.remaining.pdfUploads}
                        </div>
                        <div className="text-gray-600">PDFs left today</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Used: {usageSummary.usage.pdfUploads}/{usageSummary.limits.pdfUploads}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">50MB</div>
                        <div className="text-gray-600">Max file size</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${daysRemaining <= 3 ? 'text-red-600' : 'text-blue-600'}`}>
                          {daysRemaining}
                        </div>
                        <div className="text-gray-600">Days remaining</div>
                      </div>
                    </>
                  )}
                  {userPlan === "pro+" && usageSummary && (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">Unlimited</div>
                        <div className="text-gray-600">Daily PDFs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">Unlimited</div>
                        <div className="text-gray-600">File sizes</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${daysRemaining <= 7 ? 'text-red-600' : 'text-purple-600'}`}>
                          {daysRemaining}
                        </div>
                        <div className="text-gray-600">Days remaining</div>
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
                    <p className="text-gray-600 mb-4">Ready to unlock more features?</p>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => document.getElementById('pro-card')?.scrollIntoView({ behavior: 'smooth' })}
                        variant="outline"
                      >
                        View Pro Plans
                      </Button>
                    </div>
                  </div>
                )}
                {(userPlan === "pro" || userPlan === "pro+") && subscriptionExpiry && daysRemaining <= 7 && daysRemaining > 0 && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-800 font-medium">
                          Subscription expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                        </p>
                        <p className="text-yellow-700 text-sm mt-1">
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
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-800 font-medium">
                          Your subscription has expired
                        </p>
                        <p className="text-red-700 text-sm mt-1">
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
                className={`relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  tier.popular
                    ? "border-2 border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-white"
                    : "border border-gray-200 hover:border-gray-300 bg-white"
                }`}
                role="article"
                aria-labelledby={`tier-${tier.name}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-12">
                  <CardTitle id={`tier-${tier.name}`} className="text-3xl font-bold text-gray-900 mb-4">
                    {tier.name}
                  </CardTitle>
                  <div className="mt-4 mb-4">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {tier.price}
                    </span>
                    {tier.period !== "pricing" && (
                      <span className="text-gray-600 ml-2 text-lg">/{tier.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-4 text-gray-600 text-lg">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 px-8">
                  <ul className="space-y-4" role="list">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start" role="listitem">
                        <Check className="h-6 w-6 text-green-500 mr-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-gray-700 text-base leading-relaxed">{feature}</span>
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="group">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                  Can I change plans anytime?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing adjusts accordingly.
                </p>
              </div>
              <div className="group">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                  Is my data secure?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely. Your files are processed securely with end-to-end encryption and never stored on our servers without your explicit consent.
                </p>
              </div>
              <div className="group">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Due to the nature of our digital service, we do not offer refunds once a subscription has been purchased. Please review your plan choice carefully before purchasing.
                </p>
              </div>
              <div className="group">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers for Enterprise plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;