import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useDev } from '../context/DevContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ru';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang }) => {
  const { login } = useDev();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-scale-up">
        {/* Glow Effects */}
        <div className="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer z-20"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-zinc-850/80 relative z-10 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-3">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            {isLoginView 
              ? (lang === 'en' ? 'Welcome Back' : 'С возвращением!') 
              : (lang === 'en' ? 'Create Account' : 'Регистрация аккаунта')}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {isLoginView 
              ? (lang === 'en' ? 'Log in to manage your digital cards' : 'Войдите, чтобы управлять вашими визитками') 
              : (lang === 'en' ? 'Start building responsive micro-landings' : 'Начните создавать адаптивные микролендинги')}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
          <div className="space-y-3">
            {/* Email field */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                {lang === 'en' ? 'Email Address' : 'Адрес эл. почты'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail size={14} />
                </span>
                <input 
                  type="email" 
                  required
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                {lang === 'en' ? 'Password' : 'Пароль'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock size={14} />
                </span>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-2 border border-indigo-500/25"
          >
            {isLoginView ? (
              <>
                <LogIn size={14} />
                <span>{lang === 'en' ? 'Sign In' : 'Войти в аккаунт'}</span>
              </>
            ) : (
              <>
                <UserPlus size={14} />
                <span>{lang === 'en' ? 'Create Account' : 'Зарегистрироваться'}</span>
              </>
            )}
          </button>

          {/* View Toggle */}
          <div className="text-center pt-3 border-t border-zinc-850/60 text-xs text-zinc-500">
            {isLoginView ? (
              <span>
                {lang === 'en' ? "Don't have an account? " : "Еще нет аккаунта? "}
                <button
                  type="button"
                  onClick={() => setIsLoginView(false)}
                  className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline bg-transparent border-none cursor-pointer"
                >
                  {lang === 'en' ? 'Register' : 'Создать'}
                </button>
              </span>
            ) : (
              <span>
                {lang === 'en' ? 'Already have an account? ' : 'Уже есть аккаунт? '}
                <button
                  type="button"
                  onClick={() => setIsLoginView(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline bg-transparent border-none cursor-pointer"
                >
                  {lang === 'en' ? 'Login' : 'Войти'}
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
