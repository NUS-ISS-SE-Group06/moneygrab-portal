import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import EditTransactionModal from "./EditTransactionModal"; // make sure this path is correct

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [userId, setUserId] = useState(null);

useEffect(() => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id) {
      setUserId(storedUser.id);
    } else {
      setUserId(1); // fallback if storedUser or id is not present
    }
  } catch (err) {
    console.warn("Failed to parse user from localStorage", err);
    setUserId(1); // fallback if JSON parse fails
  }
}, []);


  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/v1/transactions");
      if (!response.data) {
        throw new Error("No data received from API");
      }
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch transactions: ${err.message}`);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refreshTrigger]);

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleUpdateTransaction = async ({ id, status, comments,userId }) => {
    try {
     await api.patch(`/api/v1/transactions/${id}/status`, 
  JSON.stringify({ status, comments, userId }),
  {
    headers: { "Content-Type": "application/json" }
  }
);
      setShowModal(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to update status", err);
      throw err; // Let the modal show the error
    }
  };

  const dismissBanner = () => {
    setError(null);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading transactions...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-yellow-100 text-red-700 p-4 mb-4 flex justify-between items-center rounded">
          <span>{error}</span>
          <button
            onClick={dismissBanner}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Transaction List</h2>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Customer ID</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Foreign Amt</th>
            <th className="p-2 text-left">SGD Amt</th>
            <th className="p-2 text-left">Money Changer ID</th>
            <th className="p-2 text-left">Currency ID</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className="border-t">
              <td className="p-2">{txn.id}</td>
              <td className="p-2">{txn.customerId}</td>
              <td className="p-2">{txn.currentStatus}</td>
              <td className="p-2">{txn.email}</td>
              <td className="p-2">{txn.foreignAmount}</td>
              <td className="p-2">{txn.sgdAmount}</td>
              <td className="p-2">{txn.moneyChangerId}</td>
              <td className="p-2">{txn.currencyId}</td>
              <td className="p-2">
                {new Date(txn.transactionDate).toLocaleString()}
              </td>
              <td className="p-2">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                  onClick={() => handleEditClick(txn)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          userId={userId}
          onClose={() => setShowModal(false)}
          onSave={handleUpdateTransaction}
        />
      )}
    </div>
  );
};

export default TransactionList;
