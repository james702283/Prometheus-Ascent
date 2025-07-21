import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
    <div 
        className={`p-6 rounded-lg shadow-md ${className}`} 
        {...props}
    >
        {children}
    </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
    <div className={className} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
    <h3 className={`text-2xl font-bold ${className}`} {...props}>
        {children}
    </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
    <p className={`text-sm text-slate-400 ${className}`} {...props}>
        {children}
    </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
    <div className={`mt-4 ${className}`} {...props}>
        {children}
    </div>
);