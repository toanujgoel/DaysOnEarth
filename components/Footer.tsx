import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-forest/30 mt-8">
            <div className="container mx-auto px-4 md:px-8 py-4 text-center text-brand-stone text-sm">
                <p>&copy; {new Date().getFullYear()} Days on Earth. Discover your journey in ways you never imagined.</p>
            </div>
        </footer>
    );
};