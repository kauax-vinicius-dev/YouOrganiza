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
      toast.success("Login realizado com sucesso!");
    } catch {
      toast.error("Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background flex items-center justify-end overflow-hidden">
      {/* Switch de tema no canto superior direito */}
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
      {/* Logo absoluta à esquerda */}
      <div className="hidden md:block absolute left-0 top-0 h-full w-1/2 z-10 p-7">
        <div className="flex items-center justify-center h-full">
          <div className="bg-secondary rounded-2xl shadow-2xl flex items-center justify-center h-full w-full">
            <Image
              src="/logo.png"
              alt="Logo da empresa"
              width={400}
              height={400}
              className="max-w-lg w-auto h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
      {/* Formulário à direita */}
      <div className="relative z-20 flex w-full md:w-1/2 min-h-screen items-center justify-center px-8 py-16">
        <Card className="w-full max-w-lg border-0 bg-transparent shadow-none p-6">
          <CardHeader className="text-center">
            <CardDescription className="text-primary text-xl tracking-wide font-bold">
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
                  className={`bg-white/10 placeholder:text-slate-400 py-7 text-lg px-4 focus:ring-2 focus:ring-primary/40 transition-all ${theme === "light" ? "border border-primary/50" : "border-none"}`}
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
                    className={`bg-white/10 placeholder:text-slate-400 py-7 text-lg px-4 mb-2 pr-12 focus:ring-2 focus:ring-primary/40 transition-all ${theme === "light" ? "border border-primary/50" : "border-none"}`}
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-4 text-slate-400 cursor-pointer hover:text-slate-200 focus:outline-none"
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
                className="w-full bg-primary text-foreground font-semibold rounded-lg py-7 text-lg text-center"
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
