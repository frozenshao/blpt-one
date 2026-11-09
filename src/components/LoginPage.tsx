import React, { useState, useEffect, useRef } from 'react';
import { Microscope, Lock, User as UserIcon, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { getUsers, setCurrentUser } from '../data/authService';
import { User } from '../types/user';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123456');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random 4-char captcha code
  const generateRandomCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Draw graphical captcha on canvas
  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#f0f6fc');
    bgGrad.addColorStop(1, '#e2edfa');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Random noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100 + 80)}, ${Math.floor(Math.random() * 150 + 100)}, 0.45)`;
      ctx.lineWidth = 1 + Math.random();
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

    // Random noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 180)}, 0.4)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with random rotation and colors
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const charWidth = width / (code.length + 1);

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const charX = (i + 1) * charWidth + (Math.random() - 0.5) * 6;
      const charY = height / 2 + (Math.random() - 0.5) * 8;
      const angle = (Math.random() - 0.5) * 0.45;

      ctx.save();
      ctx.translate(charX, charY);
      ctx.rotate(angle);
      ctx.font = `bold ${Math.floor(22 + Math.random() * 4)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

      // Palette of crisp deep colors
      const colors = ['#0e3b66', '#1e40af', '#0369a1', '#0f766e', '#4338ca', '#155e75'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newCode = generateRandomCaptcha();
    setCaptchaCode(newCode);
    setCaptchaInput('');
    setErrorMessage(null);
    setTimeout(() => {
      drawCaptcha(newCode);
    }, 20);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim();
    const cleanPwd = password.trim();
    const cleanCaptcha = captchaInput.trim();

    if (!cleanUser) {
      setErrorMessage('请输入用户名');
      return;
    }
    if (!cleanPwd) {
      setErrorMessage('请输入密码');
      return;
    }
    if (!cleanCaptcha) {
      setErrorMessage('请输入图形验证码');
      return;
    }

    // Check captcha (case-insensitive)
    if (cleanCaptcha.toLowerCase() !== captchaCode.toLowerCase()) {
      setErrorMessage('验证码错误，请重新输入');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.username.toLowerCase() === cleanUser.toLowerCase());

      if (!user) {
        setIsLoading(false);
        setErrorMessage('用户不存在，请核对用户名');
        refreshCaptcha();
        return;
      }

      if (user.password && user.password !== cleanPwd) {
        setIsLoading(false);
        setErrorMessage('密码错误，请重新输入');
        refreshCaptcha();
        return;
      }

      setCurrentUser(user);
      setIsLoading(false);
      onLoginSuccess(user);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#0e2a4a] via-[#10385c] to-[#18446b] selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background biological lattice / glowing ambient elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-sky-100/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[#0e3b66] via-[#164775] to-[#1e5284] p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/20 mb-3 shadow-inner">
            <Microscope className="w-6 h-6 text-sky-200" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">
            病理数据检索与分析平台
          </h1>
          <p className="text-xs text-sky-200/80 mt-1">
            Pathology Data Retrieval and Analysis Platform
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-sm font-bold text-[#102a48]">账号安全登录</span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-[#102a48] mb-1.5">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="login-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入登录用户名"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0e3b66]/20 focus:border-[#0e3b66] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-[#102a48] mb-1.5">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入登录密码"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0e3b66]/20 focus:border-[#0e3b66] transition-all"
                />
              </div>
            </div>

            {/* Graphical Captcha Input */}
            <div>
              <label className="block text-xs font-bold text-[#102a48] mb-1.5">
                图形验证码
              </label>
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    id="login-captcha-input"
                    type="text"
                    maxLength={4}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="请输入4位验证码"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 uppercase font-mono tracking-wider placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0e3b66]/20 focus:border-[#0e3b66] transition-all"
                  />
                </div>

                {/* Captcha Canvas */}
                <div 
                  onClick={refreshCaptcha}
                  title="看不清？点击刷新验证码"
                  className="relative group cursor-pointer border border-[#bcd7ee] rounded-xl overflow-hidden shadow-2xs hover:border-[#0e3b66] transition-all bg-[#f0f6fc] shrink-0"
                >
                  <canvas 
                    ref={canvasRef} 
                    width={110} 
                    height={38} 
                    className="block"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center transition-colors">
                    <RefreshCw className="w-3 h-3 text-[#0e3b66] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                <span>验证码不区分大小写</span>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="text-[#18446b] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>刷新</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#0e3b66] hover:bg-[#124575] active:bg-[#092b4d] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>安全登录中...</span>
                </>
              ) : (
                <span>立即登录</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
