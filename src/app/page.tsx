"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Globe,
  Lock,
  MessageSquare,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Page() {
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="font-bold text-xl">SynapseAI</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#why-us"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Why Choose Us
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t bg-background/95 backdrop-blur"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="container py-4 space-y-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="#features"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#why-us"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Why Choose Us
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </nav>
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-6 w-fit">
                  <span className="font-medium">New Features Available</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  Build Intelligent AI Agents for Your Business
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  SynapseAI platform empowers you to create, deploy, and manage
                  AI agents that transform your business operations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button size="lg" className="group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Book a Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                          alt={`User ${i}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">500+</span> companies already
                    onboard
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="relative mx-auto w-full max-w-[500px] aspect-video"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-foreground/20 blur-3xl opacity-20" />
                <div className="relative rounded-xl border bg-card p-1 shadow-xl">
                  <div className="rounded-lg bg-muted aspect-video overflow-hidden">
                    <img
                      src="/dashboard-preview.png"
                      alt="Platform Dashboard"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400/2563eb/ffffff?text=SynapseAI+Dashboard";
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-muted-foreground">
                TRUSTED BY INNOVATIVE COMPANIES
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 grayscale opacity-70">
              {[
                "Microsoft",
                "Google",
                "Amazon",
                "IBM",
                "Oracle",
                "Salesforce",
              ].map((company) => (
                <div key={company} className="flex items-center justify-center">
                  <span className="text-xl font-bold">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                Everything you need to build, deploy, and manage intelligent AI
                agents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-primary" />,
                  title: "AI Agent Creation",
                  description:
                    "Build custom AI agents with our intuitive drag-and-drop interface. No coding required.",
                },
                {
                  icon: <Globe className="h-8 w-8 text-primary" />,
                  title: "Seamless Integration",
                  description:
                    "Connect to your existing tools and systems with our extensive library of pre-built integrations.",
                },
                {
                  icon: <Lock className="h-8 w-8 text-primary" />,
                  title: "Enterprise Security",
                  description:
                    "Bank-grade security with SOC 2 compliance and end-to-end encryption for all your data.",
                },
                {
                  icon: <MessageSquare className="h-8 w-8 text-primary" />,
                  title: "Natural Language Processing",
                  description:
                    "Advanced NLP capabilities to understand and process human language with high accuracy.",
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Workflow Automation",
                  description:
                    "Automate complex business processes with intelligent workflows that adapt and learn.",
                },
                {
                  icon: <Zap className="h-8 w-8 text-primary" />,
                  title: "Real-time Analytics",
                  description:
                    "Monitor performance and gain insights with comprehensive analytics and reporting.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-start p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="p-3 rounded-lg bg-primary/10 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-us" className="py-20 md:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="relative rounded-xl border bg-card shadow-xl overflow-hidden"
              >
                <div className="aspect-video">
                  <img
                    src="/why-choose-us.png"
                    alt="Platform Benefits"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400/2563eb/ffffff?text=Why+Choose+SynapseAI";
                    }}
                  />
                </div>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Why Choose SynapseAI
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    We deliver exceptional value through our cutting-edge AI
                    platform designed specifically for enterprise needs.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      title: "Unmatched Performance",
                      description:
                        "Our AI agents deliver 99.9% accuracy and process requests 10x faster than competitors.",
                    },
                    {
                      title: "Dedicated Support",
                      description:
                        "24/7 expert support with dedicated customer success managers for enterprise clients.",
                    },
                    {
                      title: "Continuous Innovation",
                      description:
                        "Weekly updates with new features and improvements based on customer feedback.",
                    },
                    {
                      title: "Scalable Infrastructure",
                      description:
                        "Built to handle millions of operations per second with 99.99% uptime guarantee.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="mr-4 mt-1">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Button size="lg" className="group">
                    Learn More
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Clients Say
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                Trusted by leading companies around the world
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "SynapseAI has transformed how we handle customer support. Our response time has decreased by 80% while customer satisfaction increased by 35%.",
                  author: "Sarah Johnson",
                  role: "CTO, TechCorp",
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                },
                {
                  quote:
                    "The workflow automation capabilities are incredible. We've automated 75% of our manual processes, saving over 2,000 hours per month.",
                  author: "Michael Chen",
                  role: "Operations Director, Global Logistics",
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                },
                {
                  quote:
                    "Implementation was seamless and the ROI was immediate. Within 3 months, we saw a 40% reduction in operational costs.",
                  author: "Emma Rodriguez",
                  role: "VP of Innovation, Finance Plus",
                  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col p-6 bg-card rounded-xl border shadow-sm"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="flex-1">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="h-5 w-5 fill-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-6">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                Choose the perfect plan for your business needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "$49",
                  description: "Perfect for small teams just getting started",
                  features: [
                    "5 AI agents",
                    "10 workflows",
                    "Basic integrations",
                    "Standard support",
                    "1,000 operations/month",
                  ],
                  cta: "Start Free Trial",
                  popular: false,
                },
                {
                  name: "Professional",
                  price: "$199",
                  description:
                    "Ideal for growing businesses with advanced needs",
                  features: [
                    "25 AI agents",
                    "Unlimited workflows",
                    "Advanced integrations",
                    "Priority support",
                    "50,000 operations/month",
                    "Custom training",
                  ],
                  cta: "Start Free Trial",
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description:
                    "For large organizations with specific requirements",
                  features: [
                    "Unlimited AI agents",
                    "Unlimited workflows",
                    "Custom integrations",
                    "24/7 dedicated support",
                    "Unlimited operations",
                    "On-premise deployment",
                    "SLA guarantee",
                  ],
                  cta: "Contact Sales",
                  popular: false,
                },
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col p-6 bg-card rounded-xl border ${plan.popular ? "border-primary shadow-lg relative" : "shadow-sm"}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && (
                        <span className="ml-1 text-muted-foreground">
                          /month
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <div className="flex-1 mb-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    className={`w-full ${plan.popular ? "" : "bg-muted hover:bg-muted/80 text-foreground"}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Stay Updated with SynapseAI
                </h2>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  Subscribe to our newsletter for the latest updates, industry
                  insights, and exclusive offers.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-2 max-w-[500px] mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button className="sm:w-auto">Subscribe</Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  By subscribing, you agree to our Privacy Policy and Terms of
                  Service.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Transform Your Business?
                </h2>
                <p className="mt-4 md:text-xl opacity-90">
                  Start building intelligent AI agents today and stay ahead of
                  the competition.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
                  <span className="text-primary-foreground font-bold">S</span>
                </div>
                <span className="font-bold text-xl">SynapseAI</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-[300px]">
                Empowering businesses with intelligent AI solutions that drive
                growth and innovation.
              </p>
              <div className="flex space-x-4">
                {["twitter", "linkedin", "facebook", "github"].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 rounded-full bg-muted-foreground/30" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                {[
                  "Features",
                  "Pricing",
                  "Integrations",
                  "Roadmap",
                  "Changelog",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {["About", "Careers", "Blog", "Press", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                {[
                  "Documentation",
                  "Tutorials",
                  "API Reference",
                  "Community",
                  "Support",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SynapseAI. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
