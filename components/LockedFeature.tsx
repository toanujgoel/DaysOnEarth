import React from 'react';

interface LockedFeatureProps {
    isPremium: boolean;
    isUnlocked: boolean;
    onWatchAd: () => void;
    onUpgrade: () => void;
    children: React.ReactNode;
    title: string;
    description: string;
}

export const LockedFeature: React.FC<LockedFeatureProps> = ({
    isPremium,
    isUnlocked,
    onWatchAd,
    onUpgrade,
    children,
    title,
    description
}) => {
    if (isPremium || isUnlocked) {
        return <>{children}</>;
    }

    return (
        <div className="relative rounded-xl overflow-hidden border border-brand-moss/30 bg-brand-forest/20 min-h-[200px] flex flex-col items-center justify-center p-6 text-center group">
            {/* Blurred Background Content Preview (Optional - just a visual hint) */}
            <div className="absolute inset-0 blur-sm opacity-20 pointer-events-none bg-brand-moss/10" />

            <div className="relative z-10 max-w-md">
                <div className="bg-brand-dark-green/80 backdrop-blur-md p-6 rounded-xl border border-brand-accent/30 shadow-xl">
                    <div className="mb-4 text-brand-accent">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-brand-light-green mb-2">{title}</h3>
                    <p className="text-brand-stone mb-6 text-sm">{description}</p>

                    <div className="space-y-3">
                        <button
                            onClick={onWatchAd}
                            className="w-full bg-brand-accent hover:bg-brand-light-green text-brand-dark-green font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-accent/20"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Watch Ad to Unlock
                        </button>

                        <button
                            onClick={onUpgrade}
                            className="w-full bg-transparent border-2 border-brand-moss hover:border-brand-accent text-brand-stone hover:text-brand-light-green font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                        >
                            Upgrade to Premium (No Ads)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
