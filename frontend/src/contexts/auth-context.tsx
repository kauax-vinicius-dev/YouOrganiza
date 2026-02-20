"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";

interface AuthContextType {
  user: { name: string; position: string; credential: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{
    name: string;
    position: string;
    credential: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userName = Cookies.get("userName");
    const position = Cookies.get("position");
    const credential = Cookies.get("credential");
    if (token && userName) {
      Promise.resolve().then(() => {
        setUser({
          name: userName,
          position: position || "user",
          credential: credential || "user",
        });
      });
    }
    Promise.resolve().then(() => {
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, position, userName, credential, role } = response.data;
    const userCredential = credential || role || "user";
    Cookies.set("token", token, { expires: 1 });
    Cookies.set("userName", userName, { expires: 1 });
    Cookies.set("position", position || "");
    Cookies.set("credential", userCredential, { expires: 1 });
    setUser({
      name: userName,
      position: position || "",
      credential: userCredential,
    });
    router.push("/dashboard");
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userName");
    Cookies.remove("position");
    Cookies.remove("credential");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
