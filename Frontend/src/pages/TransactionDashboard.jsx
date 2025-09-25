import {
    Activity,
    FileText,
    DollarSign,
    TrendingUp,
    Calculator,
    CreditCard,
    PieChart as PieChartIcon,
    Clock
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import TransactionTable from '../components/TransactionTable';
import { Base_url } from '../constants';
import { ErrorMessage, LoadingDots } from "../utils/Loding";

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    collectId: '',
    gateway: '',
    schoolId: '',
    customOrderId: '',
    status: '',
    amount: ''
  }); 
  const token = localStorage.getItem('token');

  const fetchTransactions = async (endpoint = '/transactions') => {
    setLoading(true);
    try {
      const response = await fetch(`${Base_url}/api${endpoint}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      // setTransactions(data);
      setTransactions(Array.isArray(data) ? data : data.transactions || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleSearch = () => {
    if (filters.schoolId) {
      fetchTransactions(`/transactions/${filters.schoolId}`);
      return;
    }
    if (filters.gateway) {
      fetchTransactions(`/transactions/gateway/${filters.gateway.toUpperCase()}`);
      return;
    }
    if (filters.status) {
      fetchTransactions(`/transactions?status=${filters.status}`);
      return;
    }
    fetchTransactions();
  };

  const handleClearFilters = () => {
    setFilters({
      collectId: '',
      gateway: '',
      schoolId: '',
      customOrderId: '',
      status: '',
      amount: ''
    });
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(() => fetchTransactions(), 60000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const paymentMethodData = React.useMemo(() => {
    const distribution = {};
    transactions.forEach(tx => {
      distribution[tx.payment_method] = (distribution[tx.payment_method] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [transactions]);

 
  const statusData = React.useMemo(() => {
    const distribution = {};
    transactions.forEach(tx => {
      distribution[tx.status] = (distribution[tx.status] || 0) + 1;
    });
    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count
    }));
  }, [transactions]);

  if (loading) {
    return (
        <LoadingDots message="Loading transaction data..." />
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="min-h-screen transition-all duration-300"> 
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Transactions Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Real-time analytics and insights</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Quick Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">School ID</label>
          <input
            type="text"
            value={filters.schoolId}
            onChange={(e) => handleFilterChange('schoolId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter School ID"
          />
        </div>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gateway</label>
          <input
            type="text"
            value={filters.gateway}
            onChange={(e) => handleFilterChange('gateway', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter Gateway"
          />
        </div>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 active:scale-95 font-medium shadow-sm"
          >
            Clear Filters
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95 font-medium shadow-lg"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Transactions</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{transactions.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Amount</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                ₹{transactions.reduce((sum, tx) => sum + (tx.transaction_amount || tx.order_amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Success Rate</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {((statusData.find(s => s.status === 'SUCCESS')?.count || 0) / transactions.length * 100).toFixed(1)}%
          </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Average Amount</h3>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                ₹{(transactions.reduce((sum, tx) => sum + (tx.transaction_amount || tx.order_amount || 0), 0) / transactions.length || 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            Payment Methods
          </h3>
          <PieChart width={400} height={300}>
            <Pie
              data={paymentMethodData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentMethodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <PieChartIcon className="w-4 h-4 text-white" />
            </div>
            Transaction Status
          </h3>
          <BarChart width={400} height={300} data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 overflow-x-auto min-w-full">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          Recent Transactions
        </h3>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
};

export default TransactionDashboard; 
