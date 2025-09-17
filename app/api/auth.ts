// import { Navigate } from 'react-router-dom';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("📡 API_URL environment variable set to:", API_URL);

// Create a secure token service
export const TokenService = {
  getToken: () => {
    // Get from cookie instead of localStorage
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    console.log(
      "🍪 Getting token from cookie:",
      cookie ? `found (length: ${cookie.length})` : "not found"
    );
    return cookie;
  },
  setToken: (token: string) => {
    console.log("🔐 Setting token in cookie, token length:", token.length);
    // Set both cookie and localStorage for backward compatibility
    document.cookie = `authToken=${token}; path=/`;
    console.log("🔄 Cookie after setting:", document.cookie);
    window.dispatchEvent(new Event("authChange")); // Dispatch auth change event when token is set
  },
  removeToken: () => {
    console.log("🗑️ Removing token from cookie and localStorage");
    // Remove from both cookie and localStorage
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    console.log("🔄 Cookie after removal:", document.cookie);
    window.dispatchEvent(new Event("authChange")); // Dispatch auth change event when token is removed
  },
  isAuthenticated: () => {
    if (typeof window === "undefined") {
      // Running on the server, so localStorage is not available
      console.log("🖥️ Running on server, returning false for isAuthenticated");
      return false;
    }
    const hasToken = !!TokenService.getToken();
    console.log("🔑 isAuthenticated check result:", hasToken);
    return hasToken;
  },
};

const refreshToken = async () => {
  const response = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${TokenService.getToken()}`,
    },
  });
  const { token } = await response.json();
  TokenService.setToken(token);
  return token;
};

const logout = () => {
  TokenService.removeToken();
  // Redirect to login page
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  if (!TokenService.isAuthenticated()) {
    // return <Navigate to="/login" />;
  }

  return children;
};
