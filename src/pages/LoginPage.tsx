import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, Lock, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const navigate = useNavigate();
  const { login } = useAuth();

  // Pre-fill demo credentials
  useEffect(() => {
    if (role === 'student') {
      setEmail('aigerim@example.com');
      setPassword('student123');
    } else {
      setEmail('alidar@example.com');
      setPassword('professor123');
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(role === 'student' ? '/student' : '/professor');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-gray-600 hover:text-[#0388fc]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <img 
                src={logo} 
                alt="Coventry University Astana" 
                className="w-16 h-16 mx-auto mb-4"
              />
              <CardTitle className="text-2xl font-bold text-[#0388fc] mb-2">
                Welcome to CoLink
              </CardTitle>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                {role === 'student' ? (
                  <>
                    <GraduationCap className="w-5 h-5" />
                    <span>Student Login</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Professor Login</span>
                  </>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Demo Credentials Info */}
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>Email: {role === 'student' ? 'aigerim@example.com' : 'alidar@example.com'}</p>
                <p>Password: {role === 'student' ? 'student123' : 'professor123'}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-[#0388fc] focus:ring-[#0388fc]"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-[#0388fc] focus:ring-[#0388fc]"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0388fc] hover:bg-blue-600 text-white py-3 text-lg font-medium"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Don't have an account? Contact your administrator.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;