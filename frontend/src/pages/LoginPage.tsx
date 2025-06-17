import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import Link from 'next/link';

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

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const request: LoginRequest = {
            email: email,
            password: password,
            user_role: activeUserType
        }
        const token = await authService.login(request);
        authService.saveToken(token.access_token);
        navigate(`/dashboard/${activeUserType.toLocaleLowerCase()}`)
    } catch (error) {
        toast.error(`${error}`)
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const userTypes = [
    { value: 'CLIENT', label: 'CLIENT' },
    { value: 'TECHNICIAN', label: 'TECHNICIAN' },
    { value: 'ADMIN', label: 'ADMIN' }
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 min-w-120">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Enter your details below
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Type Selection Buttons */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
            {userTypes.map((type) => (
              <Button
                key={type.value}
                type="button"
                variant={activeUserType === type.value ? "default" : "ghost"}
                className={`
                  h-10 text-sm font-medium transition-all duration-200 cursor-pointer
                  ${activeUserType === type.value 
                    ? 'bg-background text-foreground shadow-sm border border-border' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }
                `}
                onClick={() => setActiveUserType(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 w-12 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full h-11 mt-6 cursor-pointer">
              Login
            </Button>
          </form>
          
          <div className="flex items-center justify-center text-center text-sm pt-2 gap-4">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button className="cursor-pointer" variant={"link"} onClick={() => navigate('/register')}>Register</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;