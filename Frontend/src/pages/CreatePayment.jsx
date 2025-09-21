import { CreditCard } from 'lucide-react';
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { createPaymentService, simulatePaymentService } from '../services/transactionService';

const CreatePayment = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    school_id: '65b0e6293e9f76a9694d84b4',
    trustee_id: '',
    student_info: {
      name: '',
      id: '',
      email: ''
    },
    amount: '',
    callback_url: ''
  });
  const [result, setResult] = useState(null);
  const [useSimulation, setUseSimulation] = useState(true);
  const [simulationStep, setSimulationStep] = useState(0);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('SUCCESS');
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('student_info.')) {
      const field = name.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        student_info: {
          ...prev.student_info,
          [field]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const simulatePayment = async () => {
    setSimulationStep(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSimulationStep(2);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSimulationStep(3);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Call the backend simulation service with payment method and status
    const response = await simulatePaymentService({
      ...paymentData,
      payment_method: selectedPaymentMethod,
      payment_status: selectedPaymentStatus
    });
    setResult(response);
    setSimulationStep(0);
    setShowPaymentOptions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (useSimulation) {
      // Show payment options for simulation
      setShowPaymentOptions(true);
    } else {
      // Use real payment gateway
      setLoading(true);
      try {
        const response = await createPaymentService(paymentData);
        setResult(response);
      } catch (error) {
        console.error('Error creating payment:', error);
        alert('Error creating payment: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePaymentOptionSelect = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    setPaymentInProgress(true);
    setLoading(true);
    
    try {
      await simulatePayment();
    } catch (error) {
      console.error('Error simulating payment:', error);
      alert('Error simulating payment: ' + error.message);
    } finally {
      setLoading(false);
      setPaymentInProgress(false);
    }
  };

  if (loading) {
    const simulationMessages = [
      "Initializing payment...",
      "Processing payment details...",
      "Finalizing transaction..."
    ];
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CreditCard className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {useSimulation ? 'Simulating Payment' : 'Creating Payment'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {useSimulation && simulationStep > 0 
                ? simulationMessages[simulationStep - 1] 
                : 'Please wait...'
              }
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: useSimulation ? `${(simulationStep / 3) * 100}%` : '100%' }}
              ></div>
            </div>
            {useSimulation && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is a simulation - no real payment is being processed
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-300">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
              Create Payment
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Generate new payment requests for students</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
        {/* Payment Mode Selection */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            Payment Mode
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUseSimulation(true)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                useSimulation
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 ${
                  useSimulation ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                }`}>
                  {useSimulation && <div className="w-2 h-2 bg-white rounded-full m-1"></div>}
                </div>
                <div className="text-left">
                  <div className="font-bold">Simulation Mode</div>
                  <div className="text-sm opacity-75">Test payment without real processing</div>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUseSimulation(false)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                !useSimulation
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 ${
                  !useSimulation ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {!useSimulation && <div className="w-2 h-2 bg-white rounded-full m-1"></div>}
                </div>
                <div className="text-left">
                  <div className="font-bold">Real Payment</div>
                  <div className="text-sm opacity-75">Process actual payment</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Trustee ID
            </label>
            <input
              type="text"
              name="trustee_id"
              value={paymentData.trustee_id}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
              placeholder="Enter Trustee ID"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Student Name
            </label>
            <input
              type="text"
              name="student_info.name"
              value={paymentData.student_info.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
              placeholder="Enter Student Name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Student ID
            </label>
            <input
              type="text"
              name="student_info.id"
              value={paymentData.student_info.id}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
              placeholder="Enter Student ID"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Student Email
            </label>
            <input
              type="email"
              name="student_info.email"
              value={paymentData.student_info.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
              placeholder="Enter Student Email"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={paymentData.amount}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
              placeholder="Enter Amount"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Callback URL (Optional)
            </label>
            <input
              type="url"
              name="callback_url"
              value={paymentData.callback_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
              placeholder="Enter Callback URL"
            />
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
              useSimulation
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
            }`}
          >
            {useSimulation ? 'Simulate Payment' : 'Create Real Payment'}
          </button>
        </form>

        {/* Payment Options Modal */}
        {showPaymentOptions && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Payment Options
                  </h3>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'credit_card', name: 'Credit Card', icon: '💳' },
                      { id: 'debit_card', name: 'Debit Card', icon: '💳' },
                      { id: 'net_banking', name: 'Net Banking', icon: '🏦' },
                      { id: 'upi', name: 'UPI', icon: '📱' },
                      { id: 'wallet', name: 'Digital Wallet', icon: '👛' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedPaymentMethod === method.id
                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 ${
                            selectedPaymentMethod === method.id ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                          }`}>
                            {selectedPaymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full m-1"></div>}
                          </div>
                          <span className="text-2xl">{method.icon}</span>
                          <span className="font-semibold">{method.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Status Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Simulate Payment Status
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'SUCCESS', name: 'Success', icon: '✅', color: 'green' },
                      { id: 'PENDING', name: 'Pending', icon: '⏳', color: 'yellow' },
                      { id: 'FAILED', name: 'Failed', icon: '❌', color: 'red' }
                    ].map((status) => (
                      <button
                        key={status.id}
                        onClick={() => setSelectedPaymentStatus(status.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedPaymentStatus === status.id
                            ? `border-${status.color}-500 bg-${status.color}-50 dark:bg-${status.color}-900/20 text-${status.color}-700 dark:text-${status.color}-300`
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 ${
                            selectedPaymentStatus === status.id ? `border-${status.color}-500 bg-${status.color}-500` : 'border-gray-300'
                          }`}>
                            {selectedPaymentStatus === status.id && <div className="w-2 h-2 bg-white rounded-full m-1"></div>}
                          </div>
                          <span className="text-2xl">{status.icon}</span>
                          <span className="font-semibold">{status.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentOptions(false)}
                    className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentOptionSelect}
                    disabled={!selectedPaymentMethod || paymentInProgress}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {paymentInProgress ? 'Processing...' : 'Process Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className={`mt-8 rounded-2xl p-6 shadow-lg ${
            result.status === 'SUCCESS' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800'
              : result.status === 'PENDING'
              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800'
              : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                result.status === 'SUCCESS'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : result.status === 'PENDING'
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
                  : 'bg-gradient-to-br from-red-500 to-pink-600'
              }`}>
                <span className="text-white font-bold text-lg">
                  {result.status === 'SUCCESS' ? '✓' : result.status === 'PENDING' ? '⏳' : '✗'}
                </span>
              </div>
              <div>
                <h3 className={`text-xl font-bold ${
                  result.status === 'SUCCESS'
                    ? 'text-green-800 dark:text-green-200'
                    : result.status === 'PENDING'
                    ? 'text-yellow-800 dark:text-yellow-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {result.status === 'SUCCESS' 
                    ? (useSimulation ? 'Payment Simulated Successfully!' : 'Payment Created Successfully!')
                    : result.status === 'PENDING'
                    ? 'Payment Processing...'
                    : 'Payment Failed'
                  }
                </h3>
                {useSimulation && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    This is a simulation - no real payment was processed
                  </p>
                )}
                {result.payment_message && (
                  <p className={`text-sm font-medium ${
                    result.status === 'SUCCESS'
                      ? 'text-green-600 dark:text-green-400'
                      : result.status === 'PENDING'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {result.payment_message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Collect ID</p>
                <p className="text-lg font-mono text-gray-900 dark:text-gray-100">{result.collect_id}</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Custom Order ID</p>
                <p className="text-lg font-mono text-gray-900 dark:text-gray-100">{result.custom_order_id}</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Payment Method
                </p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded-xl shadow-lg font-medium ${
                  result.status === 'SUCCESS'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                    : result.status === 'PENDING'
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600'
                    : 'bg-gradient-to-r from-red-600 to-pink-600'
                }`}>
                  <CreditCard className="w-4 h-4" />
                  {result.payment_method || 'Credit Card (Simulated)'}
                </div>
              </div>
              
              {result.error_message && (
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm border-l-4 border-red-500">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Error Message</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{result.error_message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePayment;
