import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Coins, Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface DailyReward {
  day: number;
  type: 'xp' | 'coins' | 'badge';
  amount?: number;
  badge?: {
    name: string;
    icon: string;
  };
  claimed: boolean;
}

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimReward: (reward: DailyReward) => void;
}

const DailyRewardModal = ({ isOpen, onClose, onClaimReward }: DailyRewardModalProps) => {
  const [currentStreak, setCurrentStreak] = useState(3); // Example: user is on day 3
  const [showCelebration, setShowCelebration] = useState(false);

  const dailyRewards: DailyReward[] = [
    { day: 1, type: 'xp', amount: 50, claimed: true },
    { day: 2, type: 'coins', amount: 100, claimed: true },
    { day: 3, type: 'xp', amount: 75, claimed: false }, // Today's reward
    { day: 4, type: 'coins', amount: 150, claimed: false },
    { day: 5, type: 'xp', amount: 100, claimed: false },
    { day: 6, type: 'coins', amount: 200, claimed: false },
    { day: 7, type: 'badge', badge: { name: 'Weekly Warrior', icon: '🏆' }, claimed: false },
  ];

  const todaysReward = dailyRewards.find(reward => reward.day === currentStreak && !reward.claimed);

  const handleClaimReward = () => {
    if (todaysReward) {
      setShowCelebration(true);
      setTimeout(() => {
        onClaimReward(todaysReward);
        setShowCelebration(false);
        onClose();
      }, 2000);
    }
  };

  const getRewardIcon = (reward: DailyReward) => {
    switch (reward.type) {
      case 'xp':
        return <Zap className="h-6 w-6 text-blue-500" />;
      case 'coins':
        return <Coins className="h-6 w-6 text-yellow-500" />;
      case 'badge':
        return <Trophy className="h-6 w-6 text-purple-500" />;
      default:
        return <Gift className="h-6 w-6" />;
    }
  };

  const getRewardText = (reward: DailyReward) => {
    switch (reward.type) {
      case 'xp':
        return `${reward.amount} XP`;
      case 'coins':
        return `${reward.amount} Coins`;
      case 'badge':
        return reward.badge?.name || 'Special Badge';
      default:
        return 'Mystery Reward';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
            <Gift className="h-6 w-6 text-primary" />
            Daily Login Reward
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Streak Counter */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-semibold">Day {currentStreak} Streak!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep logging in daily to maintain your streak
            </p>
          </div>

          {/* Reward Grid */}
          <div className="grid grid-cols-7 gap-2 p-4 bg-muted/50 rounded-lg">
            {dailyRewards.map((reward) => (
              <div
                key={reward.day}
                className={`
                  relative p-3 rounded-lg border-2 transition-all duration-300
                  ${reward.claimed 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : reward.day === currentStreak 
                      ? 'border-primary bg-primary/10 animate-pulse-primary' 
                      : 'border-muted bg-background'
                  }
                `}
              >
                <div className="text-center space-y-1">
                  <div className="text-xs font-medium">Day {reward.day}</div>
                  <div className="flex justify-center">
                    {getRewardIcon(reward)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getRewardText(reward)}
                  </div>
                  {reward.claimed && (
                    <div className="absolute -top-1 -right-1">
                      <Badge variant="secondary" className="h-5 w-5 p-0 rounded-full bg-green-500 text-white">
                        ✓
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Today's Reward */}
          {todaysReward && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 border-2 border-primary rounded-lg bg-primary/5"
            >
              <h3 className="font-semibold mb-2">Today's Reward</h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                {getRewardIcon(todaysReward)}
                <span className="text-lg font-semibold">
                  {getRewardText(todaysReward)}
                </span>
              </div>
              
              {showCelebration ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-primary font-semibold">Reward Claimed!</p>
                </motion.div>
              ) : (
                <Button 
                  onClick={handleClaimReward}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Claim Reward
                </Button>
              )}
            </motion.div>
          )}

          {/* No reward available */}
          {!todaysReward && (
            <div className="text-center text-muted-foreground">
              <p>Come back tomorrow for your next reward!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyRewardModal;