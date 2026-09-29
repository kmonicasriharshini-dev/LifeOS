import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  TrendingUp,
  ArrowUpRight,
  ShoppingBag,
  Sparkles,
  Info,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { PlannedPurchase } from '../types';

export const FinanceView: React.FC = () => {
  const { state, updateFinance, setActiveSection, computedMetrics } = useLifeOS();
  const { finance } = state;

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [incomeInput, setIncomeInput] = useState(finance.monthlyIncome);
  const [expensesInput, setExpensesInput] = useState(finance.monthlyExpenses);
  const [savingsGoalInput, setSavingsGoalInput] = useState(finance.savingsGoal);
  const [currentSavingsInput, setCurrentSavingsInput] = useState(finance.currentSavings);

  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
  const [purchaseName, setPurchaseName] = useState('');
  const [purchaseCost, setPurchaseCost] = useState(15000);
  const [purchaseDate, setPurchaseDate] = useState('In 3 months');

  const savingsRate = Math.round(
    ((finance.monthlyIncome - finance.monthlyExpenses) / (finance.monthlyIncome || 1)) * 100
  );

  const savingsProgress = Math.min(
    100,
    Math.round((finance.currentSavings / (finance.savingsGoal || 1)) * 100)
  );

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinance({
      monthlyIncome: incomeInput,
      monthlyExpenses: expensesInput,
      savingsGoal: savingsGoalInput,
      currentSavings: currentSavingsInput,
    });
    setIsEditingBudget(false);
  };

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseName.trim()) return;

    const newPurchase: PlannedPurchase = {
      id: 'pur-' + Date.now(),
      name: purchaseName,
      cost: purchaseCost,
      targetDate: purchaseDate,
      status: 'planning',
    };

    updateFinance({
      plannedPurchases: [...finance.plannedPurchases, newPurchase],
    });

    setShowAddPurchaseModal(false);
    setPurchaseName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#2F3142] flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FBE4D5] text-[#864F28]">
              <Wallet className="w-4.5 h-4.5" />
            </span>
            Personal Finance & Planning
          </h2>
          <p className="text-xs text-[#717387] mt-0.5">
            A simple cashflow and savings buffer planner so you can plan equipment and certifications without financial stress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E2DCED] hover:bg-[#FAF9FC] text-xs font-semibold text-[#523A73] transition cursor-pointer"
          >
            {isEditingBudget ? 'Close Editor' : 'Edit Monthly Budget'}
          </button>
          <button
            onClick={() => setShowAddPurchaseModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#523A73] hover:bg-[#432F5F] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Planned Purchase</span>
          </button>
        </div>
      </div>

      {/* Edit Budget Form if active */}
      {isEditingBudget && (
        <form
          onSubmit={handleSaveBudget}
          className="p-5 rounded-2xl bg-[#FFFBF8] border border-[#FBE4D5] shadow-xs space-y-4"
        >
          <h3 className="text-sm font-bold text-[#5F3C21]">Update Monthly Financial Baseline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#66687B]">Monthly Income ({finance.currency})</label>
              <input
                type="number"
                value={incomeInput}
                onChange={(e) => setIncomeInput(parseFloat(e.target.value) || 0)}
                className="w-full mt-1 p-2 rounded-xl border border-[#EADACF] bg-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#66687B]">Monthly Expenses ({finance.currency})</label>
              <input
                type="number"
                value={expensesInput}
                onChange={(e) => setExpensesInput(parseFloat(e.target.value) || 0)}
                className="w-full mt-1 p-2 rounded-xl border border-[#EADACF] bg-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#66687B]">Current Savings ({finance.currency})</label>
              <input
                type="number"
                value={currentSavingsInput}
                onChange={(e) => setCurrentSavingsInput(parseFloat(e.target.value) || 0)}
                className="w-full mt-1 p-2 rounded-xl border border-[#EADACF] bg-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#66687B]">Savings Target Goal ({finance.currency})</label>
              <input
                type="number"
                value={savingsGoalInput}
                onChange={(e) => setSavingsGoalInput(parseFloat(e.target.value) || 0)}
                className="w-full mt-1 p-2 rounded-xl border border-[#EADACF] bg-white text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingBudget(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl text-[#7A7C92] hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#523A73] text-white"
            >
              Save Budget
            </button>
          </div>
        </form>
      )}

      {/* Financial Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Income */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#797B90] mb-1">
            Monthly Income
          </div>
          <div className="text-xl font-bold text-[#2F3142]">
            {finance.currency}
            {finance.monthlyIncome.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#787A8E] mt-1">Stipend & campus allowance</div>
        </div>

        {/* Expenses */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#797B90] mb-1">
            Monthly Expenses
          </div>
          <div className="text-xl font-bold text-[#2F3142]">
            {finance.currency}
            {finance.monthlyExpenses.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#787A8E] mt-1">Living, books & utilities</div>
        </div>

        {/* Remaining Amount */}
        <div className="p-5 rounded-2xl bg-[#F0FAF3] border border-[#DDF3E4] shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2E6840] mb-1">
            Monthly Net Remaining
          </div>
          <div className="text-xl font-bold text-[#1E5731]">
            {finance.currency}
            {computedMetrics.remainingBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#457C57] mt-1">
            {savingsRate}% monthly savings capacity
          </div>
        </div>

        {/* Savings Goal Progress */}
        <div className="p-5 rounded-2xl bg-[#FAF6FE] border border-[#E9DDFB] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#523A73] mb-1">
            <span className="uppercase tracking-wider">Savings Goal</span>
            <span>{savingsProgress}%</span>
          </div>
          <div className="text-xl font-bold text-[#2F3142]">
            {finance.currency}
            {finance.currentSavings.toLocaleString()}{' '}
            <span className="text-xs font-normal text-[#7B7D91]">
              / {finance.currency}
              {finance.savingsGoal.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E5D7FA] overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-[#8E6EC8]"
              style={{ width: `${savingsProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Planned Purchases & Goals Section */}
      <div className="p-6 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2F3142] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C97B58]" />
              Planned Life & Tech Purchases
            </h3>
            <p className="text-xs text-[#717387]">
              LifeOS AI accounts for these purchases when evaluating your goals and savings runway.
            </p>
          </div>
          <button
            onClick={() => setActiveSection('ai_agent')}
            className="text-xs font-semibold text-[#523A73] hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8869B8]" />
            <span>Ask AI: "I want to buy a laptop in 3 months"</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {finance.plannedPurchases.map((purchase) => {
            const monthsNeeded = Math.ceil(
              purchase.cost / (computedMetrics.remainingBudget || 1)
            );
            return (
              <div
                key={purchase.id}
                className="p-4 rounded-xl border border-[#EDE8F5] bg-[#FAF9FC] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#E9E4F0] text-[#553E74]">
                      {purchase.targetDate}
                    </span>
                    <span className="text-xs font-bold text-[#2F3142]">
                      {finance.currency}
                      {purchase.cost.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#2F3142] mb-1">{purchase.name}</h4>
                  <p className="text-xs text-[#6B6D80]">
                    Achievable in ~{monthsNeeded} {monthsNeeded === 1 ? 'month' : 'months'} from net monthly savings without tapping emergency funds.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F0EBF5] flex items-center justify-between text-[11px] text-[#76788D]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#5489C7]" />
                    Target: {purchase.targetDate}
                  </span>
                  <span className="font-semibold text-[#29683E]">Budget Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Professional Advice Disclaimer (Section 6 requirement) */}
      <div className="p-3.5 rounded-xl bg-[#FAF9FC] border border-[#EFEBF4] flex items-center gap-2.5 text-xs text-[#808298]">
        <Info className="w-4 h-4 text-[#9092A5] shrink-0" />
        <span>
          <strong>Disclaimer:</strong> This is a personal planning and budgeting utility for LifeOS to help you schedule life goals. It does not provide professional financial or investment advice.
        </span>
      </div>

      {/* Add Purchase Modal */}
      {showAddPurchaseModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE8F5] shadow-xl">
            <h3 className="text-base font-bold text-[#2F3142] mb-1">Add Planned Purchase</h3>
            <p className="text-xs text-[#75778B] mb-4">
              Enter target hardware, tools, or courses you plan to purchase.
            </p>

            <form onSubmit={handleAddPurchase} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#444658]">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M3 MacBook Pro 16GB"
                  value={purchaseName}
                  onChange={(e) => setPurchaseName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Estimated Cost ({finance.currency})</label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Target Timeline</label>
                  <input
                    type="text"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F2EDF8]">
                <button
                  type="button"
                  onClick={() => setShowAddPurchaseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6A6C80] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#523A73] hover:bg-[#432F5F] text-white shadow-xs"
                >
                  Add Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
