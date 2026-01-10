'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { getCalApi } from '@calcom/embed-react';
import Hero from '@/components/ui/neural-network-hero';
import {
  AlertTriangle,
  Smartphone,
  BarChart,
  Code,
  ShieldCheck,
  ArrowRight,
  Globe,
  Zap,
  Target,
  TrendingUp,
  Search,
  Rocket,
  Settings,
  Bot,
  Cpu,
  Network,
  Workflow,
} from 'lucide-react';

// ===================== ANIMATION VARIANTS =====================
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ===================== SECTION WRAPPER =====================
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

function AnimatedSection({ children, className = '', id }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ===================== REALITY CHECK (PROBLEM) DATA =====================
const realityChecks = [
  {
    icon: Globe,
    title: 'The Conversion Gap',
    stat: '40-60%',
    description: 'Traffic comes, but leads don\'t. Weak websites lose up to 60% of potential conversions.',
  },
  {
    icon: Smartphone,
    title: 'The App Trap',
    stat: '80%',
    description: '80% of apps fail because they are just code, not products. Features without strategy.',
  },
  {
    icon: BarChart,
    title: 'The ROI Collapse',
    stat: '0x',
    description: 'Marketing without tracking is just burning money. No data means no optimization.',
  },
  {
    icon: AlertTriangle,
    title: 'One-Man Chaos',
    stat: '?',
    description: 'You can\'t rely on freelancers who disappear. You need a system, not a person.',
  },
  {
    icon: Cpu,
    title: 'Manual Chaos',
    stat: '10+hrs',
    description: 'Your team wastes hours on repetitive tasks (Invoicing, Follow-ups) that AI Agents could handle instantly.',
  },
];

// ===================== SERVICES ECOSYSTEM DATA =====================
const servicesEcosystem = [
  {
    icon: Code,
    category: 'Website Development',
    headline: 'Websites Built for Conversion',
    subtext: 'Speed + Security = Revenue.',
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/40',
    iconBg: 'bg-cyan-500/10',
    features: [
      { name: 'Landing Pages', detail: 'Ads & Lead Gen Focus' },
      { name: 'Corporate Growth Sites', detail: 'Scalable Architecture' },
      { name: 'Tech Stack', detail: 'React, Node.js, Next.js, Spring Boot' },
    ],
  },
  {
    icon: Smartphone,
    category: 'Mobile App Development',
    headline: 'Scalable iOS & Android Apps',
    subtext: 'An app is a product, not just code.',
    gradient: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500/20',
    hoverBorder: 'hover:border-violet-500/40',
    iconBg: 'bg-violet-500/10',
    features: [
      { name: 'MVP Development', detail: 'Launch in 6-8 weeks' },
      { name: 'Full Business Apps', detail: 'Admin panels, Role-based access' },
      { name: 'Tech Stack', detail: 'React Native, Spring Boot, Firebase' },
    ],
  },
  {
    icon: TrendingUp,
    category: 'Performance Marketing',
    headline: 'System-Driven Growth',
    subtext: 'If one step breaks, ROI collapses.',
    gradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/10',
    features: [
      { name: 'Foundation Setup', detail: 'GA4, Pixel, Funnel Mapping' },
      { name: 'Acquisition', detail: 'Google/Meta Ads' },
      { name: 'Optimization', detail: 'Converting traffic into revenue' },
    ],
  },
  {
    icon: Bot,
    category: 'AI Automation & Agents',
    headline: 'Agentic AI & Workflows',
    subtext: 'Automate Smarter. Scale Faster.',
    gradient: 'from-orange-500 to-rose-600',
    borderColor: 'border-orange-500/20',
    hoverBorder: 'hover:border-orange-500/40',
    iconBg: 'bg-orange-500/10',
    pricingHint: 'Starter from ₹25,000',
    features: [
      { name: '24/7 AI Chatbots', detail: 'Qualify & Book Leads Automatically' },
      { name: 'Workflow Automation', detail: 'HR, Invoicing, Data Entry' },
      { name: 'Tech Stack', detail: 'n8n, Make.com, OpenAI, Python' },
    ],
  },
];

// ===================== PROCESS ROADMAP DATA =====================
const processRoadmap = [
  {
    step: '01',
    icon: Search,
    title: 'Foundation & Audit',
    description: 'We never run ads or write code without a plan. Deep dive into your business, goals, and current systems.',
  },
  {
    step: '02',
    icon: Settings,
    title: 'Build & Setup',
    description: 'Developing the asset or funnel. Every line of code, every pixel, every integration—engineered for growth.',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Launch & Traffic',
    description: 'Go live with comprehensive data tracking. Launch campaigns with full visibility into performance.',
  },
  {
    step: '04',
    icon: Target,
    title: 'Scale & Optimize',
    description: 'Continuous improvement based on KPIs, not vanity metrics. Data-driven decisions for maximum ROI.',
  },
];

// ===================== MAIN PAGE COMPONENT =====================
export default function HomePage() {
  // Initialize Cal.com embed
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: '30min' });
      cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: {
          dark: { 'cal-brand': '#06b6d4' },
          light: { 'cal-brand': '#06b6d4' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <main className="bg-slate-950 text-white antialiased">
      {/* ───────────── HERO ───────────── */}
      <Hero
        badgeLabel="Strategy • Development • Growth"
        badgeText="DIGROSYS"
        title="Digital Systems That Scale Businesses."
        description="We build the digital nervous system for your business. From high-scale Web & Mobile apps to AI Agents that work 24/7—we engineer growth."
        ctaButtons={[
          { text: 'Book Your Growth Consultation', href: '#contact', primary: true },
          { text: 'See Our Services', href: '#services' },
        ]}
        microDetails={[
          'Founders & Startups',
          'Scaling Businesses',
          'System-First Approach',
        ]}
      />

      {/* ───────────── PHILOSOPHY BANNER ───────────── */}
      <AnimatedSection className="relative border-y border-slate-800/50 bg-gradient-to-r from-slate-900/50 via-slate-950 to-slate-900/50 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center gap-4 text-center">
            <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-cyan-400">
              Our Core Philosophy
            </span>
            <h2 className="max-w-3xl font-bold tracking-tight text-white" style={{ fontSize: 'clamp(1.25rem, 4vw, 2.25rem)' }}>
              &ldquo;Services are <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">NOT</span> the goal;{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Growth</span> is the goal.&rdquo;
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-slate-400">
              We don&apos;t just write code—we build business systems that compound.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ───────────── REALITY CHECK SECTION ───────────── */}
      <AnimatedSection className="relative py-16 sm:py-24 lg:py-32">
        {/* Subtle Grid Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <motion.div variants={fadeInUp} className="mb-10 sm:mb-16 max-w-2xl">
            <span className="mb-3 sm:mb-4 inline-block rounded-full bg-red-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-red-400">
              Reality Check
            </span>
            <h2 className="font-bold tracking-tight" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
              Why Most Digital Efforts <span className="text-red-400">Fail</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-400">
              These are the silent killers of ROI. Sound familiar?
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          >
            {realityChecks.map((item) => (
              <motion.div
                key={item.title}
                variants={scaleIn}
                className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-slate-900/30 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-red-500/40 hover:bg-slate-900/50"
              >
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-3 sm:mb-4 inline-flex rounded-xl bg-red-500/10 p-2.5 sm:p-3">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                </div>

                <div className="mb-2 text-2xl sm:text-3xl font-black text-red-400/80">{item.stat}</div>

                <h3 className="mb-2 text-base sm:text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ───────────── SERVICES ECOSYSTEM SECTION ───────────── */}
      <AnimatedSection id="services" className="relative py-16 sm:py-24 lg:py-32">
        {/* Gradient Accent */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-full max-w-5xl -translate-x-1/2">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent blur-3xl" />
        </div>

        {/* Subtle Grid Background */}
        <div className="pointer-events-none absolute inset-0 -z-20">
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <motion.div variants={fadeInUp} className="mb-10 sm:mb-16 text-center">
            <span className="mb-3 sm:mb-4 inline-block rounded-full bg-cyan-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-cyan-400">
              The Services Ecosystem
            </span>
            <h2 className="font-bold tracking-tight" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
              Your Complete <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Growth Stack</span>
            </h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-slate-400">
              Four pillars. One integrated system. Every component engineered to drive measurable business growth.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2"
          >
            {servicesEcosystem.map((service) => (
              <motion.div
                key={service.category}
                variants={scaleIn}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border ${service.borderColor} bg-slate-900/40 backdrop-blur-md transition-all duration-500 ${service.hoverBorder} hover:bg-slate-900/60`}
              >
                {/* Card Header */}
                <div className="border-b border-slate-800/50 p-5 sm:p-6 lg:p-8">
                  <div className={`mb-4 sm:mb-6 inline-flex rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.gradient} p-3 sm:p-4 shadow-lg`}>
                    <service.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                  </div>

                  <p className="mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {service.category}
                  </p>
                  <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-bold text-white">{service.headline}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">{service.subtext}</p>
                </div>

                {/* Card Features */}
                <div className="p-5 pt-4 sm:p-6 sm:pt-5 lg:p-8 lg:pt-6">
                  <ul className="space-y-3 sm:space-y-4">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5 sm:gap-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-cyan-400/70" />
                        <div>
                          <span className="text-sm sm:text-base font-medium text-white">{feature.name}</span>
                          <p className="text-xs sm:text-sm text-slate-500">{feature.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Glow */}
                <div className={`absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-br ${service.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-15`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ───────────── HOW WE WORK ROADMAP ───────────── */}
      <AnimatedSection className="relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <motion.div variants={fadeInUp} className="mb-10 sm:mb-16 max-w-2xl">
            <span className="mb-3 sm:mb-4 inline-block rounded-full bg-cyan-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-cyan-400">
              How We Work
            </span>
            <h2 className="font-bold tracking-tight" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
              The Growth <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Roadmap</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-400">
              A battle-tested process designed to eliminate waste and maximize results. Every step is intentional.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {processRoadmap.map((item, index) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="group relative"
              >
                {/* Connector Line */}
                {index < processRoadmap.length - 1 && (
                  <div className="absolute right-0 top-16 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-cyan-500/30 via-slate-700 to-transparent lg:block" />
                )}

                <div className="relative h-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-slate-900/50">
                  {/* Step Number */}
                  <span className="mb-3 sm:mb-4 block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl sm:text-5xl font-black text-transparent">
                    {item.step}
                  </span>

                  {/* Icon */}
                  <div className="mb-3 sm:mb-4 inline-flex rounded-xl bg-cyan-500/10 p-2.5 sm:p-3">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                  </div>

                  <h3 className="mb-2 text-base sm:text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">{item.description}</p>

                  {/* Hover Glow */}
                  <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-cyan-500/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ───────────── FINAL CTA SECTION ───────────── */}
      <AnimatedSection id="contact" className="relative py-16 sm:py-24 lg:py-32">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[400px] sm:h-[500px] sm:w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
          <motion.div
            variants={fadeInUp}
            className="overflow-hidden rounded-2xl sm:rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-cyan-950/30 p-6 sm:p-10 lg:p-16 text-center backdrop-blur-xl"
          >
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 sm:px-4 py-1 sm:py-1.5">
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Ready to Scale?
              </span>
            </div>

            <h2 className="mb-3 sm:mb-4 font-bold tracking-tight text-white" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>
              Stop guessing.<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Start building your system.
              </span>
            </h2>

            <p className="mx-auto mb-6 sm:mb-8 max-w-xl text-sm sm:text-base lg:text-lg text-slate-400">
              Let&apos;s map out the digital infrastructure your business needs to scale predictably and profitably.
            </p>

            <button
              data-cal-link="souvik-kundu-y0tdcc/30min"
              data-cal-config='{"layout":"month_view"}'
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl bg-cyan-500 min-h-[48px] w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-black transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              Book Your Growth Consultation
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-500">
              Free 30-minute strategy session. No strings attached.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="border-t border-slate-800 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 sm:flex-row">
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 sm:flex-row sm:items-center">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                DIGROSYS
              </span>
              <span className="hidden h-4 w-px bg-slate-700 sm:block" />
              <span className="text-xs sm:text-sm text-slate-500">Digital Growth Systems</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              © {new Date().getFullYear()} DIGROSYS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
