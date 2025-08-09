import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { purchaseAPI } from "../services/api";

const Purchase = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    amount: "",
    network: "",
  });
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const networks = [
    { value: "MTN", label: "MTN" },
    { value: "Airtel", label: "Airtel" },
    { value: "Glo", label: "Glo" },
    { value: "9mobile", label: "9mobile" },
  ];

  const quickAmounts = [50, 100, 200, 500, 1000, 2000];

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      setLoading(true);
      const response = await purchaseAPI.getWallet();
      setWalletBalance(response.data.data.balance);
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      toast.error("Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else if (name === "phoneNumber") {
      const phoneValue = value.replace(/[^0-9+\-\(\)\s]/g, "");
      setFormData({
        ...formData,
        [name]: phoneValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleQuickAmount = (amount) => {
    setFormData({
      ...formData,
      amount: amount.toString(),
    });
  };

  const validateForm = () => {
    const { phoneNumber, amount, network } = formData;

    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number");
      return false;
    }

    if (!amount || parseInt(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }

    if (!network) {
      toast.error("Please select a network");
      return false;
    }

    const amountValue = parseInt(amount);
    if (amountValue > walletBalance) {
      toast.error(
        `Insufficient balance. Current balance: ₦${walletBalance.toLocaleString()}`
      );
      return false;
    }

    if (amountValue < 50) {
      toast.error("Minimum purchase amount is ₦50");
      return false;
    }

    if (amountValue > 10000) {
      toast.error("Maximum purchase amount is ₦10,000");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const purchaseData = {
        phoneNumber: formData.phoneNumber.trim(),
        amount: parseInt(formData.amount),
        network: formData.network,
      };

      const response = await purchaseAPI.purchaseAirtime(purchaseData);

      if (response.data.success) {
        updateUser({
          wallet: {
            ...user.wallet,
            balance: response.data.data.newBalance,
          },
        });

        setWalletBalance(response.data.data.newBalance);

        toast.success(
          `Airtime purchase successful! ₦${purchaseData.amount} sent to ${purchaseData.phoneNumber}`,
          { duration: 5000 }
        );

        setFormData({
          phoneNumber: "",
          amount: "",
          network: "",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      const errorMessage =
        error.response?.data?.message || "Purchase failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-500 active:text-blue-700 flex items-center justify-center sm:justify-start"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm sm:text-base">Go back</span>
              </Link>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Purchase Airtime
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Buy airtime for any network
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto !bg-red-600 hover:!bg-red-700 active:!bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 lg:space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="08012345678"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                      Enter the phone number to receive airtime
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="network"
                      className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
                    >
                      Network Provider
                    </label>
                    <select
                      id="network"
                      name="network"
                      value={formData.network}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Network</option>
                      {networks.map((network) => (
                        <option key={network.value} value={network.value}>
                          {network.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
                    >
                      Amount (₦)
                    </label>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />

                    <div className="mt-3 sm:mt-4">
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        Quick amounts:
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {quickAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handleQuickAmount(amount)}
                            className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md border transition-colors duration-200 ${
                              formData.amount === amount.toString()
                                ? "bg-blue-100 border-blue-500 text-blue-700"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                            }`}
                          >
                            ₦{amount}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      Minimum: ₦50 | Maximum: ₦10,000
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-medium py-3 sm:py-4 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
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
                        Purchase Airtime
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1 order-1 lg:order-2 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start space-x-4 sm:space-x-0">
                  <div className="flex-1 sm:w-full">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">
                      Wallet Balance
                    </h3>
                    <div className="text-left sm:text-center">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                        {formatCurrency(walletBalance)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={fetchWalletBalance}
                    className="flex-shrink-0 sm:w-full sm:mt-3 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-600 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-medium text-blue-900 mb-3">
                  How it works
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-blue-800">
                  <li className="flex items-start">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 sm:mt-1 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Enter the recipient's phone number</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 sm:mt-1 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Select their network provider</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 sm:mt-1 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Choose or enter the amount</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 sm:mt-1 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Confirm and complete purchase</span>
                  </li>
                </ul>

                <div className="mt-3 sm:mt-4 p-3 bg-blue-100 rounded-md">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Note:</strong> Airtime will be delivered instantly
                    upon successful payment. Make sure the phone number and
                    network are correct.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Purchase;
