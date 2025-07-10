import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const companies = [
  "ABC Money Ltd",
  "PTY Transfer Ltd"
];

const roleOptions = [
  "Money Supplier Staff",
  "Money Changer Admin",
  "Money Changer Staff"
];

export default function CreateAccountModal({ show, onClose, onSave, error }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  // Reset fields when modal opens
  useEffect(() => {
    if (show) {
      setEmail("");
      setCompany("");
      setRole("");
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 p-10 w-full max-w-xl relative animate-fade-in">
        {/* Close button */}
        <button
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Create Account</h2>
        <div className="mb-8 border-b pb-8">
          <label className="block mb-2 font-semibold text-gray-800">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Provide e-mail Address"
            className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <select
            className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
            value={company}
            onChange={e => setCompany(e.target.value)}
          >
            <option value="">Select the Company / Money Changer</option>
            {companies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="w-full border rounded-lg p-3 text-base bg-gray-50"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {roleOptions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded mb-4 flex items-start gap-2">
            <span className="text-red-500 text-xl mt-1">!</span>
            <div>
              <p className="font-bold text-red-600">Error Message</p>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2 rounded-lg font-semibold"
            onClick={() =>
              onSave({ email, company, role })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

CreateAccountModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  error: PropTypes.string
};