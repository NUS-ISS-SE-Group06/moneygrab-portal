import React, { useState } from "react";
import EditAccountModal from "./components/EditAccountModal";
import CreateAccountModal from "./components/CreateAccountModal";

const accountsInit = [
  {
    id: "01",
    company: "Moola",
    role: "Money Supply Staff",
    email: "Standard@gmail.com"
  },
  {
    id: "02",
    company: "Grab Money Pvt Ltd.",
    role: "Money Changer Admin",
    email: "Standard@gmail.com"
  },
  {
    id: "03",
    company: "Capital Pvt Ltd.",
    role: "Money Changer Admin",
    email: "VIP1@gmail.com"
  }
];

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState(accountsInit);

  // Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [modalError, setModalError] = useState("");

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState("");

  // Add new account (show create modal)
  const handleAdd = () => {
    setShowCreateModal(true);
    setCreateError("");
  };

  // Show edit modal
  const handleEdit = account => {
    setEditingAccount(account);
    setModalError("");
    setShowModal(true);
  };

  // Edit modal save handler
  const handleEditSave = updatedAccount => {
    if (!updatedAccount.role) {
      setModalError("Please select a role.");
      return;
    }
    setAccounts(accs =>
      accs.map(acc =>
        acc.id === updatedAccount.id ? updatedAccount : acc
      )
    );
    setShowModal(false);
  };

  // Create modal save handler
  const handleCreateSave = ({ email, company, role }) => {
    // Simple validation
    if (!email || !company || !role) {
      setCreateError("Please fill in all fields.");
      return;
    }
    if (accounts.some(acc => acc.email === email)) {
      setCreateError("Unable to create account, Email is already in use or invalid.");
      return;
    }
    setAccounts(accs => [
      ...accs,
      {
        id: (accs.length + 1).toString().padStart(2, "0"),
        company,
        role,
        email
      }
    ]);
    setShowCreateModal(false);
  };

  // (Optional) Delete account
  const handleDelete = id => {
    setAccounts(accs => accs.filter(acc => acc.id !== id));
  };

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">MANAGE ACCOUNTS</h1>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium">
            + Add
          </button>
        </div>
        {/* Error Message */}
        <div className="mb-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
            <p className="font-bold">Error Message</p>
            <p>Unable to create account, Email is already in use or invalid</p>
          </div>
        </div>
        {/* Accounts Table */}
        <div className="bg-white shadow rounded">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4">Id</th>
                  <th className="py-2 px-4">Company</th>
                  <th className="py-2 px-4">Role</th>
                  <th className="py-2 px-4">Email Address</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id} className="border-b last:border-b-0">
                    <td className="py-2 px-4">{acc.id}</td>
                    <td className="py-2 px-4">{acc.company}</td>
                    <td className="py-2 px-4">{acc.role}</td>
                    <td className="py-2 px-4">{acc.email}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded">
                        Edit
                      </button>
                      <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
=======
    <div>
      {/* Title and Add Button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">MANAGE ACCOUNTS</h1>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          onClick={handleAdd}
        >
          + Add
        </button>
      </div>
      <div className="bg-white shadow rounded">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4">Id</th>
              <th className="py-2 px-4">Company</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Email Address</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id} className="border-b last:border-b-0">
                <td className="py-2 px-4">{acc.id}</td>
                <td className="py-2 px-4">{acc.company}</td>
                <td className="py-2 px-4">{acc.role}</td>
                <td className="py-2 px-4">{acc.email}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(acc)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(acc.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Edit Modal */}
      <EditAccountModal
        show={showModal}
        onClose={() => setShowModal(false)}
        account={editingAccount}
        onSave={handleEditSave}
        error={modalError}
      />
      {/* Create Modal */}
      <CreateAccountModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateSave}
        error={createError}
      />
>>>>>>> 1d7c1dc (Describe your changes here)
    </div>
  );
}