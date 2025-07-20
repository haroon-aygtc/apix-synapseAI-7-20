"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate email sending delay
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 2000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Sign In</span>
          </Link>
          <ThemeSwitcher />
        </div>
      </header>

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Branding */}
        <motion.div
          className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
                <span className="text-primary-foreground font-bold text-xl">
                  S
                </span>
              </div>
              <span className="font-bold text-2xl">SynapseAI</span>
            </div>

            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Secure account recovery
            </h1>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Don't worry, it happens to the best of us. We'll help you get back
              into your account quickly and securely.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Secure password reset process
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Email verification required
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Account protection guaranteed
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Reset Form */}
        <motion.div
          className="flex items-center justify-center p-6 lg:p-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                  <span className="text-primary-foreground font-bold">S</span>
                </div>
                <span className="font-bold text-xl">SynapseAI</span>
              </div>
              <p className="text-muted-foreground">Reset your password</p>
            </div>

            <Card className="border-0 shadow-2xl">
              <CardHeader className="text-center pb-6">
                {!isEmailSent ? (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      Forgot Password?
                    </CardTitle>
                    <CardDescription className="text-base">
                      Enter your email address and we'll send you a link to
                      reset your password
                    </CardDescription>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      Check Your Email
                    </CardTitle>
                    <CardDescription className="text-base">
                      We've sent a password reset link to {email}
                    </CardDescription>
                  </>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEmailSent ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending reset link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Didn't receive the email? Check your spam folder or
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEmailSent(false);
                          setEmail("");
                        }}
                        className="text-sm"
                      >
                        Try a different email address
                      </Button>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">What's next?</h4>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Check your email inbox</li>
                        <li>Click the reset link in the email</li>
                        <li>Create a new secure password</li>
                        <li>Sign in with your new password</li>
                      </ol>
                    </div>
                  </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
