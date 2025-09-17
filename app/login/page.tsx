"use client";
import styles from "./page.module.css";
import { useProtectAuthRoute } from "@/hooks/useAuthHooks";
import { SignInSignUpForm } from "../components/auth/sign-in-sign-up-form";
import { usePostHog } from "posthog-js/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";

const Login = () => {
  useProtectAuthRoute();

  const { checkAccess } = useAuth();

  const posthog = usePostHog();
  const router = useRouter();

  const handleLogin = async (phone: string) => {
    await checkAccess();

    posthog.identify(phone);
    posthog.people.set({ phone });
    router.push("/chat");
  };

  return (
    <main className={`${styles.main} ${styles.mainContainer}`}>
      <div className={styles.container}>
        <img src="/full-logo.png" alt="Mango Logo" className={styles.logo} />
        <h1 className={styles.title}>Login</h1>
        <SignInSignUpForm type="sign-in" onSuccess={handleLogin} />
        <div className={styles.policyLinks}>
          <a href="/privacy-policy" className={styles.link}>
            Privacy Policy
          </a>
          {" | "}
          <a href="/terms-of-service" className={styles.link}>
            Terms of Service
          </a>
        </div>
        <p className={styles.supportText}>
          For help or any questions, please email us at{" "}
          <a href="mailto:support@themangohealth.com" className={styles.link}>
            support@themangohealth.com
          </a>
        </p>
        <div className={styles.signUpLinkContainer}>
          <span className={styles.signUpText}>Don't have an account?</span>
          <a href="/pages/onboarding" className={styles.signUpLink}>
            Sign Up
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
    </main>
  );
};

export default Login;
