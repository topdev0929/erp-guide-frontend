"use client";

import React, { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import TimePickerDialog from "@/app/components/settings/time-picker-dialog";
import TestAccountPopup from "@/app/components/test-account-popup";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  fetchUserSettings,
  saveNotificationSettings,
  handleLogout as logoutUser,
  saveTherapyPreferences,
} from "@/app/settings/settings-utils";
import TherapyPreferencesDialog from "@/app/components/settings/therapy-preferences-dialog";
import { BillingSection } from "./_components/sections/billing-section";
import { useAuth } from "../context/auth-context";
const SettingsPage = () => {
  const { logout } = useAuth();
  // State declarations
  const [showThankYou, setShowThankYou] = useState(false);
  const [userPhoneFromApi, setUserPhoneFromApi] = useState("");
  const [isTestAccount, setIsTestAccount] = useState(false);
  const [consistencyReminder, setConsistencyReminder] = useState<{
    time: string;
    enabled: boolean;
  }>({ time: "7:30am", enabled: false });
  const [showTimePickerDialog, setShowTimePickerDialog] = useState(false);
  const [pickerHour, setPickerHour] = useState("7");
  const [pickerMinute, setPickerMinute] = useState("30");
  const [pickerPeriod, setPickerPeriod] = useState("AM");
  const [settingsClicked, setSettingsClicked] = useState(false);
  const [accountClicked, setAccountClicked] = useState(false);
  const [showTestPopup, setShowTestPopup] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [therapyPreference, setTherapyPreference] = useState("detailed");
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const posthog = usePostHog();
  const router = useRouter();

  useEffect(() => {
    loadUserSettings();
  }, []);

  useEffect(() => {
    if (showTimePickerDialog) {
      const regex = /^(\d{1,2}):(\d{2})(am|pm)$/i;
      const match = consistencyReminder.time.match(regex);
      if (match) {
        setPickerHour(match[1]);
        setPickerMinute(match[2]);
        setPickerPeriod(match[3].toUpperCase());
      }
    }
  }, [showTimePickerDialog]);

  const loadUserSettings = async () => {
    setIsLoading(true);
    const settings = await fetchUserSettings();
    if (settings) {
      setUserPhoneFromApi(settings.userPhone);
      setIsTestAccount(settings.isTestAccount);
      setConsistencyReminder(settings.consistencyReminder);

      console.log("Loaded preference:", settings.therapyPreference);
      if (settings.therapyPreference) {
        setTherapyPreference(settings.therapyPreference);
      } else {
        setTherapyPreference("concise");
      }
    }
    setIsLoading(false);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const feedbackInput = form.elements.namedItem(
      "feedback"
    ) as HTMLTextAreaElement;
    const feedback = feedbackInput.value;
    await posthog.capture("survey sent", {
      $survey_id: "01925381-9b19-0000-55b6-464bfafd67e4",
      $survey_response: feedback,
    });
    feedbackInput.value = "";
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  const handleLogout = async () => {
    await logout();

    posthog.reset();
    router.push("/login");
  };

  const handleReminderToggle = async (enabled: boolean) => {
    setConsistencyReminder((prev) => {
      const newState = { ...prev, enabled };
      saveNotificationSettings(
        newState.enabled,
        newState.time,
        userPhoneFromApi
      );
      return newState;
    });
  };

  const handleTimePickerSave = () => {
    const newTime = `${pickerHour}:${pickerMinute}${pickerPeriod.toLowerCase()}`;
    setConsistencyReminder((prev) => {
      const newState = { ...prev, time: newTime };
      saveNotificationSettings(
        newState.enabled,
        newState.time,
        userPhoneFromApi
      );
      return newState;
    });
    setShowTimePickerDialog(false);
  };

  const handleSettingsClick = () => {
    if (accountClicked) {
      setShowTestPopup(true);
      // Reset the clicks
      setSettingsClicked(false);
      setAccountClicked(false);
    } else {
      setSettingsClicked(true);
    }
  };

  const handleAccountClick = () => {
    if (settingsClicked) {
      setShowTestPopup(true);
      // Reset the clicks
      setSettingsClicked(false);
      setAccountClicked(false);
    } else {
      setAccountClicked(true);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handlePreferenceChange = (value: string) => {
    setTherapyPreference(value);
    saveTherapyPreferences(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Skeleton Header */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-7 w-20" />
            <div className="w-6" />
          </div>
          <div className="px-4 pb-2">
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="divide-y">
          {/* Section Headers */}
          <div className="px-4 py-3 bg-muted/50">
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Settings Items */}
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              {i % 3 === 2 && (
                <div className="px-4 py-3 bg-muted/50">
                  <Skeleton className="h-5 w-24" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <button onClick={handleBack} className="text-[#1e543b]">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold" onClick={handleSettingsClick}>
              Settings
            </h1>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>
          <div className="px-4 pb-2 text-sm text-muted-foreground">
            {isTestAccount ? "T: " : ""}
            {userPhoneFromApi || "No phone number"}
          </div>
        </div>

        <div className="divide-y">
          {/* AI Guide Preferences Section */}
          <div className="px-4 py-3 bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">
              AI Guide
            </p>
          </div>

          <div
            className="flex items-center justify-between p-5 hover:bg-muted/50 cursor-pointer"
            onClick={() => setShowPreferencesDialog(true)}
          >
            <span className="text-base">Guide Style</span>
            <div className="flex items-center text-muted-foreground">
              <span className="mr-2 text-base">
                {therapyPreference === "detailed" ? "Detailed" : "Concise"}
              </span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="px-4 py-3 bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">
              Notifications
            </p>
          </div>

          <div className="flex items-center justify-between p-5">
            <span className="text-base">Consistency Reminder</span>
            <Switch
              className="scale-110"
              checked={consistencyReminder.enabled}
              onCheckedChange={handleReminderToggle}
            />
          </div>

          <div
            className={`flex items-center justify-between p-5 ${
              consistencyReminder.enabled
                ? "hover:bg-muted/50 cursor-pointer"
                : "opacity-50"
            }`}
            onClick={() =>
              consistencyReminder.enabled && setShowTimePickerDialog(true)
            }
          >
            <span className="text-base">Reminder Time</span>
            <div className="flex items-center text-muted-foreground">
              <span className="mr-2 text-base">{consistencyReminder.time}</span>
              {consistencyReminder.enabled && (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </div>

          {/* Billing Section */}
          <BillingSection />

          {/* Support Section */}
          <div className="px-4 py-3 bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">Support</p>
          </div>

          <div
            className="flex items-center justify-between p-5 hover:bg-muted/50 cursor-pointer"
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
          >
            <span className="text-base">Get Help</span>
            <ChevronRight
              className={`h-5 w-5 text-muted-foreground transition-transform ${
                showFeedbackForm ? "rotate-90" : ""
              }`}
            />
          </div>

          {showFeedbackForm && (
            <div className="px-4 py-5 space-y-4">
              <p className="text-base">
                We're here to help you get the most out of Mango. Let us know
                how we can assist—whether you have a question, need to report a
                bug, or want to request a new feature.
              </p>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <Textarea
                  id="feedbackInput"
                  name="feedback"
                  placeholder="Tell us what you need help with, or share any suggestions you have."
                  required
                  className="w-full text-base"
                />
                <Button type="submit" className="w-full py-6 text-base">
                  Submit Request
                </Button>
              </form>

              <Separator />

              <div className="space-y-2">
                <p className="text-base">
                  Customer Service Phone:{" "}
                  <a href="tel:+17164252242" className="text-[#2a7153]">
                    +1 (716) 425-2242
                  </a>
                </p>
                <p className="text-base">
                  Email:{" "}
                  <a
                    href="mailto:support@themangohealth.com"
                    className="text-[#2a7153]"
                  >
                    Support@TheMangoHealth.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Account Actions Section */}
          <div className="px-4 py-3 bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">
              Account Actions
            </p>
          </div>

          <button
            className="w-full text-left p-5 text-[#fd992d] hover:bg-muted/50 text-base border-b"
            onClick={handleLogout}
          >
            Log Out
          </button>

          {/* Empty div with increased padding to prevent navigation footer overlap */}
          <div className="pb-[60px]"></div>
        </div>
      </div>

      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thank You!</DialogTitle>
            <DialogDescription>We appreciate your feedback.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <TimePickerDialog
        open={showTimePickerDialog}
        onOpenChange={setShowTimePickerDialog}
        pickerHour={pickerHour}
        setPickerHour={setPickerHour}
        pickerMinute={pickerMinute}
        setPickerMinute={setPickerMinute}
        pickerPeriod={pickerPeriod}
        setPickerPeriod={setPickerPeriod}
        onSave={handleTimePickerSave}
      />

      <TestAccountPopup
        open={showTestPopup}
        onClose={() => {
          setShowTestPopup(false);
          setSettingsClicked(false);
          setAccountClicked(false);
        }}
      />

      {/* Therapy Preferences Dialog */}
      <TherapyPreferencesDialog
        open={showPreferencesDialog}
        onOpenChange={setShowPreferencesDialog}
        selected={therapyPreference}
        onValueChange={handlePreferenceChange}
      />
    </>
  );
};

export default SettingsPage;
