import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";

import * as authService from "@/lib/services/auth";
import { type UserRole } from '@/lib/types/enums';
import type { LoginRequest } from '@/lib/types/auth';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeUserType, setActiveUserType] = useState<UserRole>("CLIENT");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const request: LoginRequest = {
            email: email,
            password: password,
            user_role: activeUserType
        }
        const token = await authService.login(request);
        authService.saveToken(token.access_token);
        toast.success("You are now logged in");
        navigate(`/dashboard/${activeUserType.toLocaleLowerCase()}`)
    } catch (error) {
        let errorMessage = "An unexpected error occurred. Please try again.";
        if (error instanceof axios.AxiosError) {
            // Check for common error scenarios
            if (error.message.toLowerCase().includes('unauthorized') || 
                error.message.toLowerCase().includes('401')) {
                errorMessage = "Invalid email or password. Please check your credentials and try again.";
            } else if (error.message.toLowerCase().includes('network') || 
                       error.message.toLowerCase().includes('fetch')) {
                errorMessage = "Network error. Please check your internet connection and try again.";
            } else if (error.message.toLowerCase().includes('timeout')) {
                errorMessage = "Request timed out. Please try again.";
            } else if (error.message.toLowerCase().includes('forbidden') || 
                       error.message.toLowerCase().includes('403')) {
                errorMessage = "Access denied. Your account may be suspended or you don't have permission to access this role.";
            } else if (error.message.toLowerCase().includes('not found') || 
                       error.message.toLowerCase().includes('404')) {
                errorMessage = "Account not found. Please check your email address or create a new account.";
            } else if (error.message.toLowerCase().includes('server') || 
                       error.message.toLowerCase().includes('500')) {
                errorMessage = "Server error. Please try again in a few minutes.";
            } else {
                errorMessage = `Login failed: ${error.message}`;
            }
        }
        toast.error(`${errorMessage}`)
    } finally {
        setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const userTypes = [
    { value: 'CLIENT', label: 'Client', icon: User },
    { value: 'TECHNICIAN', label: 'Technician', icon: Zap },
    { value: 'ADMIN', label: 'Admin', icon: Lock }
  ] as const;

  return (
    <div className="flex items-center justify-center px-4 py-8">

      {/* Logo/Brand at top */}
      <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-sky-500 rounded-lg flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          JobConnect
        </span>
      </div>

      <Card className="border-[1.5] min-w-[500px] shadow-2xl relative z-10 mt-100">
        <CardHeader className="space-y-4 pb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <p className="text-gray-600 font-medium">
            Sign in to your account to continue
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* User Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">I am a</Label>
            <div className="grid grid-cols-3 gap-2 p-2 bg-gray-100/80 rounded-xl backdrop-blur-sm">
              {userTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.value}
                    type="button"
                    variant="ghost"
                    className={`
                      h-12 text-xs font-semibold transition-all duration-300 cursor-pointer flex flex-col items-center gap-1 rounded-lg
                      ${activeUserType === type.value 
                        ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg transform scale-105' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                      }
                    `}
                    onClick={() => setActiveUserType(type.value)}
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12 bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-12 pr-12 bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 rounded-full"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="link" 
                className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                onClick={() => {/* Handle forgot password */}}
              >
                Forgot password?
              </Button>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 font-medium">
              Don't have an account yet?
            </p>
            <Button 
              variant="outline" 
              className="w-full h-12 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold transition-all duration-300 cursor-pointer group"
              onClick={() => navigate('/register')}
            >
              <div className="flex items-center gap-2">
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back to Home */}
      <Button
        variant="ghost"
        className="absolute top-8 right-8 text-gray-600 hover:text-gray-900 font-medium z-10"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </Button>
    </div>
  );
};

export default LoginPage;