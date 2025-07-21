import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import CheckIcon from '../components/icons/CheckIcon';
import XIcon from '../components/icons/XIcon';

const QuizResultsView = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state || !state.results) {
        return (
            <div className="text-center text-red-400">
                <p>Could not load quiz results. Please return to the dashboard.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const { score, results, skill } = state.results;

    return (
        <Card className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-slate-700 text-slate-50">
            <CardHeader className="text-center">
                <CardTitle>Quiz Complete: {skill}</CardTitle>
                <CardDescription>Your Score: <span className="text-2xl font-bold text-green-400">{score.toFixed(0)}%</span></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {results.map((result, index) => (
                        <div key={index} className={`p-3 rounded-md border ${result.isCorrect ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'}`}>
                            <p className="font-semibold mb-2">{result.questionText}</p>
                            <p className="flex items-center">{result.isCorrect ? <CheckIcon /> : <XIcon />} <span className="ml-2">Your answer: {result.userAnswer}</span></p>
                            {!result.isCorrect && <p className="text-sm text-slate-400 ml-8">Correct answer: {result.correctAnswer}</p>}
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <Button onClick={() => navigate('/dashboard')} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                        Back to Dashboard
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizResultsView;