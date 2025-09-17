import React, { useState, useEffect } from "react";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { Button } from "@/components/ui/button";

const TestAccountSettings = () => {
  const [isTestAccount, setIsTestAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTestAccount = async () => {
      try {
        const data = await apiCall(
          '/user/test-account/',
          ApiMethod.Get,
          'check test account status'
        );
        setIsTestAccount(data?.test_account || false);
      } catch (error) {
        console.error('Failed to check test account status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTestAccount();
  }, []);

  const handleDisableTestAccount = async () => {
    try {
      await apiCall(
        '/user/test-account/',
        ApiMethod.Post,
        'disable test account',
        { test_account: false }
      );
      setIsTestAccount(false);
    } catch (error) {
      console.error('Failed to disable test account:', error);
    }
  };

  if (isLoading || !isTestAccount) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-lg font-semibold text-[#1e543b] mb-2">
          Test Account Settings
        </h3>
        <p className="text-sm text-[#1e543b] mb-4">
          This account is currently set as a test account.
        </p>
        <Button
          onClick={handleDisableTestAccount}
          variant="destructive"
        >
          Disable Test Account
        </Button>
      </div>
    </div>
  );
};

export default TestAccountSettings; 