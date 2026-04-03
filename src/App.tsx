/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Clock, DollarSign, Info, Home, ArrowRight } from 'lucide-react';

export default function App() {
  interface WorkDay {
    id: string;
    hours75: number | '';
    hours162: number | '';
    hours100: number | '';
    hours200: number | '';
  }

  // Inputs
  const [hourlyWage, setHourlyWage] = useState<number | ''>('');
  const [workload, setWorkload] = useState<number>(220);
  
  // Days worked
  const [days, setDays] = useState<WorkDay[]>([{ id: '1', hours75: '', hours162: '', hours100: '', hours200: '' }]);
  const [expandedDayId, setExpandedDayId] = useState<string | null>('1');

  // Calculations
  const calculations = useMemo(() => {
    const wage = Number(hourlyWage || 0);
    
    const totals = days.reduce((acc, day) => {
      acc.val75 += wage * 1.75 * Number(day.hours75 || 0);
      acc.val162 += wage * 2.625 * Number(day.hours162 || 0);
      acc.val100 += wage * 2.00 * Number(day.hours100 || 0);
      acc.val200 += wage * 3.00 * Number(day.hours200 || 0);
      return acc;
    }, { val75: 0, val162: 0, val100: 0, val200: 0 });
    
    const totalOvertime = totals.val75 + totals.val162 + totals.val100 + totals.val200;
    const dsr = totalOvertime * 0.20;
    const totalOvertimeWithDsr = totalOvertime + dsr;
    
    const baseSalary = wage * workload;
    const grandTotal = baseSalary + totalOvertimeWithDsr;

    return {
      ...totals,
      totalOvertime,
      dsr,
      totalOvertimeWithDsr,
      baseSalary,
      grandTotal
    };
  }, [hourlyWage, workload, days]);

  const addDay = () => {
    const newId = Date.now().toString();
    setDays([...days, { id: newId, hours75: '', hours162: '', hours100: '', hours200: '' }]);
    setExpandedDayId(newId);
  };

  const removeDay = (id: string) => {
    if (days.length > 1) {
      setDays(days.filter(d => d.id !== id));
      if (expandedDayId === id) setExpandedDayId(days[0].id);
    }
  };

  const updateDay = (id: string, field: keyof WorkDay, value: number | '') => {
    setDays(days.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200">
              <Calculator className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              Simulação do cálculo de Horas Extras
            </h1>
          </div>
          <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <Home className="w-6 h-6 text-slate-600" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Informações */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-700">Informações</h2>
              <button 
                onClick={() => {
                  setHourlyWage('');
                  setDays([{ id: '1', hours75: '', hours162: '', hours100: '', hours200: '' }]);
                }}
                className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors"
              >
                Limpar tudo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  Salário hora (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                  <input 
                    type="number" 
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Carga horária</label>
                <select 
                  value={workload}
                  onChange={(e) => setWorkload(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value={220}>primeiro e segundo turno -220 horas</option>
                  <option value={180}>Turno Especial - 180 horas</option>
                  <option value={150}>Meio Período - 150 horas</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Dias trabalhados</h3>
                <button 
                  onClick={addDay}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
                >
                  + Adicionar dia
                </button>
              </div>
              
              <div className="space-y-4">
                {days.map((day, index) => (
                  <div key={day.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => setExpandedDayId(expandedDayId === day.id ? null : day.id)}
                    >
                      <span className="text-xs font-bold text-slate-500 uppercase">Dia {index + 1}</span>
                      <div className="flex items-center gap-2">
                        {days.length > 1 && (
                          <button onClick={(e) => { e.stopPropagation(); removeDay(day.id); }} className="text-xs text-red-500 hover:text-red-700">Remover</button>
                        )}
                        <span className="text-slate-400">{expandedDayId === day.id ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedDayId === day.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 grid grid-cols-2 gap-4 border-t border-slate-100">
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-500 uppercase">75% (5h-22h)</label>
                              <input type="number" value={day.hours75} onChange={(e) => updateDay(day.id, 'hours75', e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-500 uppercase">162,5% (22h-5h)</label>
                              <input type="number" value={day.hours162} onChange={(e) => updateDay(day.id, 'hours162', e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-500 uppercase">100% (Dom 5h-22h)</label>
                              <input type="number" value={day.hours100} onChange={(e) => updateDay(day.id, 'hours100', e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-500 uppercase">200% (Dom 22h-5h)</label>
                              <input type="number" value={day.hours200} onChange={(e) => updateDay(day.id, 'hours200', e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Right Column: Cálculo */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-bold text-blue-700">Cálculo</h2>
              <div className="h-px flex-1 bg-blue-100"></div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">De segunda a sábado</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Valor das Horas Extras 75,00%</p>
                      <p className="text-lg font-mono font-semibold text-slate-800">{formatCurrency(calculations.val75)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Valor das Horas Extras 162,50%</p>
                      <p className="text-lg font-mono font-semibold text-slate-800">{formatCurrency(calculations.val162)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Domingo e Feriados</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Valor das Horas Extras 100,00%</p>
                      <p className="text-lg font-mono font-semibold text-slate-800">{formatCurrency(calculations.val100)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Valor das Horas Extras 200,00%</p>
                      <p className="text-lg font-mono font-semibold text-slate-800">{formatCurrency(calculations.val200)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Adicional do DSR (20%)</span>
                  <span className="text-lg font-mono font-semibold text-blue-600">{formatCurrency(calculations.dsr)}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700">Total em Horas Extras + DSR</span>
                    <span className="text-xl font-mono font-bold text-slate-900">{formatCurrency(calculations.totalOvertimeWithDsr)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t-2 border-dashed border-slate-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-sm">Salário Base ({workload}h)</span>
                    <span className="font-mono">{formatCurrency(calculations.baseSalary)}</span>
                  </div>
                  <motion.div 
                    key={calculations.grandTotal}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Total Bruto Estimado</p>
                    <div className="flex justify-between items-end">
                      <p className="text-3xl font-mono font-black">{formatCurrency(calculations.grandTotal)}</p>
                      <DollarSign className="w-8 h-8 opacity-20" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <footer className="mt-8 space-y-3">
              <p className="text-[10px] text-slate-400 leading-tight italic">
                Os valores acima descritos referem-se apenas à uma simulação do cálculo das Horas Extras. 
                Estes valores serão somados ao salário mensal para compor a base de cálculo dos descontos de INSS e Imposto de Renda.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                <Clock className="w-3 h-3" />
                Lembrete: O pagamento correto depende da manutenção do ponto no sistema.
              </div>
            </footer>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
