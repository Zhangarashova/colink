import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Target,
  Clock,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Quest, api, QuizQuestion, Badge as BadgeType } from '../lib/database';
import Navigation from '../components/Navigation';
import BadgeModal from '../components/BadgeModal';

const QuestPage = () => {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<BadgeType | null>(null);

  useEffect(() => {
    loadQuest();
  }, [questId]);

  const loadQuest = async () => {
    if (!questId) return;
    
    try {
      const questData = await api.getQuest(questId);
      setQuest(questData);
    } catch (error) {
      console.error('Error loading quest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (quest?.questions && currentQuestion < quest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = async () => {
    if (!quest?.questions || !user) return;

    // Calculate score
    let correctAnswers = 0;
    quest.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quest.questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
    setShowResults(true);

    try {
      // Save progress
      await api.completeQuest(user.id, quest.id, finalScore);
      
      // Check if badge was earned
      if (finalScore >= 80) {
        const badges = await api.getUserBadges(user.id);
        const latestBadge = badges[badges.length - 1];
        if (latestBadge) {
          setEarnedBadge(latestBadge);
          setTimeout(() => setShowBadgeModal(true), 1000);
        }
      }
    } catch (error) {
      console.error('Error completing quest:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent work! 🌟';
    if (score >= 80) return 'Great job! 🎉';
    if (score >= 70) return 'Good effort! 👍';
    return 'Keep practicing! 💪';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0388fc] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quest...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quest Not Found</h1>
            <Button onClick={() => navigate('/student')} className="bg-[#0388fc] hover:bg-blue-600">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/student')}
            className="mb-4 text-gray-600 hover:text-[#0388fc]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{quest.title}</h1>
                <p className="text-gray-600 mb-4">{quest.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="text-[#0388fc] border-[#0388fc]">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {quest.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Target className="w-4 h-4" />
                    <span>{quest.xp} XP</span>
                  </div>
                  {quest.questions && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{quest.questions.length} Questions</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {quest.questions && !showResults && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentQuestion + 1} of {quest.questions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / quest.questions.length) * 100)}% Complete</span>
                </div>
                <Progress value={((currentQuestion + 1) / quest.questions.length) * 100} className="h-2" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Quiz Content */}
        <AnimatePresence mode="wait">
          {quest.questions && !showResults && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {quest.questions[currentQuestion].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quest.questions[currentQuestion].options.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                        className={`w-full p-4 h-auto text-left justify-start ${
                          selectedAnswers[currentQuestion] === index
                            ? "bg-[#0388fc] hover:bg-blue-600 text-white"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <span className="font-medium mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={nextQuestion}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="bg-[#0388fc] hover:bg-blue-600 text-white"
                >
                  {currentQuestion === quest.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {showResults && quest.questions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                  <p className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
                    {score}%
                  </p>
                  <p className="text-lg text-gray-600 mb-4">{getScoreMessage(score)}</p>
                  <div className="flex justify-center gap-4 text-sm text-gray-600">
                    <span>Correct: {selectedAnswers.filter((answer, index) => answer === quest.questions![index].correct_answer).length}/{quest.questions.length}</span>
                    <span>•</span>
                    <span>XP Earned: {Math.floor((score / 100) * quest.xp)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Question Review */}
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Answers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {quest.questions.map((question, questionIndex) => {
                    const userAnswer = selectedAnswers[questionIndex];
                    const isCorrect = userAnswer === question.correct_answer;
                    
                    return (
                      <div key={questionIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Question {questionIndex + 1}: {question.question}
                            </h4>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    optionIndex === question.correct_answer
                                      ? 'bg-green-50 border-green-200 text-green-800'
                                      : optionIndex === userAnswer && !isCorrect
                                      ? 'bg-red-50 border-red-200 text-red-800'
                                      : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <span className="font-medium mr-2">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  {option}
                                  {optionIndex === question.correct_answer && (
                                    <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                                  )}
                                  {optionIndex === userAnswer && !isCorrect && (
                                    <span className="ml-2 text-red-600 font-medium">✗ Your Answer</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/student')}
                >
                  Back to Dashboard
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-[#0388fc] hover:bg-blue-600 text-white"
                >
                  Retake Quiz
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assignment Type Quest */}
        {quest.type === 'assignment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 text-[#0388fc] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Assignment Quest</h2>
                <p className="text-gray-600 mb-6">
                  This is an assignment-type quest. Please complete the required tasks and submit your work to your professor.
                </p>
                <Button
                  onClick={() => navigate('/student')}
                  className="bg-[#0388fc] hover:bg-blue-600 text-white"
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Badge Modal */}
      <BadgeModal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        badge={earnedBadge}
      />
    </div>
  );
};

export default QuestPage;