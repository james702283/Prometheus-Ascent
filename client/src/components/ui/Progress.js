import React from 'react';

const Progress = ({ value = 0 }) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    return (
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${clampedValue}%` }}
            >
            </div>
        </div>
    );
};

export default Progress;