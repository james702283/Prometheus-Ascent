import React from 'react';

const WandIcon = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="mr-2 h-4 w-4" 
        {...props}
    >
        <path d="M12 4V2"/><path d="m14.5 6.5 1.5-1.5"/><path d="M18 12h2"/><path d="m14.5 17.5 1.5 1.5"/><path d="M12 20v2"/><path d="m9.5 17.5-1.5 1.5"/><path d="M6 12H4"/><path d="m9.5 6.5-1.5-1.5"/><path d="m14.5 9.5 4 4"/><path d="M6.5 14.5 4 12l2.5-2.5"/><path d="m17.5 9.5-2.5 2.5"/><path d="M12 12V4h2l-2.5 2.5L12 4Z"/>
    </svg>
);

export default WandIcon;