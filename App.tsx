
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './views/Home';
import TokenGen from './views/TokenGen';
import LiveStatus from './views/LiveStatus';
import AdminDashboard from './views/AdminDashboard';
import { Icons } from './constants';
import { Token, Counter, TokenStatus } from './types';

const App: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [counters, setCounters] = useState<Counter[]>([
    { id: 1, name: 'Counter 1', isActive: true },
    { id: 2, name: 'Counter 2', isActive: true },
    { id: 3, name: 'Counter 3', isActive: true },
  ]);

  // Daily Reset & Load Logic
  useEffect(() => {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString();

    if (lastResetDate !== today) {
      localStorage.clear();
      localStorage.setItem('lastResetDate', today);
      setTokens([]);
      localStorage.setItem('tokens', JSON.stringify([]));
      localStorage.setItem('counters', JSON.stringify([
        { id: 1, name: 'Counter 1', isActive: true },
        { id: 2, name: 'Counter 2', isActive: true },
        { id: 3, name: 'Counter 3', isActive: true },
      ]));
    } else {
      const storedTokens = localStorage.getItem('tokens');
      const storedCounters = localStorage.getItem('counters');
      if (storedTokens) setTokens(JSON.parse(storedTokens));
      if (storedCounters) setCounters(JSON.parse(storedCounters));
    }
  }, []);

  // Persistence Hook
  useEffect(() => {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('counters', JSON.stringify(counters));
  }, [counters]);

  const addToken = (newToken: Token) => {
    setTokens(prev => [...prev, newToken]);
  };

  const updateToken = (tokenId: string, updates: Partial<Token>) => {
    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, ...updates } : t));
  };

  const updateCounter = (counterId: number, updates: Partial<Counter>) => {
    setCounters(prev => prev.map(c => c.id === counterId ? { ...c, ...updates } : c));
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1 rounded">
                <img src="https://picsum.photos/40/40?grayscale" alt="Gov Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-none">GovQueue</h1>
                <p className="text-xs text-blue-200">Official Token Management System</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <NavLinks />
            </div>
            <div className="text-xs text-right hidden sm:block">
              <div className="font-semibold text-blue-100">{new Date().toLocaleDateString()}</div>
              <div className="text-blue-300">System Active: 24/7</div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
          {/* Mobile Navigation */}
          <div className="md:hidden bg-white border-b flex justify-around p-2 sticky top-16 z-40">
             <NavLinks mobile />
          </div>

          {/* Sidebar */}
          <aside className="hidden md:block w-64 bg-slate-50 border-r border-slate-200 p-6 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Main Menu</h2>
            <nav className="space-y-1">
              <SidebarLink to="/" icon={<Icons.Home />} label="Home" />
              <SidebarLink to="/generate" icon={<Icons.Ticket />} label="Get Token" />
              <SidebarLink to="/status" icon={<Icons.Queue />} label="Live Status" />
              <SidebarLink to="/admin" icon={<Icons.Dashboard />} label="Admin Panel" />
            </nav>
            <div className="pt-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Icons.Clock /> Operational
                </h3>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Tokens are now available 24/7. System resets daily at midnight to maintain performance.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generate" element={<TokenGen tokens={tokens} addToken={addToken} />} />
              <Route path="/status" element={<LiveStatus tokens={tokens} counters={counters} />} />
              <Route path="/admin" element={<AdminDashboard tokens={tokens} counters={counters} updateToken={updateToken} updateCounter={updateCounter} />} />
            </Routes>
          </main>
        </div>
        
        {/* Footer */}
        <footer className="bg-slate-100 border-t border-slate-200 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Government Public Information Office. This system uses deterministic sequential logic.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

const NavLinks = ({ mobile }: { mobile?: boolean }) => {
  const location = useLocation();
  const baseClasses = mobile ? "flex flex-col items-center gap-1 text-[10px]" : "flex items-center gap-2 text-sm font-medium hover:text-blue-200 transition-colors";
  
  return (
    <>
      <Link to="/" className={`${baseClasses} ${location.pathname === '/' ? 'text-blue-200' : ''}`}>
        <Icons.Home /> {!mobile && 'Home'}
      </Link>
      <Link to="/generate" className={`${baseClasses} ${location.pathname === '/generate' ? 'text-blue-200' : ''}`}>
        <Icons.Ticket /> {!mobile && 'Get Token'}
      </Link>
      <Link to="/status" className={`${baseClasses} ${location.pathname === '/status' ? 'text-blue-200' : ''}`}>
        <Icons.Queue /> {!mobile && 'Status'}
      </Link>
      <Link to="/admin" className={`${baseClasses} ${location.pathname === '/admin' ? 'text-blue-200' : ''}`}>
        <Icons.Dashboard /> {!mobile && 'Admin'}
      </Link>
    </>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>
      <span className={isActive ? 'text-white' : 'text-slate-400'}>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default App;
