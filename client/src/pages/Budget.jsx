import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchData = async () => {
    try {
      const [budgetRes, expensesRes] = await Promise.all([
        axios.get(`/budgets?month=${currentMonth}&year=${currentYear}`),
        axios.get('/expenses')
      ]);
      setBudget(budgetRes.data);
      if (budgetRes.data) setAmount(budgetRes.data.amount);
      
      const currentMonthExpenses = expensesRes.data.filter(exp => {
        const d = new Date(exp.date);
        return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
      });
      setExpenses(currentMonthExpenses);
    } catch (error) {
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/budgets', {
        amount: Number(amount),
        month: currentMonth,
        year: currentYear
      });
      toast.success('Budget saved successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to save budget');
    }
  };

  const spent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetAmount = budget?.amount || 0;
  const percentage = budgetAmount > 0 ? Math.min(Math.round((spent / budgetAmount) * 100), 100) : 0;
  const remaining = budgetAmount - spent;

  const data = [
    { name: 'Spent', value: spent },
    { name: 'Remaining', value: remaining > 0 ? remaining : 0 }
  ];
  const COLORS = ['#EF4444', '#10B981']; 

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Budget Management</h1>
        <p className="text-[var(--text-muted)]">Track your monthly spending limits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4">Set Monthly Budget</h2>
          <form onSubmit={handleSaveBudget} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Budget Amount (₹)</label>
              <input 
                type="number" 
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                placeholder="Enter your budget limit"
              />
            </div>
            <button type="submit" className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90">
              Save Budget
            </button>
          </form>

          {budget && (
            <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-[var(--text-muted)] mb-2 font-medium">Budget Status ({new Date().toLocaleString('default', { month: 'long' })})</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--text-main)] font-bold">₹{spent.toLocaleString()} / ₹{budgetAmount.toLocaleString()}</span>
                <span className="text-sm font-medium text-[var(--text-muted)]">{percentage}% Used</span>
              </div>
              <div className="w-full bg-[var(--bg-color)] rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className={`mt-3 text-sm ${remaining < 0 ? 'text-red-500 font-bold' : 'text-[var(--text-muted)]'}`}>
                {remaining < 0 ? `Over budget by ₹${Math.abs(remaining).toLocaleString()}` : `₹${remaining.toLocaleString()} remaining this month`}
              </p>
            </div>
          )}
        </div>

        {budget && budgetAmount > 0 && (
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4 self-start">Visual Progress</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-[var(--text-muted)]">Spent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-[var(--text-muted)]">Remaining</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
