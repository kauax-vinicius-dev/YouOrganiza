"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/theme-context";
import { messages } from "@/lib/messages";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(messages.loginSuccess);
    } catch {
      toast.error(messages.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background relative flex min-h-screen w-full items-center justify-end overflow-hidden">
      <div className="absolute top-6 right-6 z-30">
        <div className="flex items-center gap-2 px-2 py-1">
          <Sun
            className={`h-5 w-5 ${theme === "light" ? "text-yellow-400" : "text-slate-400"}`}
          />
          <Switch
            checked={theme === "light"}
            onCheckedChange={toggleTheme}
            className=""
          />
          <Moon
            className={`h-5 w-5 ${theme === "dark" ? "text-slate-300" : "text-slate-400"}`}
          />
        </div>
      </div>
      <div className="absolute top-0 left-0 z-10 hidden h-full w-1/2 p-7 md:block">
        <div className="flex h-full items-center justify-center">
          <div className="bg-secondary flex h-full w-full items-center justify-center rounded-2xl shadow-2xl">
            <Image
              src="/logo.png"
              alt="Logo da empresa"
              width={400}
              height={400}
              className="h-auto w-auto max-w-lg object-contain"
              priority
            />
          </div>
        </div>
      </div>
      <div className="relative z-20 flex min-h-screen w-full items-center justify-center px-8 py-16 md:w-1/2">
        <Card className="w-full max-w-lg border-0 bg-transparent p-6 shadow-none">
          <CardHeader className="text-center">
            <CardDescription className="text-primary text-xl font-bold tracking-wide">
              Entre seu email e senha para acessar o sistema de gerenciamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-primary text-base font-semibold"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@you.bpotech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  className={`focus:ring-primary/40 bg-white/10 px-4 py-7 text-lg transition-all placeholder:text-slate-400 focus:ring-2 ${theme === "light" ? "border-primary/50 border" : "border-none"}`}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-primary text-base font-semibold"
                >
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className={`focus:ring-primary/40 mb-2 bg-white/10 px-4 py-7 pr-12 text-lg transition-all placeholder:text-slate-400 focus:ring-2 ${theme === "light" ? "border-primary/50 border" : "border-none"}`}
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-slate-200 focus:outline-none"
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="bg-primary text-foreground w-full rounded-lg py-7 text-center text-lg font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
