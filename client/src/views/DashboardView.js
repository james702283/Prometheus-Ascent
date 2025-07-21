import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Progress from '../components/ui/Progress';
import WandIcon from '../components/icons/WandIcon';
import ReactMarkdown from 'react-markdown';

const DashboardView = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState({});
    const [loadingAnalysis, setLoadingAnalysis] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/profiles')
            .then(data => setProfile(data))
            .catch(err => console.error("Failed to fetch profile", err))
            .finally(() => setLoading(false));
    }, []);

    const handleStartQuiz = (verticalId, skill) => {
        navigate('/quiz', { state: { verticalId, skill } });
    };

    const handleGetAnalysis = async (verticalId) => {
        setLoadingAnalysis(verticalId);
        try {
            // ** THE FIX IS HERE: **
            // Calling the correct, new endpoint and passing the verticalId in the body.
            const result = await api.post('/ai/analyze', { verticalId });
            setAnalysis(prev => ({ ...prev, [verticalId]: result.analysis }));
        } catch (err) {
            console.error("Failed to get AI analysis", err);
            setAnalysis(prev => ({ ...prev, [verticalId]: "An error occurred while fetching your analysis. Please try again." }));
        } finally {
            setLoadingAnalysis(null);
        }
    };

    if (loading) return <div className="text-center text-slate-300">Loading Dashboard...</div>;
    
    if (!profile || !profile.assessments || Object.keys(profile.assessments).length === 0) {
        return (
            <Card className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border-slate-700 text-slate-50 text-center">
                <CardHeader><CardTitle>Welcome to Prometheus Ascent</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-slate-400">You haven't completed any skill assessments yet.</p>
                    <Button onClick={() => navigate('/select-vertical')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">Take Your First Assessment</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-50 mb-2">Your Dashboard</h2>
                <p className="text-slate-400">Review your completed assessments and take on challenges to level up.</p>
            </div>

            {Object.entries(profile.assessments).map(([verticalId, assessment]) => {
                if (!assessment.skills) return null;
                const skillAverages = Object.entries(assessment.skills).map(([category, skills]) => {
                    const ratings = Object.values(skills);
                    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                    return { category, average };
                });

                return (
                    <Card key={verticalId} className="bg-white/5 backdrop-blur-sm border-slate-700 text-slate-50">
                        <CardHeader>
                            <CardTitle>{assessment.vertical?.name || 'Assessment'}</CardTitle>
                            <CardDescription>Completed on: {new Date(assessment.lastUpdated).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {skillAverages.map(({ category, average }) => (
                                    <div key={category}>
                                        <div className="flex justify-between mb-1"><span className="font-medium text-slate-300">{category}</span><span className="text-sm text-blue-400">{average.toFixed(1)}/5.0</span></div>
                                        <Progress value={(average / 5) * 100} />
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 mt-6 border-t border-slate-700/50">
                                <h4 className="font-semibold text-slate-200 mb-4">Challenge Zone</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {Object.values(assessment.skills).flatMap(Object.keys).map(skill => (
                                        <Button key={skill} onClick={() => handleStartQuiz(verticalId, skill)} className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300">
                                            Quiz: {skill}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6 mt-6 border-t border-slate-700/50">
                                <Button onClick={() => handleGetAnalysis(verticalId)} disabled={loadingAnalysis === verticalId} className="bg-purple-600 hover:bg-purple-700 text-white flex items-center disabled:bg-purple-400/50">
                                    <WandIcon /> {loadingAnalysis === verticalId ? 'Analyzing...' : 'Get AI Analysis'}
                                </Button>
                            </div>
                            {analysis[verticalId] && (
                                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                     <div className="prose prose-invert prose-p:text-slate-300 prose-h3:text-slate-100 prose-strong:text-slate-50">
                                        <ReactMarkdown>{analysis[verticalId]}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
             <div className="text-center mt-8">
                <Button onClick={() => navigate('/select-vertical')} className="bg-gray-600 hover:bg-gray-700 text-white">Take a New Assessment</Button>
            </div>
        </div>
    );
};

export default DashboardView;