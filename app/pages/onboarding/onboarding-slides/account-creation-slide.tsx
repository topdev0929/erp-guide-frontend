import React, { useState } from "react";
import styles from "./account-creation-slide.module.css";
import { SignInSignUpForm } from "@/app/components/auth/sign-in-sign-up-form";
import { useAuth } from "@/app/context/auth-context";

type AccountCreationSlideProps = {
  title: string;
  onSubmit: () => void;
  onSaveAccountDetails: () => void;
};

const AccountCreationSlide = ({
  title,
  onSubmit,
  onSaveAccountDetails,
}: AccountCreationSlideProps) => {
  const { checkAccess } = useAuth();

  const handleSignUp = async () => {
    try {
      onSubmit();
    } catch (error) {
      console.error("Error during account creation:", error);
    }
  };

  return (
    <div className={styles.slide}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.introSlide}>
        <img src="/full-logo.png" alt="Mango Logo" className={styles.logo} />

        <SignInSignUpForm type="sign-up" onSuccess={handleSignUp} />

        <div className={styles.policyLinks}>
          <a href="/privacy-policy" className={styles.link}>
            Privacy Policy
          </a>
          {" | "}
          <a href="/terms-of-service" className={styles.link}>
            Terms of Service
          </a>
        </div>
        <div className={styles.loginPrompt}>
          Already have an account?
          <a href="/login" className={styles.loginLink}>
            Log in
          </a>
        </div>
        <p
          style={{
            marginTop: 12,
            fontSize: "0.875rem",
            color: "#b91c1c",
            textAlign: "center",
          }}
        >
          Important: Mango is not currently available to residents of Illinois.
          Please do not use this service if you reside in Illinois.
        </p>
      </div>
    </div>
  );
};

export default AccountCreationSlide;
