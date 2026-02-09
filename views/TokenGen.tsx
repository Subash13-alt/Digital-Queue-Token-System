
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceType, Token, TokenStatus, SERVICE_CONFIG } from '../types';

interface Props {
  tokens: Token[];
  addToken: (token: Token) => void;
}

const TokenGen: React.FC<Props> = ({ tokens, addToken }) => {
  const [service, setService] = useState<ServiceType>(ServiceType.REVENUE);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isPriority, setIsPriority] = useState(false);
  const [showSuccess, setShowSuccess] = useState<Token | null>(null);
  const navigate = useNavigate();

  const generateToken = (e: React.FormEvent) => {
    e.preventDefault();

    const config = SERVICE_CONFIG[service];
    const serviceTokens = tokens.filter(t => t.serviceType === service);
    const nextSequence = serviceTokens.length + 1;
    const paddedSequence = nextSequence.toString().padStart(3, '0');
    const displayId = `${config.prefix}-${paddedSequence}`;

    const newToken: Token = {
      id: Math.random().toString(36).substr(2, 9),
      displayId,
      serviceType: service,
      name,
      phone,
      isPriority,
      status: TokenStatus.WAITING,
      timestamp: Date.now(),
    };

    addToken(newToken);
    setShowSuccess(newToken);
    
    // Reset form
    setName('');
    setPhone('');
    setIsPriority(false);
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-green-100 p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">
            ✓
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Token Generated!</h2>
            <p className="text-slate-500">Please take a screenshot or note this down.</p>
          </div>
          
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Token Number</div>
            <div className="text-6xl font-black text-blue-600 mono tracking-tighter">{showSuccess.displayId}</div>
            {showSuccess.isPriority && (
              <div className="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase">
                Priority Token
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => navigate('/status')}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Live Status
            </button>
            <button 
              onClick={() => setShowSuccess(null)}
              className="w-full py-3 text-slate-600 font-medium hover:bg-slate-100 transition-colors rounded-lg"
            >
              Generate Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Get Your Service Token</h1>
        <p className="text-slate-500">Fill in the details below to join the digital queue.</p>
      </div>

      <form onSubmit={generateToken} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        {/* Service Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Select Service Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(SERVICE_CONFIG).map(([type, config]) => (
              <label 
                key={type}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${service === type ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <input 
                  type="radio" 
                  name="service" 
                  className="hidden" 
                  value={type} 
                  checked={service === type} 
                  onChange={() => setService(type as ServiceType)}
                />
                <div className="flex-1">
                  <div className={`text-sm font-bold ${service === type ? 'text-blue-700' : 'text-slate-700'}`}>{config.label}</div>
                  <div className="text-xs text-slate-500">Est. {config.avgTime} mins per token</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${service === type ? 'border-blue-500' : 'border-slate-300'}`}>
                  {service === type && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Full Name (Optional)</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Mobile Number (Optional)</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10 digit number"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Priority Toggle */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <input 
            type="checkbox" 
            id="priority" 
            checked={isPriority}
            onChange={(e) => setIsPriority(e.target.checked)}
            className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="priority" className="flex-1">
            <div className="text-sm font-bold text-amber-900">Priority Token Request</div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Enable this if you are a senior citizen or have a physical disability. Priority tokens are placed at the front of the waiting queue.
            </p>
          </label>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 text-lg font-bold rounded-lg shadow-lg transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
        >
          Generate My Token
        </button>
      </form>
    </div>
  );
};

export default TokenGen;
