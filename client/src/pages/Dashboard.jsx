import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { IndianRupee, CreditCard, TrendingUp, PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#64748B'];

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await axios.get('/expenses');
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const categoryMap = {};
  expenses.forEach(exp => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
  });
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  if (loading) {
    return <div className="p-6 text-[var(--text-muted)]">Loading dashboard...</div>;
  }

  const statClass = "bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] transition-all duration-200 hover:border-[var(--text-muted)] flex flex-col justify-center";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">Overview</h1>
        <p className="text-[var(--text-muted)] mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[160px]">
        {/* Main Chart (Spans 8 cols, 2 rows) */}
        <div className="lg:col-span-8 md:col-span-6 col-span-1 row-span-2 bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] transition-all duration-200 hover:border-[var(--text-muted)]">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-main)] tracking-tight">Spending Flow</h3>
          </div>
          <div className="h-[240px] w-full">
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '0.75rem', padding: '12px' }}
                  />
                  <Bar dataKey="value" fill="var(--accent-color)" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)]">No data to display</div>
            )}
          </div>
        </div>

        {/* Total Expenses Stat (Spans 4 cols, 1 row) */}
        <div className={`lg:col-span-4 md:col-span-3 col-span-1 row-span-1 ${statClass}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#262626] rounded-lg">
              <IndianRupee className="w-5 h-5 text-[var(--text-main)]" />
            </div>
          </div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Total Expenses</h3>
          <p className="text-3xl font-bold text-[var(--text-main)] tracking-tight">₹{totalExpenses.toLocaleString()}</p>
        </div>

        {/* Highest Category Stat (Spans 4 cols, 1 row) */}
        <div className={`lg:col-span-4 md:col-span-3 col-span-1 row-span-1 ${statClass}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#262626] rounded-lg">
              <PieIcon className="w-5 h-5 text-[var(--text-main)]" />
            </div>
          </div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Highest Category</h3>
          <p className="text-3xl font-bold text-[var(--text-main)] tracking-tight">{categoryData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'}</p>
        </div>

        {/* Pie Chart (Spans 4 cols, 2 rows) */}
        <div className="lg:col-span-4 md:col-span-6 col-span-1 row-span-2 bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] transition-all duration-200 hover:border-[var(--text-muted)] flex flex-col">
          <h3 className="text-lg font-semibold text-[var(--text-main)] tracking-tight mb-4">Breakdown</h3>
          <div className="flex-1 w-full flex items-center justify-center min-h-[200px]">
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '0.75rem' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-[var(--text-muted)]">No data to display</div>
            )}
          </div>
        </div>

        {/* Transactions Stat (Spans 4 cols, 1 row) */}
        <div className={`lg:col-span-4 md:col-span-3 col-span-1 row-span-1 ${statClass}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#262626] rounded-lg">
              <CreditCard className="w-5 h-5 text-[var(--text-main)]" />
            </div>
          </div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Total Transactions</h3>
          <p className="text-3xl font-bold text-[var(--text-main)] tracking-tight">{expenses.length}</p>
        </div>

        {/* Avg Stat (Spans 4 cols, 1 row) */}
        <div className={`lg:col-span-4 md:col-span-3 col-span-1 row-span-1 ${statClass}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#262626] rounded-lg">
              <TrendingUp className="w-5 h-5 text-[var(--text-main)]" />
            </div>
          </div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Avg Transaction</h3>
          <p className="text-3xl font-bold text-[var(--text-main)] tracking-tight">{expenses.length ? `₹${Math.round(totalExpenses / expenses.length).toLocaleString()}` : '₹0'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
