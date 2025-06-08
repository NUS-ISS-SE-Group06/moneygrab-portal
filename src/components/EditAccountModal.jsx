import React, { useState, useEffect } from "react";

const roleOptions = [
  "Money Supplier Staff",
  "Money Changer Admin",
  "Money Changer Staff"
];

export default function EditAccountModal({
  show,
  onClose,
  account,
  onSave,
  error
}) {
  const [role, setRole] = useState(account?.role || "");
  const [resetPassword, setResetPassword] = useState(false);

  useEffect(() => {
    setRole(account?.role || "");
    setResetPassword(false);
  }, [account]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-12 w-full max-w-2xl relative animate-fade-in">
        {/* Close button */}
        <button
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <h2 className="text-3xl font-bold mb-10 text-gray-900">Edit Account</h2>
        <div className="mb-10 border-b pb-10">
          <label className="block mb-3 font-semibold text-lg text-gray-800">
            <span className="text-red-500 mr-1 text-lg align-middle">*</span>
            Update Role
          </label>
          <select
            className="w-full border border-gray-200 rounded-lg p-3 text-lg bg-gray-50 focus:outline-none focus:ring focus:border-blue-400 transition"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="">Select a role</option>
            {roleOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer select-none mt-7 text-gray-700">
            <input
              type="checkbox"
              checked={resetPassword}
              onChange={e => setResetPassword(e.target.checked)}
              className="accent-indigo-500"
            />
            Reset Password
          </label>
        </div>
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-5 rounded mb-6 flex items-start gap-3">
            <span className="text-red-500 text-xl mt-1">!</span>
            <div>
              <p className="font-bold text-red-600">Error Message</p>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white px-10 py-3 rounded-lg font-semibold shadow transition text-lg"
            onClick={() => onSave({ ...account, role, resetPassword })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}