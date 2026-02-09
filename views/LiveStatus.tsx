
import React from 'react';
import { Token, Counter, TokenStatus, SERVICE_CONFIG, ServiceType } from '../types';

interface Props {
  tokens: Token[];
  counters: Counter[];
}

const LiveStatus: React.FC<Props> = ({ tokens, counters }) => {
  const servingTokens = tokens.filter(t => t.status === TokenStatus.SERVING);
  const waitingTokens = tokens
    .filter(t => t.status === TokenStatus.WAITING)
    .sort((a, b) => {
      // Logic: Priority tokens first, then by timestamp
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return a.timestamp - b.timestamp;
    });

  const getWaitTime = (token: Token) => {
    const pos = waitingTokens.findIndex(t => t.id === token.id);
    if (pos === -1) return 0;
    const avg = SERVICE_CONFIG[token.serviceType].avgTime;
    return (pos + 1) * avg; // Deterministic calculation
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Live Queue Status</h1>
          <p className="text-slate-500">Real-time updates from service counters.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold uppercase">System Live</span>
        </div>
      </div>

      {/* Counter Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {counters.map(counter => {
          const currentToken = tokens.find(t => t.id === counter.currentTokenId && t.status === TokenStatus.SERVING);
          return (
            <div key={counter.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-800 text-white p-3 text-center text-sm font-bold uppercase tracking-widest">
                {counter.name}
              </div>
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                {currentToken ? (
                  <>
                    <div className="text-xs font-bold text-green-600 uppercase tracking-widest">Now Serving</div>
                    <div className="text-6xl font-black text-slate-900 mono tracking-tighter">{currentToken.displayId}</div>
                    <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {SERVICE_CONFIG[currentToken.serviceType].label}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-300 font-medium">Counter Idle</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Waiting Queue ({waitingTokens.length})</h2>
          <div className="text-xs text-slate-400 font-medium">Sorted by Priority & Timestamp</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Token</th>
                <th className="px-6 py-4">Service Type</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Est. Wait Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {waitingTokens.map((token, idx) => (
                <tr key={token.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="px-6 py-4">
                    <span className="mono font-bold text-blue-600 text-lg">{token.displayId}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{SERVICE_CONFIG[token.serviceType].label}</td>
                  <td className="px-6 py-4">
                    {token.isPriority ? (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">Priority</span>
                    ) : (
                      <span className="text-slate-300 text-[10px] font-bold uppercase">Standard</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`font-bold ${getWaitTime(token) > 30 ? 'text-red-500' : 'text-slate-700'}`}>
                         ~{getWaitTime(token)} mins
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      Waiting
                    </span>
                  </td>
                </tr>
              ))}
              {waitingTokens.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No tokens currently waiting. 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveStatus;
