'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Mail, Phone, Copy, Check, Calendar, ArrowRight, LucideIcon } from 'lucide-react';

// Animation variants
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

// Contact data
const contactData = {
    email: 'hello@digrosys.com',
    phones: [
        { label: 'Primary', number: '+91 91630 34822', tel: '+919163034822' },
        { label: 'Secondary', number: '+91 74391 75887', tel: '+917439175887' },
    ],
};

// Copy button component with tooltip
function CopyButton({ textToCopy }: { textToCopy: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group/copy"
            aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
        >
            {copied ? (
                <Check className="h-4 w-4 text-green-400" />
            ) : (
                <Copy className="h-4 w-4 text-slate-400 group-hover/copy:text-cyan-400 transition-colors" />
            )}

            {/* Tooltip */}
            <span className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 ${copied
                ? 'bg-green-500/20 text-green-400 opacity-100'
                : 'bg-slate-800 text-slate-300 opacity-0 group-hover/copy:opacity-100'
                }`}>
                {copied ? 'Copied!' : 'Copy'}
            </span>
        </button>
    );
}

// Contact card component
interface ContactCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    displayValue?: string;
    href: string;
    gradient: string;
}

function ContactCard({ icon: Icon, label, value, displayValue, href, gradient }: ContactCardProps) {
    return (
        <motion.div
            variants={scaleIn}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 hover:bg-slate-900/60"
        >
            <div className="p-5 sm:p-6">
                <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${gradient} p-3 shadow-lg`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                            {label}
                        </p>
                        <a
                            href={href}
                            className="flex items-center text-base sm:text-lg md:text-xl font-semibold text-white hover:text-cyan-400 transition-colors truncate min-h-[44px]"
                        >
                            {displayValue || value}
                        </a>
                    </div>

                    {/* Copy Button */}
                    <CopyButton textToCopy={value} />
                </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-cyan-500/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
        </motion.div>
    );
}

export default function ContactSection() {
    return (
        <section className="relative py-16 sm:py-24 lg:py-32">
            {/* Background Elements */}
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
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={staggerContainer}
                    className="mb-10 sm:mb-16 text-center"
                >
                    <motion.span
                        variants={fadeInUp}
                        className="mb-3 sm:mb-4 inline-block rounded-full bg-cyan-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-cyan-400"
                    >
                        Get in Touch
                    </motion.span>
                    <motion.h2
                        variants={fadeInUp}
                        className="font-bold tracking-tight"
                        style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
                    >
                        Let&apos;s Build Your{' '}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Growth System
                        </span>
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-slate-400"
                    >
                        Ready to transform your digital presence? Reach out via email, phone, or book a free consultation.
                    </motion.p>
                </motion.div>

                {/* Contact Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={staggerContainer}
                    className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2"
                >
                    {/* Email Card */}
                    <ContactCard
                        icon={Mail}
                        label="Email Us"
                        value={contactData.email}
                        href={`mailto:${contactData.email}`}
                        gradient="from-cyan-500 to-blue-600"
                    />

                    {/* Primary Phone Card */}
                    <ContactCard
                        icon={Phone}
                        label={contactData.phones[0].label}
                        value={contactData.phones[0].number}
                        href={`tel:${contactData.phones[0].tel}`}
                        gradient="from-violet-500 to-purple-600"
                    />

                    {/* Secondary Phone Card */}
                    <ContactCard
                        icon={Phone}
                        label={contactData.phones[1].label}
                        value={contactData.phones[1].number}
                        href={`tel:${contactData.phones[1].tel}`}
                        gradient="from-emerald-500 to-teal-600"
                    />

                    {/* Book Call Card */}
                    <motion.div
                        variants={scaleIn}
                        className="group relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/50 via-slate-900/60 to-slate-900/40 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50"
                    >
                        <div className="p-5 sm:p-6">
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 p-3 shadow-lg">
                                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                        Prefer a Call?
                                    </p>
                                    <p className="text-base sm:text-lg md:text-xl font-semibold text-white">
                                        Book a Free Consultation
                                    </p>
                                </div>

                                {/* Book Button */}
                                <button
                                    data-cal-link="souvik-kundu-y0tdcc/30min"
                                    data-cal-config='{"layout":"month_view"}'
                                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-5 rounded-xl bg-cyan-500 text-black font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] cursor-pointer"
                                >
                                    <span className="hidden sm:inline">Book</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Hover Glow */}
                        <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-cyan-500/30 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
