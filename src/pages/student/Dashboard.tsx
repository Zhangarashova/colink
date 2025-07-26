import { Trophy, Target, Gamepad2, Users, ArrowRight, Star, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import TopRightNavigation from "@/components/TopRightNavigation";
import DailyRewardModal from "@/components/DailyRewardModal";

const StudentDashboard = () => {
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "Alex Thompson",
    xp: 1250,
    level: 8,
    nextLevelXP: 1500,
    badges: 7,
    questsCompleted: 15,
    rank: 12
  });

  // Check if user should see daily reward (simulate checking last login)
  useEffect(() => {
    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      setShowDailyReward(true);
      localStorage.setItem('lastLogin', today);
    }
  }, []);

  const recentBadges = [
    { id: 1, name: "First Quest", icon: "🏆", type: "bronze" },
    { id: 2, name: "Team Player", icon: "🤝", type: "silver" },
    { id: 3, name: "Quick Learner", icon: "⚡", type: "gold" }
  ];

  const activeQuests = [
    { id: 1, title: "Complete Computer Science Assignment", xp: 150, progress: 75 },
    { id: 2, title: "Attend Virtual Lab Session", xp: 100, progress: 0 },
    { id: 3, title: "Participate in Group Discussion", xp: 80, progress: 50 }
  ];

  const handleClaimReward = (reward: any) => {
    // Update student data based on reward type
    if (reward.type === 'xp') {
      setStudentData(prev => ({
        ...prev,
        xp: prev.xp + reward.amount
      }));
    }
    // Handle other reward types (coins, badges) here
    console.log('Reward claimed:', reward);
  };

  const xpProgress = (studentData.xp / studentData.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-gradient-secondary p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Welcome back, {studentData.name}! 🎯
          </h1>
          <p className="text-muted-foreground">Ready to continue your learning journey?</p>
        </div>

        {/* XP Progress Section */}
        <Card className="shadow-primary border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Level {studentData.level} Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{studentData.xp} XP</span>
                <span>{studentData.nextLevelXP} XP</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
              <p className="text-sm text-muted-foreground text-center">
                {studentData.nextLevelXP - studentData.xp} XP until Level {studentData.level + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{studentData.badges}</div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{studentData.questsCompleted}</div>
              <p className="text-sm text-muted-foreground">Quests Done</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">#{studentData.rank}</div>
              <p className="text-sm text-muted-foreground">Leaderboard</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Gamepad2 className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">85%</div>
              <p className="text-sm text-muted-foreground">Game Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Quests */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Active Quests
              </CardTitle>
              <Link to="/student/quests">
                <Button variant="outline" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeQuests.map((quest) => (
                <div key={quest.id} className="p-3 bg-accent/50 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{quest.title}</h4>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      {quest.xp} XP
                    </span>
                  </div>
                  <Progress value={quest.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{quest.progress}% complete</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Recent Badges
              </CardTitle>
              <Link to="/student/badges">
                <Button variant="outline" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {recentBadges.map((badge) => (
                  <div key={badge.id} className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-accent rounded-full flex items-center justify-center text-2xl hover:shadow-badge transition-all duration-300 group-hover:scale-110">
                      {badge.icon}
                    </div>
                    <p className="text-xs font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{badge.type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
      
      <TopRightNavigation 
        userRole="student" 
        xp={studentData.xp} 
        level={studentData.level} 
        coins={3} 
        notificationCount={5} 
      />
      
      <BottomNavigation 
        userRole="student" 
        xp={studentData.xp} 
        level={studentData.level} 
        coins={3} 
        notificationCount={5} 
      />

      {/* Daily Reward Modal */}
      <DailyRewardModal
        isOpen={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        onClaimReward={handleClaimReward}
      />
    </div>
  );
};

export default StudentDashboard;