import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LayoutWithResizableSidebar from "./components/sidebar";
import ManageAccounts from "./ManageAccounts";
import Commission from "./pages/Commission"; // Adjust the import path as necessary
// import your other pages

function ComingSoon({ label }) {
  return (
    <div className="text-gray-500 text-xl">
      <div>{label}</div>
      <div className="mt-4 text-base">Coming soon...</div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWithResizableSidebar>
        <Routes>
          <Route path="/" element={<Navigate to="/account" />} />
          <Route path="/account" element={<ManageAccounts />} />
          {/* Replace below with your real pages */}
          <Route path="/money-changer" element={<ComingSoon label="Money Changer" />} />
          <Route path="/fx-rate-upload" element={<ComingSoon label="FX Rate Upload" />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/currency" element={<ComingSoon label="Currency" />} />
          <Route path="/compute-rates" element={<ComingSoon label="Compute Rates" />} />
          <Route path="/view-rates" element={<ComingSoon label="View Rates" />} />
          <Route path="/currency-codes" element={<ComingSoon label="Currency Codes" />} />
          <Route path="/transactions" element={<ComingSoon label="Transactions" />} />
        </Routes>
      </LayoutWithResizableSidebar>
    </Router>
  );
}


