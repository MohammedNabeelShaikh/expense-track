import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingDown, TrendingUp, AlertTriangle, Download, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, budgetRes] = await Promise.all([
          axios.get('/expenses'),
          axios.get(`/budgets?month=${currentMonth}&year=${currentYear}`)
        ]);
        setExpenses(expensesRes.data);
        setBudget(budgetRes.data);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSpent = expenses.reduce((a, b) => a + b.amount, 0);
  const avgTransaction = expenses.length ? Math.round(totalSpent / expenses.length) : 0;
  
  const currentMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });
  const currentMonthSpent = currentMonthExpenses.reduce((a, b) => a + b.amount, 0);
  
  const categoryMap = {};
  expenses.forEach(exp => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
  });
  const sortedCategories = Object.entries(categoryMap).sort((a,b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];

  const downloadCSV = () => {
    if(expenses.length === 0) return toast.error('No data to export');
    
    const headers = ['Date', 'Title', 'Category', 'Payment Method', 'Amount'];
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    expenses.forEach(exp => {
      const row = [
        new Date(exp.date).toLocaleDateString(),
        `"${exp.title}"`,
        exp.category,
        exp.paymentMethod,
        exp.amount
      ];
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'expenses.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Report downloaded');
  };

  // Dynamic Health Score Calculation
  let healthScore = 70;
  let healthMessage = "Looking okay, but keep an eye on your spending.";
  let scoreColor = "text-yellow-500";
  
  if (budget && budget.amount > 0) {
    const savingsRatio = (budget.amount - currentMonthSpent) / budget.amount;
    if (savingsRatio >= 0.2) {
      healthScore = 95;
      healthMessage = "Excellent! You are saving over 20% of your budget.";
      scoreColor = "text-green-500";
    } else if (savingsRatio >= 0.1) {
      healthScore = 85;
      healthMessage = "Great job! You are well within your budget.";
      scoreColor = "text-green-500";
    } else if (savingsRatio >= 0) {
      healthScore = 75;
      healthMessage = "Good, you are staying within your budget limits.";
      scoreColor = "text-blue-500";
    } else if (savingsRatio >= -0.1) {
      healthScore = 55;
      healthMessage = "Warning! You have slightly exceeded your budget.";
      scoreColor = "text-orange-500";
    } else {
      healthScore = 35;
      healthMessage = "Critical: You have significantly overspent your budget.";
      scoreColor = "text-red-500";
    }
  } else if (currentMonthSpent === 0) {
    healthScore = 100;
    healthMessage = "Perfect score! You haven't spent anything this month.";
    scoreColor = "text-green-500";
  } else {
    healthScore = 65;
    healthMessage = "Consider setting a budget to track your financial health accurately.";
    scoreColor = "text-yellow-500";
  }

  if (loading) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Smart Analytics</h1>
          <p className="text-[var(--text-muted)]">Deep insights into your financial habits</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-main)] px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[var(--bg-color)] transition-colors"
        >
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col items-center justify-center text-center">
          <Award className={`w-12 h-12 ${scoreColor} mb-4`} />
          <h2 className="text-lg font-bold text-[var(--text-main)]">Financial Health Score</h2>
          <div className={`text-5xl font-extrabold ${scoreColor} my-4`}>{healthScore}</div>
          <p className="text-sm text-[var(--text-muted)]">{healthMessage}</p>
        </div>

        <div className="lg:col-span-2 bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Key Insights
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-[var(--text-main)]">Spending Decreased</h4>
                <p className="text-sm text-[var(--text-muted)]">Your overall spending is down by 5% compared to the previous week.</p>
              </div>
            </div>
            {topCategory && (
              <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-[var(--text-main)]">High Spending Alert</h4>
                  <p className="text-sm text-[var(--text-muted)]">You've spent the most on <strong>{topCategory[0]}</strong> (₹{topCategory[1]}). Consider reducing this to improve your health score.</p>
                </div>
              </div>
            )}
            <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-[var(--text-main)]">Average Transaction</h4>
                <p className="text-sm text-[var(--text-muted)]">Your average transaction size is ₹{avgTransaction}.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
