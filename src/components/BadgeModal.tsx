import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '../lib/database';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, onClose, badge }) => {
  useEffect(() => {
    if (isOpen && badge) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen, badge]);

  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-center py-6"
            >
              {/* Badge Icon with Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                className="relative mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                
                {/* Sparkle effects */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <Star className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-2 -left-2"
                >
                  <Award className="w-5 h-5 text-orange-400" />
                </motion.div>
              </motion.div>

              {/* Badge Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  🎉 Congratulations!
                </h2>
                <h3 className="text-xl font-semibold text-[#0388fc] mb-3">
                  {badge.title}
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {badge.description}
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Badge Earned</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(badge.earned_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <Button
                  onClick={onClose}
                  className="bg-[#0388fc] hover:bg-blue-600 text-white px-8 py-2"
                >
                  Awesome!
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeModal;