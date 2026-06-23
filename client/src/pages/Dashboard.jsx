import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, IndianRupee, CreditCard, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Compute stats
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Group by category for Pie Chart
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Dashboard</h1>
          <p className="text-[var(--text-muted)]">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}`, icon: IndianRupee, trend: '+12%', isUp: false },
          { title: 'Transactions', value: expenses.length, icon: CreditCard, trend: '+5%', isUp: true },
          { title: 'Highest Category', value: categoryData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A', icon: PieIcon, trend: '', isUp: true },
          { title: 'Avg per Transaction', value: expenses.length ? `₹${Math.round(totalExpenses / expenses.length).toLocaleString()}` : '₹0', icon: TrendingUp, trend: '-2%', isUp: true },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-[var(--card-bg)] p-5 rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              {stat.trend && (
                <div className={`flex items-center text-sm font-medium ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                  {stat.isUp ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                </div>
              )}
            </div>
            <h3 className="text-[var(--text-muted)] text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-[var(--text-main)] mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--text-main)] mb-6">Spending Overview</h3>
          <div className="h-72 w-full">
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '0.5rem' }}
                  />
                  <Bar dataKey="value" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)]">No data to display</div>
            )}
          </div>
        </div>

        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--text-main)] mb-6">Category Breakdown</h3>
          <div className="h-72 w-full flex items-center justify-center">
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '0.5rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-[var(--text-muted)]">No data to display</div>
            )}
          </div>
          {expenses.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-xs text-[var(--text-muted)]">
                  <span className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
