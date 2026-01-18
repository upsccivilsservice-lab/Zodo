
import React, { useState, useEffect } from 'react';
import { MapPin, Smartphone, Mail, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (method: 'phone' | 'email', value: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleNext = () => {
    if (value.trim()) setStep('otp');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (newOtp.every((digit) => digit !== '') && index === 5) {
      onLogin(method, value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-rose-50/30">
      <div className="w-full max-w-md space-y-8 glass p-10 rounded-[2.5rem] shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-100 rounded-full text-rose-500 animate-bounce shadow-inner">
            <MapPin size={40} />
          </div>
          <h1 className="text-4xl font-bold text-rose-900 tracking-tight">Lumina</h1>
          <p className="text-rose-600 font-medium">Find lovely souls nearby.</p>
        </div>

        {step === 'input' ? (
          <div className="space-y-6">
            <div className="flex bg-rose-100/50 p-1 rounded-2xl">
              <button
                onClick={() => setMethod('phone')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  method === 'phone' ? 'bg-white text-rose-600 shadow-sm' : 'text-rose-400'
                }`}
              >
                Phone
              </button>
              <button
                onClick={() => setMethod('email')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  method === 'email' ? 'bg-white text-rose-600 shadow-sm' : 'text-rose-400'
                }`}
              >
                Email
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400">
                {method === 'phone' ? <Smartphone size={20} /> : <Mail size={20} />}
              </div>
              <input
                type={method === 'phone' ? 'tel' : 'email'}
                placeholder={method === 'phone' ? '+1 234 567 890' : 'hello@lumina.com'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-white/70 border-2 border-rose-100/50 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-rose-200 outline-none transition-all placeholder:text-rose-300 font-medium text-rose-900"
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!value}
              className="w-full bg-rose-400 hover:bg-rose-500 disabled:opacity-50 text-white rounded-2xl py-4 font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 group"
            >
              Continue
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-rose-900">Enter Verification Code</h2>
              <p className="text-sm text-rose-500">Sent to {value}</p>
            </div>

            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white/70 border-2 border-rose-100 rounded-xl focus:ring-4 focus:ring-rose-200 outline-none transition-all text-rose-900"
                />
              ))}
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-rose-400 font-medium">
                {timer > 0 ? `Resend code in ${timer}s` : (
                  <button onClick={() => setTimer(30)} className="text-rose-600 hover:underline">Resend Code</button>
                )}
              </p>
              <button
                onClick={() => setStep('input')}
                className="text-sm text-rose-300 hover:text-rose-500 font-semibold"
              >
                Change {method === 'phone' ? 'Number' : 'Email'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
