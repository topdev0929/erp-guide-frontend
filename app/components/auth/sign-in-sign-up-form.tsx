import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/ui/phone-input";
import { TokenService } from "@/app/api/auth";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { useAuth } from "@/app/context/auth-context";

export interface SignInSignUpFormProps {
  type: "sign-in" | "sign-up";
  onSuccess: (phone: string) => void;
}

export function SignInSignUpForm({ onSuccess, type }: SignInSignUpFormProps) {
  const { setIsAuthenticated } = useAuth();
  const [messageSid, setMessageSid] = useState<string>();
  const [phone, setPhone] = useState("");

  const [remainingTime, setRemainingTime] = useState<number>(0);
  const intervalId = useRef<NodeJS.Timeout>();

  const [error, setError] = useState("");
  const [allowListNotification, setAllowListNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<string>("");

  const startTimer = () => {
    setRemainingTime(300);

    if (intervalId.current) {
      clearInterval(intervalId.current);
    }

    intervalId.current = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);
  };

  useEffect(() => {
    if (remainingTime < 0) {
      clearInterval(intervalId.current);
      setRemainingTime(0);
    }
  }, [remainingTime]);

  const handleAuthenticate = async (code: string) => {
    setIsLoading(true);
    setError("");
    try {
      if (type === "sign-in") {
        const data = await apiCall(
          "/auth/login/",
          ApiMethod.Post,
          "Logging in",
          {
            phone: phone,
            code: code,
          }
        );
        const { token } = data;
        TokenService.setToken(token);

        setIsAuthenticated(true);
        onSuccess(phone);
      } else {
        const data = await apiCall(
          "/auth/register/",
          ApiMethod.Post,
          "Registering",
          {
            phone: phone,
            code: code,
            country_code: countryCode,
          }
        );
        const { token } = data;
        TokenService.setToken(token);

        setIsAuthenticated(true);
        onSuccess(phone);
      }
    } catch (error) {
      if (
        error.error_message.includes(
          "The passcode was incorrect and could not be authenticated"
        )
      ) {
        setError("The code was incorrect.");
      } else {
        setError(error.error_message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPhoneNumberExists = async (phone: string) => {
    try {
      const data = await apiCall(
        `/auth/check-phone/?phone=${phone}`,
        ApiMethod.Get,
        "Checking phone number"
      );

      return data.exists;
    } catch {}
    return false;
  };

  const sendCode = async (phone: string) => {
    const data = await apiCall(
      "/auth/check-phone/",
      ApiMethod.Post,
      "Sending code",
      {
        phone: phone,
      }
    );
    console.log(data);
    return data;
  };

  const handleSendCode = async () => {
    if (isLoading) {
      return;
    }

    setError("");

    if (!phone || (!isValidPhoneNumber(phone) && type === "sign-up")) {
      setError("Please enter a valid phone number");
      return;
    }

    const country = parsePhoneNumber(phone)?.countryCallingCode;
    if (!country) {
      setError("Invalid country code");
      return;
    }
    setCountryCode(country);

    setIsLoading(true);
    const phoneNumberExists = await getPhoneNumberExists(phone);

    try {
      if (type === "sign-in") {
        if (!phoneNumberExists) {
          setError("Phone number does not exist");
        } else {
          const data = await sendCode(phone);
          if (!data) {
            setError("Failed to send code");
            return;
          }
          if (data.allowlist_notification) {
            setAllowListNotification(data.allowlist_notification);
          }
          setMessageSid(data.message_sid);
          startTimer();
        }
      } else {
        if (phoneNumberExists) {
          setError("Phone number already exists");
        } else {
          const data = await sendCode(phone);
          if (!data) {
            setError("Failed to send code");
            return;
          }
          setMessageSid(data.message_sid);
          startTimer();
        }
      }
    } catch (error) {
      setError(error.error_message);
    } finally {
      setIsLoading(false);
    }
  };

  if (messageSid || allowListNotification) {
    return (
      <div className="flex flex-col items-start justify-start">
        {error && <p className={styles.error}>{error}</p>}
        <div className="font-bold w-fit text-xl mb-4">Enter code</div>
        <p className="mb-4 w-fit">
          {allowListNotification ? (
            allowListNotification
          ) : (
            <>
              A 6-digit code was sent to you at{" "}
              <span className="font-bold">{phone}</span>.
            </>
          )}
        </p>
        <div className="w-full">
          <InputOTP
            maxLength={6}
            onComplete={handleAuthenticate}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className="w-fit text-gray-600 mt-4 text-start">
          {remainingTime > 0
            ? `Your code expires in ${Math.floor(remainingTime / 60)}:${
                remainingTime % 60
              }. Didn't get it? `
            : "Your code has expired. Didn't get it? "}
          <span className="font-bold cursor-pointer" onClick={handleSendCode}>
            Resend code
          </span>
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && <p className={styles.error}>{error}</p>}

      <PhoneInput
        value={phone}
        onChange={setPhone}
        disabled={isLoading}
        className="py-4"
        placeholder="Your phone number"
        defaultCountry="US"
      />

      <button
        type="submit"
        className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
        disabled={isLoading}
        onClick={handleSendCode}
      >
        {isLoading ? (
          <span className={styles.loadingText}>
            <span className={styles.spinner}></span>
            Sending Code...
          </span>
        ) : (
          "Send Code"
        )}
      </button>
    </div>
  );
}
