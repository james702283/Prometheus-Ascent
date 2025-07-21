import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const VerticalSelectionView = () => {
    const [verticals, setVerticals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/verticals')
            .then(data => setVerticals(data))
            .catch(err => console.error("Failed to fetch verticals", err))
            .finally(() => setLoading(false));
    }, []);

    const handleSelect = (vertical) => {
        navigate(`/assessment/${vertical._id}`);
    };

    if (loading) return <div className="text-center text-slate-300">Loading available assessments...</div>;

    return (
        <Card className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border-slate-700 text-slate-50">
            <CardHeader>
                <CardTitle>Choose Your Assessment</CardTitle>
                <CardDescription className="pt-2">Select an industry vertical to begin your skill assessment.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verticals.map(vertical => (
                    <div 
                        key={vertical._id} 
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition cursor-pointer" 
                        onClick={() => handleSelect(vertical)}
                    >
                        <h4 className="font-bold text-lg text-slate-100">{vertical.name}</h4>
                        <p className="text-sm text-slate-400">{vertical.description}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default VerticalSelectionView;