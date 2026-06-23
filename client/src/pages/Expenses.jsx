import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Education', 'Health', 'Utilities', 'Bills', 'Investments', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', amount: '', category: CATEGORIES[0], date: new Date().toISOString().split('T')[0], note: '', paymentMethod: PAYMENT_METHODS[0]
  });

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get('/expenses');
      setExpenses(data);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/expenses', formData);
      toast.success('Expense added!');
      setIsModalOpen(false);
      setFormData({ title: '', amount: '', category: CATEGORIES[0], date: new Date().toISOString().split('T')[0], note: '', paymentMethod: PAYMENT_METHODS[0] });
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`/expenses/${id}`);
      toast.success('Expense deleted');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const filteredExpenses = expenses.filter(exp => exp.title.toLowerCase().includes(search.toLowerCase()) || exp.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Expenses</h1>
          <p className="text-[var(--text-muted)]">Manage your transactions</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" /> Add Expense
        </button>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-2">
          <Search className="w-5 h-5 text-[var(--text-muted)]" />
          <input 
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-[var(--text-main)] w-full placeholder:text-[var(--text-muted)]"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-color)] border-b border-[var(--border-color)] text-[var(--text-muted)]">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-[var(--text-muted)]">Loading expenses...</td></tr>
              ) : filteredExpenses.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-[var(--text-muted)]">No expenses found.</td></tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp._id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-color)] transition-colors">
                    <td className="px-6 py-4 text-[var(--text-main)] whitespace-nowrap">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-[var(--text-main)] font-medium">{exp.title}</td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">
                      <span className="bg-[var(--bg-color)] px-2.5 py-1 rounded-full text-xs border border-[var(--border-color)]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">{exp.paymentMethod}</td>
                    <td className="px-6 py-4 text-[var(--text-main)] font-bold text-right">₹{exp.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(exp._id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] shadow-xl w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold text-[var(--text-main)] mb-6">Add New Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" placeholder="e.g. Grocery" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Amount (₹)</label>
                <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" placeholder="0.00" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Payment Method</label>
                <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]">
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-[var(--text-muted)] hover:bg-[var(--bg-color)]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-medium bg-[var(--accent-color)] text-white hover:opacity-90">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
