import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Star, 
  CheckCircle, 
  Clock,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Quest, api, User, Badge as BadgeType, QuestProgress } from '../lib/database';
import Navigation from '../components/Navigation';
import BadgeModal from '../components/BadgeModal';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userProgress, setUserProgress] = useState<QuestProgress[]>([]);
  const [userBadges, setUserBadges] = useState<BadgeType[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState<BadgeType | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [questsData, progressData, badgesData, leaderboardData] = await Promise.all([
        api.getQuests(),
        api.getUserProgress(user.id),
        api.getUserBadges(user.id),
        api.getLeaderboard()
      ]);

      setQuests(questsData);
      setUserProgress(progressData);
      setUserBadges(badgesData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuestStatus = (questId: string) => {
    const progress = userProgress.find(p => p.quest_id === questId);
    return progress?.is_completed ? 'completed' : 'available';
  };

  const getQuestScore = (questId: string) => {
    const progress = userProgress.find(p => p.quest_id === questId);
    return progress?.score || 0;
  };

  const completedQuests = userProgress.filter(p => p.is_completed).length;
  const totalXP = user?.xp || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0388fc] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name}! 👋
          </h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total XP</p>
                  <p className="text-3xl font-bold">{totalXP}</p>
                </div>
                <Zap className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Completed Quests</p>
                  <p className="text-3xl font-bold">{completedQuests}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Badges Earned</p>
                  <p className="text-3xl font-bold">{userBadges.length}</p>
                </div>
                <Award className="w-12 h-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="quests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
              <TabsTrigger value="quests" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Quests
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            {/* Quests Tab */}
            <TabsContent value="quests" className="space-y-6">
              <div className="grid gap-6">
                {quests.map((quest) => {
                  const status = getQuestStatus(quest.id);
                  const score = getQuestScore(quest.id);
                  
                  return (
                    <Card key={quest.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {quest.title}
                              </h3>
                              {status === 'completed' && (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                              {quest.type === 'quiz' && (
                                <Badge variant="outline" className="text-[#0388fc] border-[#0388fc]">
                                  Quiz
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-4">{quest.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                <span>{quest.xp} XP</span>
                              </div>
                              {status === 'completed' && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span>{score}% Score</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-6">
                            <Button
                              onClick={() => navigate(`/quest/${quest.id}`)}
                              className={
                                status === 'completed'
                                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  : "bg-[#0388fc] hover:bg-blue-600 text-white"
                              }
                            >
                              {status === 'completed' ? 'View Results' : 'Start Quest'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* User Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#0388fc]" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-lg font-semibold">{user?.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Faculty</label>
                      <p className="text-lg">{user?.faculty}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total XP</label>
                      <p className="text-2xl font-bold text-[#0388fc]">{totalXP}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Your Badges ({userBadges.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userBadges.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {userBadges.map((badge) => (
                          <div
                            key={badge.id}
                            className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200"
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Trophy className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
                              <p className="text-xs text-gray-600">{badge.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No badges earned yet.</p>
                        <p className="text-sm">Complete quests to earn your first badge!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0388fc]" />
                    Student Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((student, index) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          student.id === user?.id
                            ? 'bg-blue-50 border-2 border-[#0388fc]'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-500 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{student.full_name}</p>
                            <p className="text-sm text-gray-500">{student.faculty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#0388fc]">{student.xp} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Badge Modal */}
      <BadgeModal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        badge={newBadge}
      />
    </div>
  );
};

export default StudentDashboard;