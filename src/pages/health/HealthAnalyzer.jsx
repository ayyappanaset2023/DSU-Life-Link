import React, { useState, useEffect } from 'react';
import { 
  Scale, Activity, ArrowRight, History, 
  Target, Info, AlertCircle, CheckCircle, Flame, 
  RefreshCw, TrendingUp, Calendar, Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';

export default function HealthAnalyzer() {
  const { currentUser } = useAuth();
  const { addBMIRecord, getBMIRecords, updateUserGoal, getUserGoal } = useDatabase();

  const [form, setForm] = useState({ height: '', weight: '', age: '' });
  const [result, setResult] = useState(null);
  const [targetWeight, setTargetWeight] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setHistory(getBMIRecords(currentUser.id));
      const goal = getUserGoal(currentUser.id);
      if (goal?.targetWeight) setTargetWeight(goal.targetWeight);
    }
  }, [currentUser]);

  const calculateBMI = (e) => {
    e?.preventDefault();
    const h = parseFloat(form.height) / 100; // to meters
    const w = parseFloat(form.weight);
    
    if (!h || !w) return;
    
    const bmi = (w / (h * h)).toFixed(1);
    let category = '';
    let color = '';
    let tips = [];

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500 bg-blue-50';
      tips = [
        'Focus on high-calorie, nutrient-dense foods (nuts, avocados).',
        'Eat smaller, more frequent meals throughout the day.',
        'Include protein-rich snacks like Greek yogurt or protein shakes.'
      ];
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Normal';
      color = 'text-emerald-500 bg-emerald-50';
      tips = [
        'Maintain your balanced diet and current level of physical activity.',
        'Focus on 30 minutes of moderate exercise 5 days a week.',
        'Stay hydrated and ensure 7-8 hours of quality sleep.'
      ];
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = 'Overweight';
      color = 'text-amber-500 bg-amber-50';
      tips = [
        'Try to incorporate at least 30-45 minutes of daily physical activity.',
        'Reduce intake of processed sugars and oily fast foods.',
        'Focus on portion control and high-fiber vegetables.'
      ];
    } else {
      category = 'Obese';
      color = 'text-rose-500 bg-rose-50';
      tips = [
        'Consult a healthcare professional for a structured clinical diet plan.',
        'Begin a low-impact exercise routine like walking or swimming.',
        'Aim for a gradual, sustainable weight loss of 0.5-1kg per week.'
      ];
    }

    const res = { bmi, category, color, tips };
    setResult(res);

    if (currentUser) {
      addBMIRecord(currentUser.id, { 
        userId: currentUser.id, 
        bmi, 
        category, 
        height: form.height, 
        weight: form.weight 
      });
      setHistory(getBMIRecords(currentUser.id));
    }
  };

  const handleSetGoal = () => {
    if (!currentUser || !targetWeight) return;
    updateUserGoal(currentUser.id, { targetWeight });
    alert("Target weight goal synchronized!");
  };

  const resetForm = () => {
    setForm({ height: '', weight: '', age: '' });
    setResult(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {!result ? (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-10 md:p-14 rounded-[56px] border border-slate-100 shadow-2xl shadow-indigo-950/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Scale className="w-40 h-40" />
            </div>
            
            <div className="relative z-10 mb-10">
              <h2 className="text-3xl font-black text-indigo-950 tracking-tight mb-2 uppercase">Smart Health <span className="text-blue-600">Analyzer</span></h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-loose max-w-sm">
                Enter your physical metrics for a clinical AI assessment of your body composition.
              </p>
            </div>

            <form onSubmit={calculateBMI} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-blue-500" /> Height (CM)
                  </label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 175"
                    className="w-full bg-slate-50 border-none rounded-3xl p-5 text-lg font-black text-indigo-950 shadow-inner focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    value={form.height}
                    onChange={e => setForm({...form, height: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3 text-rose-500" /> Weight (KG)
                  </label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 72"
                    className="w-full bg-slate-50 border-none rounded-3xl p-5 text-lg font-black text-indigo-950 shadow-inner focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
                    value={form.weight}
                    onChange={e => setForm({...form, weight: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                   Age (Optional)
                </label>
                <input 
                  type="number" 
                  placeholder="e.g. 25"
                  className="w-full bg-slate-50 border-none rounded-3xl p-5 text-lg font-black text-indigo-950 shadow-inner focus:ring-4 focus:ring-slate-500/10 transition-all outline-none"
                  value={form.age}
                  onChange={e => setForm({...form, age: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-950 hover:bg-blue-600 text-white p-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl shadow-indigo-950/20 active:scale-95 flex items-center justify-center gap-4 group"
              >
                Analyze My Health
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in zoom-in duration-500">
          {/* Main Result Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-2xl shadow-indigo-950/5 relative overflow-hidden text-center lg:text-left">
               <div className="absolute top-0 right-0 p-8">
                  <button onClick={resetForm} className="p-4 bg-slate-50 hover:bg-indigo-950 hover:text-white rounded-2xl transition-all">
                    <RefreshCw className="w-5 h-5" />
                  </button>
               </div>
               <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className={`w-48 h-48 rounded-[48px] flex flex-col items-center justify-center shadow-xl ${result.color}`}>
                     <span className="text-5xl font-black tracking-tighter">{result.bmi}</span>
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Your BMI</span>
                  </div>
                  <div className="space-y-4">
                     <h2 className={`text-4xl font-black uppercase tracking-tight ${result.color.split(' ')[0]}`}>{result.category}</h2>
                     <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
                        Based on your current metrics, your BMI falls within the **{result.category}** range. Review the clinical advice below.
                     </p>
                  </div>
               </div>
            </div>

            {/* Health Tips Card */}
            <div className="bg-indigo-900 rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute bottom-0 right-0 p-10 opacity-10">
                  <TrendingUp className="w-40 h-40" />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Personalized <span className="text-blue-400">Prescription</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.tips.map((tip, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/10 flex gap-4">
                       <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                       <p className="text-sm font-medium leading-relaxed italic">{tip}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Goals & History Sidebar */}
          <div className="space-y-8">
            {/* Target Weight Card */}
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl shadow-indigo-950/5">
               <h4 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-500" /> Physical Goal
               </h4>
               <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-between border border-transparent focus-within:border-blue-200 transition-all">
                     <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Target Weight</span>
                        <input 
                          type="number" 
                          placeholder="e.g. 65"
                          className="bg-transparent border-none text-xl font-black text-indigo-950 outline-none w-20"
                          value={targetWeight}
                          onChange={e => setTargetWeight(e.target.value)}
                        />
                     </div>
                     <button onClick={handleSetGoal} className="bg-indigo-950 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all">
                        Sync
                     </button>
                  </div>
                  
                  {targetWeight && result && (
                    <div className="space-y-3">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Current: {form.weight}kg</span>
                          <span>Goal: {targetWeight}kg</span>
                       </div>
                       <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000" 
                            style={{ width: `${Math.min(100, Math.max(10, (parseFloat(form.weight) / parseFloat(targetWeight)) * 100))}%` }}
                          />
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {/* History Section */}
            {history.length > 0 && (
              <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl shadow-indigo-950/5">
                 <div className="flex items-center justify-between mb-8">
                    <h4 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                       <History className="w-4 h-4 text-blue-500" /> Timeline
                    </h4>
                    <button onClick={() => setShowHistory(!showHistory)} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline whitespace-nowrap">
                       {showHistory ? 'Collapse' : 'Show All'}
                    </button>
                 </div>
                 
                 <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                    {history.slice(0, showHistory ? 20 : 3).map((record) => (
                      <div key={record.id} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-950 text-sm shadow-sm">
                           {record.bmi}
                        </div>
                        <div className="flex-1">
                           <p className="text-[10px] font-black uppercase tracking-tight text-indigo-950 leading-none">{record.category}</p>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              {new Date(record.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           </span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400">
                           {record.weight}kg
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Health Tip Notification (Simulated Extra) */}
      <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100/50 flex items-center gap-6 group hover:bg-blue-50 transition-colors duration-500">
         <div className="bg-blue-100 p-4 rounded-3xl text-blue-600 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6" />
         </div>
         <div className="flex-1">
            <h5 className="font-black text-indigo-950 text-sm uppercase tracking-tight">Daily Health Insight</h5>
            <p className="text-blue-900/60 text-xs font-medium italic">
               "Drinking 500ml of water 30 minutes before meals can help increase weight loss and improve digestion."
            </p>
         </div>
      </div>
    </div>
  );
}
