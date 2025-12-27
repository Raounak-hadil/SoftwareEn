"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface FancyAlertProps {
    message: string;
    onClose: () => void;
    type?: 'error' | 'success';
}

const FancyAlert: React.FC<FancyAlertProps> = ({ message, onClose, type = 'error' }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        // Auto close after 5 seconds
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
    };

    if (!message) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-[100] transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <div
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${type === 'error'
                        ? 'bg-red-500/90 border-red-400 text-white'
                        : 'bg-green-500/90 border-green-400 text-white'
                    }`}
            >
                <div className="flex-shrink-0">
                    {type === 'error' ? (
                        <AlertCircle className="w-6 h-6 animate-pulse" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-green-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="flex-grow pr-4">
                    <p className="font-bold text-sm tracking-wide uppercase opacity-80 mb-0.5">
                        {type === 'error' ? 'Error' : 'Success'}
                    </p>
                    <p className="text-base font-medium leading-tight">{message}</p>
                </div>

                <button
                    onClick={handleClose}
                    className="flex-shrink-0 hover:rotate-90 transition-transform duration-200 opacity-70 hover:opacity-100"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default FancyAlert;
