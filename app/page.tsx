"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LockIcon,
  BrainCircuitIcon,
  UserIcon,
  ShieldIcon,
  DollarSignIcon,
  MailIcon,
  PhoneIcon,
  MenuIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  Users,
  Award,
  HeartHandshake,
} from "lucide-react";
import MangoLogo from "@/public/icons/full-logo-black.svg";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { TokenService } from "@/app/api/auth";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const posthog = usePostHog();

  // If the user is logged in; skip the home page.
  useEffect(() => {
    posthog.capture("onboarding_slide_viewed", { slide: 0 });
  }, []);

  const handleClick = (e) => {
    router.push("/pages/onboarding/");
  };

  return (
    <div className="min-h-screen bg-white text-[#1e543b]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <MenuIcon className="h-12 w-12" strokeWidth="3" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col space-y-4 mt-6">
                  <Button
                    onClick={() => router.push("/pages/onboarding")}
                    className="bg-[#349934] hover:bg-[#1e543b] text-white w-full"
                  >
                    Try for free
                  </Button>
                  <Button
                    onClick={() => router.push("/login")}
                    variant="outline"
                    className="w-full"
                  >
                    Log in
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-32">
              <Image
                src={MangoLogo}
                alt="Mango Health"
                width={128}
                height={32}
              />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/login"
              className="text-[#1e543b] hover:text-[#349934] font-medium"
            >
              Log in
            </Link>
            <Button
              onClick={() => router.push("/pages/onboarding")}
              className="bg-[#349934] hover:bg-[#1e543b] text-white"
            >
              Try for free
            </Button>
          </div>
          <div className="flex md:hidden items-center">
            <Link
              href="/login"
              className="text-[#1e543b] hover:text-[#349934] font-medium text-sm mr-2"
            >
              Log in
            </Link>
            <Button
              onClick={() => router.push("/pages/onboarding")}
              className="bg-[#349934] hover:bg-[#1e543b] text-white text-sm px-3 py-1"
            >
              Try free
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        {/* Section 1: Hero & Product Overview */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">The AI Guide for OCD</h1>
          <p className="mb-6 text-lg">
            A conversational guide providing OCD support and guided ERP
            sessions.
          </p>
          <Button
            onClick={() => router.push("/pages/onboarding")}
            className="bg-[#349934] hover:bg-[#1e543b] text-white text-lg py-8 px-8 mb-12"
          >
            Try for free
          </Button>
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity mt-4">
            <span className="text-lg font-medium">Backed by</span>
            <Link
              href="https://www.ycombinator.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/ycombinator.png"
                alt="Y Combinator"
                width={120}
                height={20}
              />
            </Link>
          </div>
        </section>

        {/* Section 2: Social Proof & Impact */}
        <section className="min-h-screen flex flex-col justify-center px-4 bg-[#349934] bg-opacity-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Trusted by Thousands
          </h2>
          <div className="text-center mb-8">
            <span className="text-5xl font-bold text-[#349934]">3,300+</span>
            <p className="text-xl">Users Helped</p>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <p className="italic">
                  "I used to spend hours disinfecting everything in sight. Now
                  I'm spending that time doing things I actually enjoy."
                </p>
                <p className="mt-2">
                  <span className="font-semibold">- Emily B</span> (October
                  2024)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic">
                  "I was coming from a pretty rough spot; and this app helped me
                  drop 90% of my compulsions. It basically gave me my life
                  back."
                </p>
                <p className="mt-2">
                  <span className="font-semibold">- Michael C</span> (April
                  2025)
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: Meet the Team */}
        <section className="min-h-screen flex flex-col justify-center px-4 py-16">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-[#349934] shadow-lg">
                <Image
                  src="/homepage/jamie.jpg"
                  alt="Jamison"
                  width={192}
                  height={192}
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Jamison</h3>
              <p className="text-lg text-[#349934] mb-4">Co-founder & CEO</p>
              <p className="text-center">
                Former Facebook software engineer and Princeton graduate. Proud
                therapy advocator.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-[#349934] shadow-lg">
                <Image
                  src="/homepage/zach.jpg"
                  alt="Zach"
                  width={192}
                  height={192}
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Zach</h3>
              <p className="text-lg text-[#349934] mb-4">Co-founder & CTO</p>
              <p className="text-center">
                Cornell alum with personal experience in OCD and ERP treatment.
                Designed & built products at multiple healthcare start-ups.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: How It Works */}
        <section className="min-h-screen flex flex-col justify-center px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <span className="bg-[#349934] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    1
                  </span>
                  Immediate Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                Get real-time, therapy-based guidance for those "How do I stop
                checking?" moments.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <span className="bg-[#349934] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    2
                  </span>
                  ERP-Style Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                Experience the gold-standard therapy principles used by OCD
                specialists, guided step-by-step.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <span className="bg-[#349934] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    3
                  </span>
                  Exposure Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                Work with our AI to plan out exercises, measure your OCD score,
                and track your progress.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 5: Personalized Experience */}
        <section className="min-h-screen flex flex-col justify-center px-4 bg-[#349934] bg-opacity-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Personalized to You
          </h2>
          <div className="flex items-center justify-center mb-6">
            <UserIcon className="w-16 h-16 text-[#349934]" />
          </div>
          <p className="text-center text-lg mb-6">
            Mango adapts to your unique OCD profile, providing customized
            treatment plans
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <div className="flex justify-start">
              <div className="bg-white/90 text-[#1e543b] rounded-2xl px-4 py-2 max-w-[85%]">
                <p className="text-sm leading-relaxed">
                  Today, let's work on reducing the power of intrusive thoughts
                  around your fear of psychosis.
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-white/90 text-[#1e543b] rounded-2xl px-4 py-2 max-w-[85%]">
                <p className="text-sm leading-relaxed">
                  How are you feeling as we get started?
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-[#349934] text-white rounded-2xl px-4 py-2 max-w-[85%]">
                <p className="text-sm">
                  I'm nervous but ready to try. These thoughts have been really
                  loud today.
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-white/90 text-[#1e543b] rounded-2xl px-4 py-2 max-w-[85%]">
                <p className="text-sm leading-relaxed">
                  That's completely understandable. Let's start with a gentle
                  exposure exercise that you can handle.
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-white/90 text-[#1e543b] rounded-2xl px-4 py-2 max-w-[85%]">
                <p className="text-sm leading-relaxed">
                  Remember, we're building your strength step by step.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Anonymity & Privacy */}
        <section className="min-h-screen flex flex-col justify-center px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Your Privacy Matters
          </h2>
          <div className="flex items-center justify-center mb-12">
            <LockIcon className="w-20 h-20 text-[#349934]" />
          </div>
          <ul className="space-y-8">
            <li className="flex items-center">
              <ShieldIcon className="w-10 h-10 text-[#349934] mr-4 flex-shrink-0" />
              <span className="text-xl">
                <strong>Anonymous by design</strong> – No name required; you
                control what you share
              </span>
            </li>
            <li className="flex items-center">
              <ShieldIcon className="w-10 h-10 text-[#349934] mr-4 flex-shrink-0" />
              <span className="text-xl">
                <strong>Encrypted in transit</strong> – Industry-standard
                encryption keeps your data safe
              </span>
            </li>
            <li className="flex items-center">
              <ShieldIcon className="w-10 h-10 text-[#349934] mr-4 flex-shrink-0" />
              <span className="text-xl">
                <strong>We don't sell your data</strong> – Your information
                stays with us, always
              </span>
            </li>
          </ul>
        </section>

        {/* Section 7: Our Approach */}
        <section className="min-h-screen flex flex-col justify-center px-4 bg-[#349934] bg-opacity-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Approach</h2>
          <div className="flex items-center justify-center mb-12">
            <BrainCircuitIcon className="w-24 h-24 text-[#349934]" />
          </div>
          <ul className="space-y-8 max-w-2xl mx-auto">
            <li className="flex items-center text-xl">
              <Users className="w-12 h-12 text-[#349934] mr-4 flex-shrink-0" />
              <span>
                <strong>Powered by 20+ Experts</strong> – Developed in
                consultation with 20+ OCD specialists and psychologists
              </span>
            </li>
            <li className="flex items-center text-xl">
              <Award className="w-12 h-12 text-[#349934] mr-4 flex-shrink-0" />
              <span>
                <strong>Gold Standard ERP Treatment</strong> – Built on Exposure
                and Response Prevention (ERP), the gold standard in OCD
                treatment
              </span>
            </li>
            <li className="flex items-center text-xl">
              <HeartHandshake className="w-12 h-12 text-[#349934] mr-4 flex-shrink-0" />
              <span>
                <strong>Accessible Care</strong> – Making OCD treatment more
                accessible to those who can't access or afford OCD-specific
                therapy
              </span>
            </li>
          </ul>
        </section>

        {/* Section 8: Pricing & Cost Transparency */}
        <section className="min-h-screen flex flex-col justify-center px-4 bg-[#349934] bg-opacity-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Simple, Transparent Pricing
          </h2>

          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">
              Start with a 7-day Free Trial
            </h3>
            <p className="text-lg">
              Experience the full benefits of our AI-powered OCD guide,
              risk-free.
            </p>
          </div>

          <p className="text-center text-lg mb-6">Then choose your plan:</p>

          {/* Pricing Cards */}
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Card className="w-full md:w-64">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Monthly</CardTitle>
                <CardDescription className="text-center text-2xl font-bold">
                  $24.99/month
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="w-full md:w-64">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Yearly</CardTitle>
                <CardDescription className="text-center text-2xl font-bold">
                  $74.99/year
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mt-6">
            <Button
              onClick={() => router.push("/pages/onboarding")}
              className="bg-[#349934] hover:bg-[#1e543b] text-white text-lg py-7 px-8"
            >
              Try for free
            </Button>
          </div>
        </section>

        {/* Section 9: Support & Contact */}
        <section className="min-h-screen flex flex-col justify-center px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Get Support</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <PhoneIcon className="w-6 h-6 mr-2" />
                  Text or Call Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="tel:+17164252242"
                  className="text-[#349934] hover:text-[#1e543b] text-lg"
                >
                  1-716-425-2242
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MailIcon className="w-6 h-6 mr-2" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="mailto:support@TheMangoHealth.com"
                  className="text-[#349934] hover:text-[#1e543b] text-lg"
                >
                  Support@TheMangoHealth.com
                </Link>
              </CardContent>
            </Card>
          </div>
          <p className="text-center mt-6">
            Our support team is <strong>available 24/7</strong> to assist you
            with any questions or concerns.
          </p>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy-policy"
              className="text-[#349934] hover:text-[#1e543b]"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/terms-of-service"
              className="text-[#349934] hover:text-[#1e543b]"
            >
              Terms of Service
            </Link>
          </div>

          <div className="text-gray-600">© Mango Health 2025</div>

          <div className="flex items-center">
            <Link
              href="https://www.linkedin.com/company/97872692/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#349934] hover:text-[#1e543b]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 27 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.73298 2.74223C5.73298 4.23721 4.59469 5.44704 2.8146 5.44704C1.10386 5.44704 -0.0344324 4.23721 0.000795161 2.74223C-0.0344324 1.17461 1.10383 0 2.84871 0C4.59467 0 5.69885 1.17461 5.73298 2.74223ZM0.143913 24.9971V7.58382H5.55574V24.9961H0.143913V24.9971Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.89263 13.1411C9.89263 10.9691 9.82106 9.11741 9.74951 7.58611H14.4502L14.7001 9.97169H14.8069C15.5191 8.86753 17.2992 7.19531 20.1835 7.19531C23.7437 7.19531 26.4144 9.54564 26.4144 14.6713V24.9995H21.0025V15.3494C21.0025 13.1047 20.2198 11.5745 18.2614 11.5745C16.7653 11.5745 15.8758 12.6071 15.5202 13.6034C15.3771 13.9601 15.3067 14.4577 15.3067 14.9575V24.9995H9.89481V13.1411H9.89263Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
