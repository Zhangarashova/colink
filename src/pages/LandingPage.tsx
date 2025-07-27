import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users } from 'lucide-react';
import logo from '../assets/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <img 
              src={logo} 
              alt="Coventry University Astana" 
              className="w-32 h-32 mx-auto mb-6 drop-shadow-lg"
            />
            <h1 className="text-4xl md:text-6xl font-bold text-[#0388fc] mb-4">
              CoLink
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-2">
              Coventry University Astana
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Connect, Learn, and Achieve Together
            </p>
          </motion.div>

          {/* Role Selection Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto"
          >
            {/* Student Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-[#0388fc] cursor-pointer">
              <CardContent className="p-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login?role=student')}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-[#0388fc] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    I'm a Student
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Access quests, earn badges, and track your learning progress
                  </p>
                  <Button 
                    className="w-full bg-[#0388fc] hover:bg-blue-600 text-white py-3 text-lg font-medium"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Professor Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-[#0388fc] cursor-pointer">
              <CardContent className="p-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login?role=professor')}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-[#0388fc] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    I'm a Professor
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Create quests, monitor progress, and engage with students
                  </p>
                  <Button 
                    className="w-full bg-[#0388fc] hover:bg-blue-600 text-white py-3 text-lg font-medium"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center text-gray-500"
          >
            <p>&copy; 2024 Coventry University Astana. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;