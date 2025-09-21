import  { useState } from "react";
import axios from "axios"; 
import { Base_url } from "../constants";
import { ErrorMessage, LoadingDots } from "../utils/Loding";

const TransactionStatusCheck = () => {
  const [customOrderId, setCustomOrderId] = useState("");
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const handleCheckStatus = async () => {
    setLoading(true);
    setError(null);
    setTransactionData(null);

    try {
      const response = await axios.get(
        `${Base_url}/api/transactions/status/${customOrderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTransactionData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }; 

   if (loading) {
      return (
          <LoadingDots message="Loading transaction data..." />
      );
    } 
    

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-[#2869aa]">Transaction Status</h2>
          <p className="text-slate-500 mt-2">Check the status of your transaction by entering the order ID below</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Custom Order ID :  Example - test1"
              value={customOrderId}
              onChange={(e) => setCustomOrderId(e.target.value)}
              className="flex-1  px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <button
              onClick={handleCheckStatus}
              disabled={!customOrderId || loading}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
              <ErrorMessage error = {error}/>
            </div>
          )}

          {transactionData && (
            <div className="mt-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p className="text-xl font-medium text-slate-800">{transactionData.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Amount</p>
                      <p className="text-xl font-medium text-slate-800">{transactionData.transaction_amount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Collect ID</p>
                    <p className="text-slate-800">{transactionData.collect_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">School ID</p>
                    <p className="text-slate-800">{transactionData.school_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Gateway</p>
                    <p className="text-slate-800">{transactionData.gateway}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Order Amount</p>
                    <p className="text-slate-800">{transactionData.order_amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Custom Order ID</p>
                    <p className="text-slate-800">{transactionData.custom_order_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Payment Method</p>
                    <p className="text-slate-800">{transactionData.payment_method}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatusCheck;