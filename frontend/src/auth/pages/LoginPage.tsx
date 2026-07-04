import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/common/components/Card';
import ErpInputField from '@/common/components/ErpInputField';
import { APP_ROUTES } from '@/common/constants';
import { LoginFormData } from '../types/auth.types';
import ErpPasswordInput from '../components/ErpPasswordInput';
import { useLogin, useIsLoggedIn } from '../hooks/api.hooks';
import appIcon from '@/assets/icons/app_icon.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { mutate: loginMutate, isPending } = useLogin();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(APP_ROUTES.COMPANY_LIST.path);
    }
  }, [isLoggedIn, navigate]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    loginMutate(formData, {
      onError: (err: any) => {
        if (err.response?.status === 401) {
          setErrorMsg(err.response.data?.message || 'Invalid email or password');
        }
      }
    });
  }, [formData, loginMutate]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-[#0c3d7e] via-[#002c66] to-[#001733] p-4 font-sans select-none">
      <Card
        className="w-full max-w-[420px] shadow-2xl transition-all duration-300 hover:shadow-3xl"
        elevation={3}
        borderThickness={1}
        borderColor="#cbd5e1"
      >
        {/* TODO: add app logo */}
        <div className="flex justify-center mb-1">
          <img src={appIcon} alt="SmartERP" className="h-14 w-14 object-contain transform transition duration-300 hover:scale-105" />
        </div>

        <h2 className="text-xl font-bold text-center text-[#002c66] tracking-tight mb-2">
          LogIn to SmartErp
        </h2>

        {errorMsg && (
          <div className="text-center text-sm font-semibold text-[#dc2626] mb-3">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <ErpInputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            autoFocus
            vertical={true}
          />

          <ErpPasswordInput
            label="Password"
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            placeholder="Enter your password"
            required={true}
          />

          <button
            type="submit"
            disabled={isPending}
            className="smarterp-btn-save w-full text-center mt-3 py-2 text-sm font-bold tracking-wide rounded cursor-pointer transition duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isPending && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isPending ? 'Logging In, please wait' : 'Log In'}
          </button>
        </form>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#f8fafc] px-2 text-slate-400 font-semibold tracking-wider">or</span>
          </div>
        </div>

        <div className="text-center w-full">
          <button
            type="button"
            onClick={() => navigate(APP_ROUTES.REGISTER.path)}
            className="text-xs font-bold text-[#002c66] hover:text-[#001f4d] transition cursor-pointer hover:underline focus:outline-none"
          >
            Register new user
          </button>
        </div>
      </Card>
    </div>
  );
}
