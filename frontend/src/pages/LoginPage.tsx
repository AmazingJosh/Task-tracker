import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slices/authSlice.ts';
import { Eye, EyeOff } from 'lucide-react';
import { Loader2 } from 'lucide-react'; 
import { ToastContainer, toast } from 'react-toastify';
import {login} from '../services/authServices.ts'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      
      const { token, user } = await login(data);
  
      // this where i am saving the token to Redux
      dispatch(setAuth({ token, user }));
  
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
  
      toast.success('Login successful! 🎉');
  
      navigate('/tasks'); //
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message);
  
      const message = err.response?.data?.message || 'something went wrong please try again.';
      setLoginError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-3">Welcome Back 👋</h1>
            <p className="text-gray-700 mb-6 text-sm md:text-base">
              Login to your <span className="font-semibold text-green-700">Task Tracker</span> and start trackng your app!
            </p>
  
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...register('email')}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
  
       
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  />
                  <span
                    className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>
  
        
              {loginError && (
                <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{loginError}</p>
              )}
  
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sigining in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
        </div>
  
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-green-100">
          <div className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Dont't have an account?</h2>
            <p className="text-gray-700 mb-4 text-sm md:text-base">
           Create a new account and start tracking your task!
            </p>
            <Link
              to="/register"
              className="text-green-700 font-semibold hover:underline transition"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
  
      <ToastContainer />
    </div>
  );
  
  
};

export default LoginPage;
