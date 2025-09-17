import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ChevronRight, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { format } from "date-fns";

interface SubscriptionInfo {
  status: string;
  billing_cycle_anchor: number;
  plan: {
    interval: "month" | "year";
    amount: number;
  };
  cancel_at_period_end: boolean;
  cancel_at: number;
  current_period_end: number;
  metadata: {
    update_plan?: string;
  };
}

export function BillingSection() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>();
  const [loading, setLoading] = useState(false);

  const [showBillingInfo, setShowBillingInfo] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [priceInfo, setPriceInfo] = useState<{
    monthly: number;
    yearly: number;
  }>({
    monthly: 0,
    yearly: 0,
  });

  const fetchPriceInfo = async () => {
    const response = await apiCall(
      "/payment/prices/",
      ApiMethod.Get,
      "get price info"
    );
    setPriceInfo({
      monthly: response?.monthly?.unit_amount ?? 0,
      yearly: response?.yearly?.unit_amount ?? 0,
    });
  };

  const fetchSubScriptionDetail = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        "/payment/subscription/",
        ApiMethod.Get,
        "get subscription detail"
      );
      setSubscriptionInfo(response.subscription);
    } catch (error) {
      console.error("Failed to fetch subscription detail", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubScriptionDetail();
    fetchPriceInfo();
  }, []);

  const handleCancelClick = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        "/payment/subscription/",
        ApiMethod.Delete,
        "cancel subscription"
      );
      setSubscriptionInfo(response.subscription);
      setShowCancelModal(true);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const isSubscriptionActive = useMemo(() => {
    return (
      (!subscriptionInfo || !subscriptionInfo.cancel_at_period_end) &&
      subscriptionInfo?.status !== "canceled"
    );
  }, [subscriptionInfo]);

  const subscriptionText = useMemo(() => {
    if (!subscriptionInfo) {
      return "";
    }
    if (subscriptionInfo.cancel_at_period_end) {
      return `Your subscription ends on ${format(
        subscriptionInfo.cancel_at * 1000,
        "yyyy-MM-dd hh:mm aaa"
      )}.`;
    }
    if (subscriptionInfo.status === "trialing") {
      return `Your free trial converts to a paid subscription on ${format(
        subscriptionInfo.current_period_end * 1000,
        "yyyy-MM-dd hh:mm aaa"
      )}.`;
    }

    if (subscriptionInfo.plan.interval === "month") {
      return `Your monthly subscription renews on ${format(
        subscriptionInfo.current_period_end * 1000,
        "yyyy-MM-dd hh:mm aaa"
      )}.`;
    }

    if (subscriptionInfo.plan.interval === "year") {
      return `Your annual subscription renews on ${format(
        subscriptionInfo.current_period_end * 1000,
        "yyyy-MM-dd hh:mm aaa"
      )}.`;
    }

    return "";
  }, [subscriptionInfo]);

  const handleChangePlan = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        "/payment/subscription/",
        ApiMethod.Put,
        "update plan",
        {
          plan:
            subscriptionInfo?.plan.interval === "month" ? "yearly" : "monthly",
        }
      );
      setSubscriptionInfo(response.subscription);
    } catch (error) {
      console.error("Failed to change plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        "/payment/subscription/",
        ApiMethod.Post,
        "reactivate subscription"
      );
      setSubscriptionInfo(response.subscription);
    } catch (error) {
      console.error("Failed to reactivate subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpdatePlan = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        "/payment/subscription/",
        ApiMethod.Put,
        "cancel update plan",
        {
          plan: "",
        }
      );
      setSubscriptionInfo(response.subscription);
    } catch (error) {
      console.error("Failed to cancel update plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = subscriptionInfo?.metadata.update_plan ?? "cancelled";

  const nextPayAmount = useMemo(() => {
    if (updatePlan !== "cancelled") {
      if (updatePlan === "yearly") {
        return priceInfo.yearly;
      }
      return priceInfo.monthly;
    }
    return subscriptionInfo?.plan.amount;
  }, [subscriptionInfo, priceInfo]);

  return (
    <>
      <div className="px-4 py-3 bg-muted/50">
        <p className="text-sm font-medium text-muted-foreground">Billing</p>
      </div>

      <div
        className="flex items-center justify-between p-5 hover:bg-muted/50 cursor-pointer"
        onClick={() => setShowBillingInfo(!showBillingInfo)}
      >
        <span className="text-base">Subscription</span>
        <ChevronRight
          className={`h-5 w-5 text-muted-foreground transition-transform ${
            showBillingInfo ? "rotate-90" : ""
          }`}
        />
      </div>

      {showBillingInfo && (
        <div className="px-4 py-5 space-y-4 relative">
          {loading && (
            <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
              <LoaderCircle className="text-black animate-spin" />
            </div>
          )}
          <p className="text-base">{subscriptionText}</p>
          {!loading && (
            <p className="text-base">
              Your next payment of $
              {`${nextPayAmount / 100} is scheduled for ${format(
                subscriptionInfo.current_period_end * 1000,
                "yyyy-MM-dd hh:mm aaa"
              )}.`}
            </p>
          )}

          {!loading && (
            <>
              {isSubscriptionActive ? (
                <>
                  {updatePlan !== "cancelled" && (
                    <p className="text-base">
                      {`Your subscription will be updated to ${updatePlan} on ${format(
                        subscriptionInfo.current_period_end * 1000,
                        "yyyy-MM-dd hh:mm aaa"
                      )}.`}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-4">
                    {updatePlan !== "cancelled" ? (
                      <Button
                        variant="default"
                        className="w-full py-6 text-base"
                        onClick={handleCancelUpdatePlan}
                      >
                        Cancel Update
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full py-6 text-base"
                        onClick={handleChangePlan}
                      >
                        Switch to{" "}
                        {subscriptionInfo?.plan.interval === "month"
                          ? "Yearly"
                          : "Monthly"}
                      </Button>
                    )}
                    <Button
                      onClick={handleCancelClick}
                      variant="destructive"
                      className="w-full py-6 text-base"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="default"
                    className="w-full py-6 text-base"
                    onClick={handleReactivateSubscription}
                  >
                    Reactivate Subscription
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-normal">
              Subscription Cancelled
            </DialogTitle>
            <DialogDescription>
              Your subscription will end at the end of billing period.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              setShowCancelModal(false);
              fetchSubScriptionDetail();
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
