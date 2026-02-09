
import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <section className="text-center space-y-6 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Modernizing Public Service <br />
          <span className="text-blue-600">Through Digital Efficiency</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          The GovQueue system eliminates physical queues, reduces office crowding, and provides transparent wait-time estimations for every citizen.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link to="/generate" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Icons.Ticket /> Generate Token
          </Link>
          <Link to="/status" className="px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Icons.Queue /> View Queue Status
          </Link>
        </div>
      </section>

      {/* Why needed */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Why Digital Queue Management?</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            title="Zero Physical Wait"
            desc="Wait in comfort or attend to other chores until your estimated time. No more standing in long lines."
            icon="🏢"
          />
          <FeatureCard 
            title="Full Transparency"
            desc="Calculated using deterministic math. Real-time position tracking and average service time metrics."
            icon="📊"
          />
          <FeatureCard 
            title="Priority Access"
            desc="Automated rule-based prioritization for senior citizens and persons with disabilities."
            icon="♿"
          />
        </div>
      </section>

      {/* Logic explanation */}
      <section className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Icons.Dashboard />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Engineering Transparency</h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            Unlike predictive systems, GovQueue relies on <strong>Pure Deterministic Logic</strong>. Wait times are calculated as 
            <code className="bg-slate-700 px-2 py-1 rounded mx-1 text-blue-300">Wait Time = (Position - 1) × Avg Service Time</code>. 
            This ensures reproducibility, 100% accuracy based on historical service averages, and works completely offline without AI hallucinations.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-xs text-slate-400">Revenue</div>
              <div className="text-xl font-bold">8m</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-xs text-slate-400">Aadhaar</div>
              <div className="text-xl font-bold">6m</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-xs text-slate-400">Ration</div>
              <div className="text-xl font-bold">7m</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-xs text-slate-400">Bills</div>
              <div className="text-xl font-bold">5m</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
