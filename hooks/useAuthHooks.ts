import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";

export interface ProtectRouteProps {
  redirectTo?: string;
}

export function useProtectRoute({ redirectTo }: ProtectRouteProps = {}) {
  const router = useRouter();

  const { isAuthenticated, hasAccess, newCustomer } = useAuth();

  if (!isAuthenticated) {
    router.push(redirectTo ?? "/login");
    return;
  }

  if (!hasAccess) {
    if (newCustomer) {
      router.push("/pages/onboarding/payment");
    } else {
      router.push("/pages/resubscribe-payment");
    }
  }
}

export function useProtectAuthRoute({ redirectTo }: ProtectRouteProps = {}) {
  const router = useRouter();

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    router.push(redirectTo ?? "/chat");
  }
}

export function useProtectSubscriptionRoute() {
  const router = useRouter();

  const { isAuthenticated, hasAccess } = useAuth();

  if (!isAuthenticated) {
    router.push("/login");
  }

  if (hasAccess) {
    router.push("/chat");
  }
}
