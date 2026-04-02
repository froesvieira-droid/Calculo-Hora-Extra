/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Clock, DollarSign, Info, Home, ArrowRight } from 'lucide-react';

export default function App() {
  // Inputs
  const [hourlyWage, setHourlyWage] = useState<number>(19.50);
  const [workload, setWorkload] = useState<number>(220);
  
  // Hours worked in each category
  const [hours75, setHours75] = useState<number>(7);
  const [hours162, setHours162] = useState<number>(2);
  const [hours100, setHours100] = useState<number>(0);
  const [hours200, setHours200] = useState<number>(1);

  // Calculations
  const calculations = useMemo(() => {
    const val75 = hourlyWage * 1.75 * hours75;
    const val162 = hourlyWage * 2.625 * hours162;
    const val100 = hourlyWage * 2.00 * hours100;
    const val200 = hourlyWage * 3.00 * hours200;
    
    const totalOvertime = val75 + val162 + val100 + val200;
    const dsr = totalOvertime * 0.20;
    const totalOvertimeWithDsr = totalOvertime + dsr;
    
    const baseSalary = hourlyWage * workload;
    const grandTotal = baseSalary + totalOvertimeWithDsr;

    return {
      val75,
      val162,
      val100,
      val200,
      totalOvertime,
      dsr,
      totalOvertimeWithDsr,
      baseSalary,
      grandTotal
    };
  }, [hourlyWage, workload, hours75, hours162, hours100, hours200]);

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
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-blue-700">Informações</h2>
              <div className="h-px flex-1 bg-blue-100"></div>
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
                    onChange={(e) => setHourlyWage(Number(e.target.value))}
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

            {/* Monday to Saturday Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700 border-l-4 border-blue-500 pl-3">De segunda a sábado</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Das 5h às 22h - 75%</label>
                  <input 
                    type="number" 
                    value={hours75}
                    onChange={(e) => setHours75(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Das 22h às 5h - 162,50%</label>
                  <input 
                    type="number" 
                    value={hours162}
                    onChange={(e) => setHours162(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Sunday and Holidays Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700 border-l-4 border-orange-500 pl-3">Domingo, Feriados e Dias Compensados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Das 5h às 22h - 100,00%</label>
                  <input 
                    type="number" 
                    value={hours100}
                    onChange={(e) => setHours100(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Das 22h às 5h - 200,00%</label>
                  <input 
                    type="number" 
                    value={hours200}
                    onChange={(e) => setHours200(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  />
                </div>
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
