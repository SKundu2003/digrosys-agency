'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadCaptureModal({ isOpen, onClose, serviceName }: LeadCaptureModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Focus trap and escape key handler
    useEffect(() => {
        if (isOpen) {
            // Focus first input when modal opens
            setTimeout(() => nameInputRef.current?.focus(), 100);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };

            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, onClose]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setName('');
            setPhone('');
            setStatus('idle');
            setErrorMessage('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        const formData = new FormData();
        formData.append('form-name', 'service-lead');
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('service', serviceName);

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
            });

            if (response.ok) {
                setStatus('success');
                // Auto close after success
                setTimeout(() => {
                    onClose();
                }, 2500);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again or call us directly.');
            console.error('Form submission error:', error);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Header */}
                        <div className="border-b border-slate-800 px-6 pb-4 pt-6">
                            <div className="mb-2 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                                {serviceName}
                            </div>
                            <h2 id="modal-title" className="text-xl font-bold text-white sm:text-2xl">
                                Get a Free Consultation
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Share your details and we&apos;ll call you back within 24 hours.
                            </p>
                        </div>

                        {/* Form Body */}
                        <div className="p-6">
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center py-8 text-center"
                                >
                                    <div className="mb-4 rounded-full bg-green-500/10 p-4">
                                        <CheckCircle className="h-10 w-10 text-green-400" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-white">Thank You!</h3>
                                    <p className="text-slate-400">
                                        We&apos;ve received your request. Our team will reach out shortly.
                                    </p>
                                </motion.div>
                            ) : (
                                <form
                                    name="service-lead"
                                    method="POST"
                                    data-netlify="true"
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    {/* Hidden field for Netlify */}
                                    <input type="hidden" name="form-name" value="service-lead" />
                                    <input type="hidden" name="service" value={serviceName} />

                                    {/* Name Input */}
                                    <div>
                                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">
                                            Your Name
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                <User className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <input
                                                ref={nameInputRef}
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                placeholder="Enter your full name"
                                                className="block w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-10 pr-4 text-white placeholder-slate-500 transition-all duration-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                                disabled={status === 'submitting'}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Input */}
                                    <div>
                                        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-300">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                                <Phone className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                                placeholder="+91 98765 43210"
                                                className="block w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-10 pr-4 text-white placeholder-slate-500 transition-all duration-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                                disabled={status === 'submitting'}
                                            />
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400"
                                        >
                                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                            <span>{errorMessage}</span>
                                        </motion.div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting' || !name || !phone}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-base font-semibold text-black transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {status === 'submitting' ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Request Callback'
                                        )}
                                    </button>

                                    {/* Privacy Note */}
                                    <p className="text-center text-xs text-slate-500">
                                        We respect your privacy. Your information will never be shared.
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
