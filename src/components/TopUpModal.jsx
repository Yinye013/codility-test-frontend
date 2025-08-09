import React, { useState } from "react";
import toast from "react-hot-toast";
import { purchaseAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const TopUpModal = ({
  isOpen,
  onClose,
  walletBalance,
  onTopUpSuccess,
  formatCurrency,
}) => {
  const [topUpAmount, setTopUpAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    if (!topUpAmount || parseInt(topUpAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseInt(topUpAmount) < 100) {
      toast.error("Minimum top-up amount is ₦100");
      return;
    }

    if (parseInt(topUpAmount) > 50000) {
      toast.error("Maximum top-up amount is ₦50,000");
      return;
    }

    try {
      setLoading(true);
      const response = await purchaseAPI.addFunds(parseInt(topUpAmount));

      if (response.data.success) {
        toast.success(
          `₦${parseInt(
            topUpAmount
          ).toLocaleString()} added to your wallet successfully!`
        );
        setTopUpAmount("");
        onTopUpSuccess(response.data.data.newBalance);
        onClose();
      }
    } catch (error) {
      console.error("Top-up error:", error);
      const errorMessage =
        error.response?.data?.message || "Top-up failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start sm:items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md sm:max-w-lg lg:max-w-[30rem] mx-auto mt-8 sm:mt-0 p-4 sm:p-5 border shadow-lg rounded-lg sm:rounded-md bg-white"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="mt-2 sm:mt-3">
            {/* Header - Responsive */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                Top Up Wallet
              </h3>
              <button
                onClick={() => {
                  onClose();
                  setTopUpAmount("");
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Current Balance - Responsive */}
            <div className="mb-4 sm:mb-6">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4">
                <p className="text-sm sm:text-base text-blue-800 font-medium">
                  Current balance: {formatCurrency(walletBalance || 0)}
                </p>
              </div>

              <label
                htmlFor="topUpAmount"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
              >
                Amount to add (₦)
              </label>
              <input
                type="text"
                id="topUpAmount"
                value={topUpAmount}
                onChange={(e) =>
                  setTopUpAmount(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="Enter amount"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                Minimum: ₦100 | Maximum: ₦50,000
              </p>
            </div>

            {/* Quick Top-Up Amounts - Responsive Grid */}
            <div className="mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                Quick amounts:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {[500, 1000, 2000, 5000, 10000, 20000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTopUpAmount(amount.toString())}
                    className={`px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md border transition-colors duration-200 ${
                      topUpAmount === amount.toString()
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    ₦{amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  onClose();
                  setTopUpAmount("");
                }}
                className="w-full sm:flex-1 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 px-4 py-3 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={loading || !topUpAmount}
                className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white px-4 py-3 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                    <span className="text-sm sm:text-base">Adding...</span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base">Add Funds</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TopUpModal;
