import { useState, useEffect } from "react";
import axios from "axios"; 
import {ChevronRight,ChevronLeft,Search } from "lucide-react"
import TransactionTable from "../components/TransactionTable"; 
import { Base_url } from "../constants";
import { ErrorMessage, LoadingDots } from "../utils/Loding";

const SchoolTransactionsPage = () => {
  const [schoolId, setSchoolId] = useState(""); 
  const [transactions, setTransactions] = useState([]); 
  const [allTransactions, setAllTransactions] = useState([]);
  const [schools, setSchools] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 8; 

  const fetchAllTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${Base_url}/api/transactions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setAllTransactions(data);

      const uniqueSchools = [...new Set(data.map((transaction) => transaction.school_id))];
      setSchools(uniqueSchools);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error);
      throw new Error;
    } finally {
      setLoading(false);
    };
  } ;

  useEffect(() => {
    let filteredTransactions = allTransactions;

    if (schoolId) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => transaction.school_id === schoolId
      );
    }

    if (searchTerm) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        transaction.collect_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTransactions(filteredTransactions);
    setCurrentPage(1); 
  }, [schoolId, searchTerm, allTransactions]);

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage); 
 if (loading) {
    return (
        <LoadingDots message="Loading transaction data..." />
    );
  } 
  if(error) {
    return <ErrorMessage error = {error} />;
  }
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
      <div className="max-w-8xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#2869aa]">School Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage school-wise transaction details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <label className="text-sm font-medium text-gray-700">School</label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 outline-none shadow-sm py-2 pl-3 pr-10 text-sm"
            >
              <option value="">All Schools</option>
              {schools.map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md  pl-10 text-sm p-2 border-2 outline-none border-gray-300 focus:ring-2 focus:ring-gray-400 "
                placeholder="Search by collect ID"
              />
            </div>
          </div>
        </div>

          <div className="w-full shadow-xl rounded-lg overflow-hidden ">
            <TransactionTable transactions={currentTransactions}/>
          </div>

          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(page => page - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(page => page + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstTransaction + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastTransaction, transactions.length)}
                  </span>{" "}
                  of <span className="font-medium">{transactions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(page => page - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(page => page + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default SchoolTransactionsPage;
