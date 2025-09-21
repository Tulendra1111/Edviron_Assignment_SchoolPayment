import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import { ThemeProvider } from './context/ThemeContext';
import CreatePayment from "./pages/CreatePayment";
import LoginPage from "./pages/Login";
import SchoolTransactionsPage from './pages/SchoolTransactionsPage';
import SignupPage from './pages/signup';
import TransactionDashboard from "./pages/TransactionDashboard";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionStatusCheck from "./pages/TransactionStatusCheck";

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  const mainClassName = isAuthPage 
    ? "flex-1" 
    : "flex-1 pt-[90px] ml-64 p-6 overflow-auto";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {!isAuthPage && <Navbar />}
      <div className="flex">
        {!isAuthPage && (
          <Sidebar className="flex-shrink-0 w-64" />
        )}
        <main className={`${mainClassName} transition-all duration-300`}>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route element={<AuthGuard />}>
                <Route path="/dashboard" element={<TransactionDashboard />} />
                <Route path="/transaction" element={<TransactionsPage />} />
                <Route path="/school-transactions" element={<SchoolTransactionsPage />} />
                <Route path="/transaction-status-check" element={<TransactionStatusCheck />} />
                <Route path="/create-payment" element={<CreatePayment />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
};

export default App;