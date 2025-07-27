import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  BarChart3, 
  User, 
  BookOpen, 
  Users, 
  Trophy,
  Target,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Quest, api, User as UserType } from '../lib/database';
import Navigation from '../components/Navigation';

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creatingQuest, setCreatingQuest] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    xp: 100,
    type: 'assignment' as 'quiz' | 'assignment' | 'project'
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [questsData, analyticsData] = await Promise.all([
        api.getQuests(),
        api.getAnalytics(user.id)
      ]);

      setQuests(questsData.filter(q => q.created_by === user.id));
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreatingQuest(true);
    try {
      await api.createQuest({
        ...newQuest,
        created_by: user.id,
        is_active: true
      });
      
      setNewQuest({
        title: '',
        description: '',
        xp: 100,
        type: 'assignment'
      });
      
      await loadData();
    } catch (error) {
      console.error('Error creating quest:', error);
    } finally {
      setCreatingQuest(false);
    }
  };

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
            Welcome back, Professor {user?.full_name}! 👨‍🏫
          </h1>
          <p className="text-gray-600">Manage your quests and track student progress</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold">{analytics?.total_students || 0}</p>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Quests</p>
                  <p className="text-3xl font-bold">{analytics?.total_quests || 0}</p>
                </div>
                <BookOpen className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Completions</p>
                  <p className="text-3xl font-bold">{analytics?.total_completions || 0}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Score</p>
                  <p className="text-3xl font-bold">
                    {analytics?.student_stats?.length > 0 
                      ? Math.round(analytics.student_stats.reduce((sum: number, s: any) => sum + s.average_score, 0) / analytics.student_stats.length)
                      : 0}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-orange-200" />
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
                <Plus className="w-4 h-4" />
                Quest Creation
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* Quest Creation Tab */}
            <TabsContent value="quests" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Create New Quest */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-[#0388fc]" />
                      Create New Quest
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateQuest} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Quest Title
                        </label>
                        <Input
                          value={newQuest.title}
                          onChange={(e) => setNewQuest({...newQuest, title: e.target.value})}
                          placeholder="Enter quest title"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Description
                        </label>
                        <Textarea
                          value={newQuest.description}
                          onChange={(e) => setNewQuest({...newQuest, description: e.target.value})}
                          placeholder="Describe the quest objectives"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            XP Reward
                          </label>
                          <Input
                            type="number"
                            value={newQuest.xp}
                            onChange={(e) => setNewQuest({...newQuest, xp: parseInt(e.target.value)})}
                            min="50"
                            max="1000"
                            step="50"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Quest Type
                          </label>
                          <select
                            value={newQuest.type}
                            onChange={(e) => setNewQuest({...newQuest, type: e.target.value as any})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0388fc] focus:border-transparent"
                          >
                            <option value="assignment">Assignment</option>
                            <option value="quiz">Quiz</option>
                            <option value="project">Project</option>
                          </select>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={creatingQuest}
                        className="w-full bg-[#0388fc] hover:bg-blue-600 text-white"
                      >
                        {creatingQuest ? 'Creating...' : 'Create Quest'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Your Quests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#0388fc]" />
                      Your Quests ({quests.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {quests.map((quest) => (
                        <div
                          key={quest.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{quest.title}</h4>
                            <Badge variant="outline" className="text-[#0388fc] border-[#0388fc]">
                              {quest.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Target className="w-3 h-3" />
                            <span>{quest.xp} XP</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>Active</span>
                          </div>
                        </div>
                      ))}
                      {quests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No quests created yet.</p>
                          <p className="text-sm">Create your first quest to get started!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#0388fc]" />
                    Student Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.student_stats?.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-600 font-medium">Total Students</p>
                          <p className="text-2xl font-bold text-blue-800">{analytics.total_students}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">Active Quests</p>
                          <p className="text-2xl font-bold text-green-800">{analytics.total_quests}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-purple-600 font-medium">Total Submissions</p>
                          <p className="text-2xl font-bold text-purple-800">{analytics.total_completions}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-sm text-orange-600 font-medium">Success Rate</p>
                          <p className="text-2xl font-bold text-orange-800">
                            {analytics.total_completions > 0 ? Math.round((analytics.total_completions / (analytics.total_students * analytics.total_quests)) * 100) : 0}%
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">XP</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Completed Quests</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Average Score</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Performance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.student_stats.map((student: any, index: number) => (
                              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="font-medium text-gray-900">{student.student_name}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1">
                                    <Trophy className="w-4 h-4 text-[#0388fc]" />
                                    <span className="font-semibold text-[#0388fc]">{student.xp}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge variant="outline" className="text-green-700 border-green-300">
                                    {student.completed_quests}/{analytics.total_quests}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`font-semibold ${
                                    student.average_score >= 90 ? 'text-green-600' :
                                    student.average_score >= 80 ? 'text-blue-600' :
                                    student.average_score >= 70 ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {student.average_score}%
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full ${
                                          student.average_score >= 90 ? 'bg-green-500' :
                                          student.average_score >= 80 ? 'bg-blue-500' :
                                          student.average_score >= 70 ? 'bg-yellow-500' :
                                          'bg-red-500'
                                        }`}
                                        style={{ width: `${student.average_score}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {student.average_score >= 90 ? 'Excellent' :
                                       student.average_score >= 80 ? 'Good' :
                                       student.average_score >= 70 ? 'Fair' :
                                       'Needs Improvement'}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
                      <p>Create quests and wait for student submissions to see analytics.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#0388fc]" />
                    Professor Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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
                        <label className="text-sm font-medium text-gray-500">Role</label>
                        <p className="text-lg capitalize">{user?.role}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Teaching Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Quests Created:</span>
                          <span className="font-semibold text-[#0388fc]">{quests.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Students:</span>
                          <span className="font-semibold text-[#0388fc]">{analytics?.total_students || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Submissions:</span>
                          <span className="font-semibold text-[#0388fc]">{analytics?.total_completions || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;