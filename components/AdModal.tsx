import React, { useEffect, useState } from 'react';

interface AdModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [canSkip, setCanSkip] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeLeft(5);
            setCanSkip(false);
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanSkip(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl relative">
                {/* Mock Video Player Area */}
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                    <div className="text-center">
                        <p className="text-white font-bold text-xl mb-2">ADVERTISEMENT</p>
                        <p className="text-gray-400 text-sm">Simulating video ad playback...</p>
                        <div className="mt-4 w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>

                    {/* Timer / Skip Button */}
                    <div className="absolute top-4 right-4">
                        {canSkip ? (
                            <button
                                onClick={() => {
                                    onComplete();
                                    onClose();
                                }}
                                className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold border border-white/20 transition-colors flex items-center gap-2"
                            >
                                Skip Reward <span className="text-xs opacity-70">x</span>
                            </button>
                        ) : (
                            <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-bold border border-white/20">
                                Reward in {timeLeft}s
                            </div>
                        )}
                    </div>
                </div>

                {/* Ad Footer Info */}
                <div className="p-4 bg-gray-100 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-gray-800">Support Days on Earth</h4>
                        <p className="text-xs text-gray-500">Watching this ad helps keep basic stats free.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm font-semibold">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
