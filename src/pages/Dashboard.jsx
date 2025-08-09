import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { purchaseAPI } from "../services/api";
import TopUpModal from "../components/TopUpModal";

const Dashboard = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await purchaseAPI.getWallet();
      setWalletData(response.data.data);

      updateUser({
        wallet: {
          ...user.wallet,
          balance: response.data.data.balance,
        },
      });
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type) => {
    return type === "credit" ? (
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
    ) : (
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 12H4"
          />
        </svg>
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTopUpSuccess = (newBalance) => {
    setWalletData((prev) => ({
      ...prev,
      balance: newBalance,
    }));

    updateUser({
      wallet: {
        ...user.wallet,
        balance: newBalance,
      },
    });

    // Refresh wallet data to get updated statistics
    fetchWalletData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">
                Welcome back, {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="logout-btn w-full sm:w-auto !bg-red-600 hover:!bg-red-700 active:!bg-red-800 text-white px-4 py-2 sm:py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Wallet Balance Card - Responsive */}
          <div className="bg-blue-500 rounded-lg shadow-lg p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className="text-blue-100 text-sm font-medium">
                  Wallet Balance
                </p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {formatCurrency(walletData?.balance || 0)}
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-blue-200 mx-auto sm:mx-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <Link
                to="/purchase"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40 text-white px-3 sm:px-4 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Buy Airtime
              </Link>
              <button
                onClick={() => setShowTopUpModal(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40 text-white px-3 sm:px-4 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Top Up
              </button>
              <button
                onClick={fetchWalletData}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40 text-white px-3 sm:px-4 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0"></div>
                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      Total Received
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                      {formatCurrency(
                        walletData?.statistics?.totalReceived || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0"></div>
                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      Total Spent
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                      {formatCurrency(walletData?.statistics?.totalSpent || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Transactions */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0"></div>
                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      Total Transactions
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                      {walletData?.statistics?.totalTransactions || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                      Recent Transactions
                    </h3>
                    <Link
                      to="/transactions"
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium text-center sm:text-left"
                    >
                      View all
                    </Link>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {walletData?.recentTransactions?.length > 0 ? (
                    walletData.recentTransactions.map((transaction, index) => (
                      <div key={index} className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between space-x-3">
                          <div className="flex items-center min-w-0 flex-1">
                            {getTransactionIcon(transaction.type)}
                            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {transaction.description}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p
                              className={`text-sm font-medium ${
                                transaction.type === "credit"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "credit" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Balance:{" "}
                              {formatCurrency(transaction.balanceAfter)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
                      <svg
                        className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No transactions yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by purchasing some airtime!
                      </p>
                      <div className="mt-4 sm:mt-6">
                        <Link to="/purchase" className="btn-primary">
                          Buy Airtime
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        walletBalance={walletData?.balance}
        onTopUpSuccess={handleTopUpSuccess}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default Dashboard;
