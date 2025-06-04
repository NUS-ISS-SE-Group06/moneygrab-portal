import React, { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";

export default function ManageAccounts() {
  // State for accounts and loading
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("Account");

  // Placeholder API call
  useEffect(() => {
    // Simulate API call (replace with real fetch later)
    setTimeout(() => {
      setAccounts([
        {
          id: "01",
          company: "Moola",
          role: "Money Supply Staff",
          email: "Standard@gmail.com",
        },
        {
          id: "02",
          company: "Grab Money Pvt Ltd.",
          role: "Money Changer Admin",
          email: "Standard@gmail.com",
        },
        {
          id: "03",
          company: "Capital Pvt Ltd.",
          role: "Money Changer Admin",
          email: "VIP1@gmail.com",
        },
      ]);
      setLoading(false);
    }, 1000);
    // In real use:
    // fetch('/api/accounts')
    //   .then(res => res.json())
    //   .then(data => { setAccounts(data); setLoading(false); })
    //   .catch(err => { setError("API Error"); setLoading(false); });
  }, []);

  return (
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
    </div>
  );
}
