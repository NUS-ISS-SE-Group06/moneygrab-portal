import React, { useState, useEffect } from "react";
import CreateMoneyChangerModal from "./CreateMoneyChangerModal";
import EditMoneyChangerModal from "./EditMoneyChangerModal";
import PropTypes from "prop-types"; // Import PropTypes
import api from '../../api/axios';

// Sample fallback data
const sampleData = [
  {
    id: 1,
    companyName: "Sample Company 1",
    email: "sample1@example.com",
    dateOfIncorporation: "2023-01-01",
    address: "123 Sample St #1",
    country: "Singapore",
    postalCode: "S12345",
    notes: "Sample notes 1",
    uen: "SAMPLE1XYZ",
    schemeId: 1,
    createdAt: "2025-06-13T09:00:00",
    updatedAt: "2025-06-13T09:00:00",
    createdBy: null,
    updatedBy: null,
    isDeleted: false,
  },
  {
    id: 2,
    companyName: "Sample Company 2",
    email: "sample2@example.com",
    dateOfIncorporation: "2023-02-01",
    address: "123 Sample St #2",
    country: "Singapore",
    postalCode: "S12346",
    notes: "Sample notes 2",
    uen: "SAMPLE2XYZ",
    schemeId: 2,
    createdAt: "2025-06-13T09:00:00",
    updatedAt: "2025-06-13T09:00:00",
    createdBy: null,
    updatedBy: null,
    isDeleted: false,
  },
];

export default function MoneyChangerList() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  const [refresh, setRefresh] = useState(false); // Flag to trigger refetch

  // Fetch money changers from API or use sample data
  useEffect(() => {
    const fetchMoneyChangers = async () => {
      if (isOffline) {
        setRows(sampleData);
        setShowBanner(true);
        setError("Offline mode: Displaying sample data.");
        return;
      }

      try {
        const response = await api.get(`/api/v1/money-changers`);
        setRows(response.data);
        setError("");
        setShowBanner(false);
      } catch (err) {
        setRows(sampleData);
        setShowBanner(true);
        setError(`API error: ${err.message}. Displaying sample data.`);
        console.error("Fetch error:", err);
      }
    };

    fetchMoneyChangers();
  }, [isOffline, refresh]); // Add refresh as dependency

  const handleSaveAccount = (newData) => {
    console.log("handleSaveAccount called with data:", newData);
    if (!newData.email || !newData.companyName) {
      setError("Please fill all fields.");
      console.log("Validation failed, error set:", error);
      return;
    }
    setError("");
    setRefresh(!refresh); // Trigger refetch to get the latest data from the API
    setShowCreate(false);
  };

  const handleUpdate = (updatedRow) => {
    setRows(rows.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this money changer?")) {
      try {
        const response = await fetch(`http://localhost:8688/api/v1/money-changers/${id}`, {
          method: "DELETE",
          headers: {
            // Uncomment and add token if required
            // "Authorization": "Bearer YOUR_API_TOKEN",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log(`Deleted money changer with id: ${id}`);
        setRefresh(!refresh); // Trigger refetch to update the list
      } catch (err) {
        setError(`Failed to delete: ${err.message}. Please try again.`);
        console.error("Delete error:", err);
      }
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
  };

  const handleModalClose = (success) => {
    if (success) {
      setRefresh(!refresh); // Trigger refetch on successful update
    }
    setShowEdit(false);
    setSelectedRow(null);
  };

  return (
    <div>
      {showBanner && (
        <div className="bg-yellow-100 text-red-700 p-4 mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={dismissBanner}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}
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
            <th>Company Name</th>
            <th>Email</th>
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
              <td>{row.companyName}</td>
              <td>{row.email}</td>
              <td>{row.uen}</td>
              <td>{row.dateOfIncorporation}</td>
              <td>{`Scheme-${row.schemeId}`}</td>
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
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreate && (
        <ModalOverlay>
          <CreateMoneyChangerModal onClose={() => setShowCreate(false)} onSave={handleSaveAccount} />
        </ModalOverlay>
      )}

      {showEdit && selectedRow && (
        <ModalOverlay>
          <EditMoneyChangerModal
            data={selectedRow}
            onClose={handleModalClose}
            onUpdate={handleUpdate}
          />
        </ModalOverlay>
      )}
    </div>
  );
}

// ModalOverlay component with PropTypes
export function ModalOverlay({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {children}
    </div>
  );
}

ModalOverlay.propTypes = {
  children: PropTypes.node.isRequired,
};