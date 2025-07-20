"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowLeft, Check } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setIsLoading(true);

    // Simulate registration delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard on successful registration
      router.push("/dashboard");
    }, 2000);
  };

  const handleSSORegister = (provider: string) => {
    setIsLoading(true);

    // Simulate SSO registration delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard on successful SSO registration
      router.push("/dashboard");
    }, 1500);
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
            href="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
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
              Start your AI journey today
            </h1>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Join thousands of companies already using SynapseAI to build
              intelligent agents and transform their operations.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Free 14-day trial
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Register Form */}
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
              <p className="text-muted-foreground">Create your account</p>
            </div>

            <Card className="border-0 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">
                  Create Account
                </CardTitle>
                <CardDescription className="text-base">
                  Get started with your free SynapseAI account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="h-11 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="h-11 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={handleCheckboxChange("agreeToTerms")}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm font-normal cursor-pointer leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={handleCheckboxChange(
                          "subscribeNewsletter",
                        )}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="newsletter"
                        className="text-sm font-normal cursor-pointer leading-relaxed"
                      >
                        Subscribe to our newsletter for updates and tips
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium"
                    disabled={isLoading || !formData.agreeToTerms}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-medium">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleSSORegister("google")}
                    disabled={isLoading}
                    className="h-11"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleSSORegister("microsoft")}
                    disabled={isLoading}
                    className="h-11"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M0 0h11.5v11.5H0V0zm12.5 0H24v11.5H12.5V0zM0 12.5h11.5V24H0V12.5zm12.5 0H24V24H12.5V12.5z"
                      />
                    </svg>
                    Microsoft
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign in
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
