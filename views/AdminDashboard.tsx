
import React from 'react';
import { Token, Counter, TokenStatus, SERVICE_CONFIG, ServiceType } from '../types';

interface Props {
  tokens: Token[];
  counters: Counter[];
  updateToken: (id: string, updates: Partial<Token>) => void;
  updateCounter: (id: number, updates: Partial<Counter>) => void;
}

const AdminDashboard: React.FC<Props> = ({ tokens, counters, updateToken, updateCounter }) => {
  
  const waitingTokens = tokens
    .filter(t => t.status === TokenStatus.WAITING)
    .sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return a.timestamp - b.timestamp;
    });

  const callNext = (counterId: number) => {
    if (waitingTokens.length === 0) {
      alert("No tokens waiting in queue.");
      return;
    }

    const nextToken = waitingTokens[0];
    updateToken(nextToken.id, { status: TokenStatus.SERVING, counterId });
    updateCounter(counterId, { currentTokenId: nextToken.id });
  };

  const markCompleted = (counterId: number, tokenId: string) => {
    updateToken(tokenId, { status: TokenStatus.COMPLETED, completedAt: Date.now() });
    updateCounter(counterId, { currentTokenId: undefined });
  };

  const markSkipped = (counterId: number, tokenId: string) => {
    updateToken(tokenId, { status: TokenStatus.SKIPPED });
    updateCounter(counterId, { currentTokenId: undefined });
  };

  const stats = {
    total: tokens.length,
    served: tokens.filter(t => t.status === TokenStatus.COMPLETED).length,
    waiting: tokens.filter(t => t.status === TokenStatus.WAITING).length,
    avgServiceTime: 0 // Simplification: in a real system this would be calculated from start/end times
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin/Officer Dashboard</h1>
          <p className="text-slate-500">Manage your counters and serve citizens.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Issued" value={stats.total} color="blue" />
        <StatCard label="Served Today" value={stats.served} color="green" />
        <StatCard label="In Queue" value={stats.waiting} color="amber" />
        <StatCard label="Avg. Time" value="6.5m" color="slate" />
      </div>

      {/* Counter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {counters.map(counter => {
          const currentToken = tokens.find(t => t.id === counter.currentTokenId && t.status === TokenStatus.SERVING);
          
          return (
            <div key={counter.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">{counter.name}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${counter.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {counter.isActive ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 min-h-[160px] flex flex-col justify-center">
                  {currentToken ? (
                    <>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Token</div>
                      <div className="text-5xl font-black text-blue-600 mono">{currentToken.displayId}</div>
                      <div className="text-sm font-medium text-slate-500 mt-2">{currentToken.name || 'Anonymous'}</div>
                      <div className="mt-4 flex justify-center gap-2">
                        <button 
                           onClick={() => markCompleted(counter.id, currentToken.id)}
                           className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 transition-all"
                        >
                          Complete
                        </button>
                        <button 
                           onClick={() => markSkipped(counter.id, currentToken.id)}
                           className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded hover:bg-red-200 transition-all"
                        >
                          No Show
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-400 italic">No token active</div>
                  )}
                </div>

                <button 
                  disabled={!!currentToken || waitingTokens.length === 0}
                  onClick={() => callNext(counter.id)}
                  className={`w-full py-4 text-sm font-bold rounded-lg shadow-sm transition-all ${!currentToken && waitingTokens.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  Call Next Token
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Records (Summary) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
           <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Token</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Counter</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tokens.slice().reverse().slice(0, 10).map(token => (
                <tr key={token.id} className="text-sm">
                  <td className="px-6 py-4 font-bold mono text-blue-600">{token.displayId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      token.status === TokenStatus.COMPLETED ? 'bg-green-100 text-green-700' : 
                      token.status === TokenStatus.SERVING ? 'bg-blue-100 text-blue-700' :
                      token.status === TokenStatus.CANCELLED || token.status === TokenStatus.SKIPPED ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {token.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{SERVICE_CONFIG[token.serviceType].prefix}</td>
                  <td className="px-6 py-4 text-slate-500">{token.counterId ? `C${token.counterId}` : '--'}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(token.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-50 text-slate-600',
  };
  return (
    <div className={`${colors[color]} p-4 rounded-xl border border-current border-opacity-10`}>
      <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{label}</div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
};

export default AdminDashboard;
