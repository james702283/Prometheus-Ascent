import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const QuizView = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // **FIX 1: Change answers state from an object to an array**
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        if (!state || !state.verticalId || !state.skill) {
            setError('Quiz configuration is missing. Please return to the dashboard.');
            setLoading(false);
            return;
        }
        
        api.post('/quizzes/generate', { verticalId: state.verticalId, skill: state.skill })
            .then(data => {
                setQuiz(data);
                // **FIX 2: Initialize the answers array with nulls**
                setAnswers(new Array(data.questions.length).fill(null));
            })
            .catch(err => {
                console.error("Failed to generate quiz", err);
                setError('Failed to generate the quiz. Please try again.');
            })
            .finally(() => setLoading(false));
    }, [state]);

    const handleAnswerSelect = (answer) => {
        // **FIX 3: Update the array at the current index**
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };
    
    const handleSubmit = async () => {
        // **FIX 4: Send the entire answers array in the request body**
        const results = await api.post('/quizzes/submit', { quizId: quiz._id, answers: answers });
        navigate('/quiz-results', { state: { results } });
    };

    if (loading) return <div className="text-center text-slate-300">Generating your quiz...</div>;
    if (error) return <div className="text-center text-red-400">{error}</div>;
    if (!quiz) return <div className="text-center text-red-400">Could not load quiz.</div>;

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <Card className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-slate-700 text-slate-50">
            <CardHeader>
                <CardTitle>Quiz: {quiz.skill_id}</CardTitle>
                <CardDescription>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-semibold mb-4">{currentQuestion.questionText}</p>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <Button 
                            key={index} 
                            onClick={() => handleAnswerSelect(option)} 
                            className={`w-full text-left justify-start border ${answers[currentQuestionIndex] === option ? 'bg-blue-600 border-blue-500' : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700'}`}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
                <div className="mt-6 text-right">
                    <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Submit'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizView;