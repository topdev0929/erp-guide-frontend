"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ApiMethod } from "@/app/types/types";
import { apiCall } from "../api/api-utils";
import { LoadingScreen } from "@/app/components/loading-screen";
import { API_URL, TokenService } from "../api/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  hasAccess: boolean;
  setHasAccess: (hasAccess: boolean) => void;
  newCustomer: boolean;
  logout: () => Promise<void>;
  checkAccess: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [newCustomer, setNewCustomer] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const checkAccess = async () => {
    setIsLoading(true);

    apiCall("/auth/has-access", ApiMethod.Get, "Checking access")
      .then((response) => {
        setIsAuthenticated(true);
        setHasAccess(response.has_access);
        setNewCustomer(response.new_customer);
      })
      .catch(() => {
        console.log("Error checking access");
        setIsAuthenticated(false);
        setHasAccess(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = async () => {
    TokenService.removeToken();

    await checkAccess();
  };

  useEffect(() => {
    checkAccess();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        hasAccess,
        setHasAccess,
        newCustomer,
        logout,
        checkAccess,
      }}
    >
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
