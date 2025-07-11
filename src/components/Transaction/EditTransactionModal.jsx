import React, { useState } from "react";
import PropTypes from "prop-types";

const EditTransactionModal = ({ transaction, onClose, onSave, userId }) => {

  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setValidationError("");
    setError(null);
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
    setValidationError("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (status === "Cancelled" && comments.trim() === "") {
      setValidationError("Comments are mandatory for Cancelled Status");
      return;
    }

    try {
      // Call parent save handler
      await onSave({ id: transaction.id, status, comments,userId });
      onClose();
    } catch (err) {
      setError("Unable to update status");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">Edit Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl">
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Date</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
              value={new Date(transaction.transactionDate).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric"
              })}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Current Status</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
              value={transaction.currentStatus}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Customer Name</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
              value={transaction.customerName || "-"}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Currency</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
              value={`${transaction.foreignAmount} SGD to ${transaction.sgdAmount} MYR`}
              disabled
            />
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="mb-4">
          <label htmlFor="statusSelect" className="block text-sm font-medium text-gray-600">Select Status</label>
          <select id="statusSelect"
            className="mt-1 w-full border rounded px-3 py-2"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="">Select Status</option>
            <option value="Paid">Paid</option>
            <option value="Collected">Collected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Comments */}
        <div className="mb-4">
          <label htmlFor="commentsField" className="block text-sm font-medium text-gray-600">Comments</label>
          <textarea id="commentsField"
            className={`mt-1 w-full border rounded px-3 py-2 ${
              validationError ? "border-red-500" : ""
            }`}
            rows={3}
            value={comments}
            onChange={handleCommentsChange}
            placeholder="Comments are mandatory for Cancelled Status"
          />
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            ⚠️ {validationError}
          </div>
        )}

        {/* API Error */}
        {error && (
          <div className="bg-yellow-100 text-red-700 p-3 rounded mb-4">
            ❗ <strong>Error Message</strong><br />
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSubmit}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

EditTransactionModal.propTypes = {
  transaction: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default EditTransactionModal;
