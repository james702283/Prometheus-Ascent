import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const SkillAssessmentView = () => {
    const { verticalId } = useParams();
    const navigate = useNavigate();
    const [vertical, setVertical] = useState(null);
    const [skillRatings, setSkillRatings] = useState({});

    useEffect(() => {
        api.get(`/verticals/${verticalId}`)
            .then(data => setVertical(data))
            .catch(err => console.error("Failed to fetch skill taxonomy", err));
    }, [verticalId]);

    const handleRatingChange = (category, skill, value) => {
        setSkillRatings(prev => ({ ...prev, [category]: { ...prev[category], [skill]: value } }));
    };

    const handleSubmit = async () => {
        await api.post('/profiles/assessment', { verticalId: vertical._id, skills: skillRatings });
        navigate('/dashboard');
    };

    if (!vertical) return <div className="text-center text-slate-300">Loading assessment...</div>;

    return (
        <Card className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border-slate-700 text-slate-50">
            <CardHeader>
                <CardTitle>{vertical.name} Skill Assessment</CardTitle>
                <CardDescription className="pt-2">Rate your proficiency from 1 (Familiar) to 5 (Expert).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {Object.entries(vertical.skillTaxonomy).map(([category, skills]) => (
                    <div key={category}>
                        <h3 className="text-xl font-semibold text-slate-200 mb-4 border-b border-slate-700 pb-2">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {skills.map(skill => (
                                <div key={skill}>
                                    <label className="mb-2 block text-slate-300">{skill}</label>
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map(value => (
                                            <Button key={value} onClick={() => handleRatingChange(category, skill, value)} className={`w-10 h-10 rounded-md transition-all transform hover:scale-110 border-slate-600 ${skillRatings[category]?.[skill] === value ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'}`}>{value}</Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="pt-6 text-center">
                    <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 text-lg">View My Dashboard</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SkillAssessmentView;