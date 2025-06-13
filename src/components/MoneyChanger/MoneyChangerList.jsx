import React, { useState } from "react";
import CreateMoneyChangerModal from "./CreateMoneyChangerModal";
import EditMoneyChangerModal from "./EditMoneyChangerModal";

// Initial data
const initialData = [
  {
    id: "01",
    accountNo: "12345",
    company: "ABC Pvt Ltd",
    uen: "202456780M",
    date: "23 Mar 2024",
    schema: "Scheme-01",
    country: "Singapore",
  },
];

export default function MoneyChangerList() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [error, setError] = useState("");
  const [rows, setRows] = useState(initialData); // State to manage rows

  const handleSaveAccount = (data) => {
    console.log("handleSaveAccount called with data:", data);
    // Simple validation
    if (!data.email || !data.companyName) { // Changed from data.company to data.companyName
      setError("Please fill all fields.");
      console.log("Validation failed, error set:", error);
      return;
    }
    setError("");

    // Generate a new ID and add the new record
    const newId = String(rows.length + 1).padStart(2, "0");
    const newRow = {
      id: newId,
      accountNo: "00000", // Default or generate as needed
      company: data.companyName, // Use companyName from form
      uen: data.uen || "NEWUEN",
      date: data.date || new Date().toLocaleDateString(),
      schema: data.schema,
      country: data.country,
    };

    const updatedRows = [...rows, newRow];
    console.log("Updated rows:", updatedRows);
    setRows(updatedRows); // Update state with new record
    console.log("Rows state after update:", rows); // Note: Logs old state due to async
    setShowCreate(false); // Close modal
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">MANAGE MONEY CHANGER</h2>
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded"
          onClick={() => setShowCreate(true)}
        >
          + Create New Money Changer
        </button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th>Id</th>
            <th>Account No</th>
            <th>Company Name</th>
            <th>UEN No</th>
            <th>Date of Incorporation</th>
            <th>Schema</th>
            <th>Country</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.accountNo}</td>
              <td>{row.company}</td>
              <td>{row.uen}</td>
              <td>{row.date}</td>
              <td>{row.schema}</td>
              <td>{row.country}</td>
              <td>
                <button
                  className="bg-indigo-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => {
                    setSelectedRow(row);
                    setShowEdit(true);
                  }}
                >
                  Edit
                </button>
                <button className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreate && (
        <CreateMoneyChangerModal onClose={() => setShowCreate(false)} onSave={handleSaveAccount} />
      )}

      {showEdit && selectedRow && (
        <ModalOverlay>
          <EditMoneyChangerModal
            data={selectedRow}
            onClose={() => {
              setShowEdit(false);
              setSelectedRow(null);
            }}
          />
        </ModalOverlay>
      )}
    </div>
  );
}

function ModalOverlay({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {children}
    </div>
  );
}