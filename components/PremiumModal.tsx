import React, { useState } from 'react';

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBuy = () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            onUpgrade();
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark-green/90 backdrop-blur-sm p-4">
            <div className="bg-brand-forest w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-brand-moss relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-brand-stone hover:text-brand-light-green transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid md:grid-cols-2">
                    {/* Left Side: Value Prop */}
                    <div className="p-8 flex flex-col justify-center">
                        <div className="inline-block bg-brand-accent/20 text-brand-accent text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                            LIFETIME ACCESS
                        </div>
                        <h2 className="text-3xl font-bold text-brand-light-green mb-4">Unlock the Full Experience</h2>
                        <p className="text-brand-stone mb-6">Get deep insights into your place in the universe and your impact on Earth.</p>

                        <ul className="space-y-3 mb-8">
                            {[
                                'Remove all ads',
                                'Unlock Galactic Distance',
                                'Unlock Environmental Impact',
                                'Unlock Life Distribution Charts',
                                'Export PDF Reports',
                                'Priority AI Responses'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center text-sm text-brand-light-green/90">
                                    <svg className="w-5 h-5 text-brand-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Side: Checkout Action */}
                    <div className="bg-brand-dark-green/30 p-8 flex flex-col justify-center border-l border-brand-moss/30">
                        <div className="text-center mb-6">
                            <span className="text-4xl font-bold text-brand-light-green">$4.99</span>
                            <span className="text-brand-stone block text-sm mt-1">One-time payment</span>
                        </div>

                        <button
                            onClick={handleBuy}
                            disabled={isProcessing}
                            className="w-full bg-brand-accent hover:bg-brand-light-green text-brand-dark-green font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-brand-accent/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-brand-dark-green border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                'Upgrade Now'
                            )}
                        </button>

                        <p className="text-xs text-brand-stone text-center mt-4">
                            Secure payment processing. 100% Money-back guarantee.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
