import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

// Helper for validating columns
const hasRequiredColumns = (columns) => {
  const required = ["symbol", "bid", "ask"];
  return required.every((col) => columns.includes(col));
};

// Helper for row validation
const parseRow = (line, symbols, setError) => {
  if (!line.trim()) return null;
  const [symbol, bid, ask] = line.split(",").map((x) => x?.trim());
  if (!symbol || !bid || !ask) return null;
  if (symbols.has(symbol)) {
    setError("Duplicate currency symbols found in the file.");
    return null;
  }
  symbols.add(symbol);
  return {
    symbol,
    bid: isNaN(bid) ? "" : parseFloat(bid),
    ask: isNaN(ask) ? "" : parseFloat(ask),
  };
};

const FxRateUpload = ({ onClose }) => {
  const [fxFile, setFxFile] = useState(null);
  const [fxRates, setFxRates] = useState([]);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const fileInputRef = useRef(null);

  const parseFile = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (!lines.length) {
      setError("File is empty.");
      return [];
    }

    const [header, ...rows] = lines;
    const columns = header.split(",").map((col) => col.trim().toLowerCase());
    if (!hasRequiredColumns(columns)) {
      setError("Invalid file format. File must contain Symbol, Bid, and Ask columns.");
      return [];
    }

    const rates = [];
    const symbols = new Set();

    rows.forEach((line) => {
      const rate = parseRow(line, symbols, setError);
      if (rate) rates.push(rate);
    });

    if (!rates.length && !error) setError("No valid FX rates found.");
    return rates;
  };

  // Handle file selection (but do NOT parse yet)
  const handleFxFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (!["csv"].includes(ext)) {
        setError("Invalid file format. Only CSV files are supported.");
        setFxRates([]);
        setFxFile(null);
        setSelectedFileName(null);
        setSuccessMsg(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFxFile(file);
      setSelectedFileName(file.name);
      setError(null);
      setSuccessMsg(null);
      setFxRates([]); // clear previous result until user uploads
    }
  };

  // Triggered by the Upload button
  const handleUploadClick = () => {
    if (!fxFile) {
      setError("Please choose a file before uploading.");
      setFxRates([]);
      setSuccessMsg(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rates = parseFile(text);
      if (rates.length) {
        setFxRates(rates);
        setError(null);
        setSuccessMsg(null);
      } else {
        setFxRates([]);
      }
    };
    reader.readAsText(fxFile);
  };

  // Save handler — NO API CALL; just show success message
  const handleFxSave = () => {
    if (!fxRates.length) {
      setError("Please upload and review FX rates before saving.");
      setSuccessMsg(null);
      return;
    }
    setError(null);
    setSuccessMsg("FX Rate has been successfully saved");
  };

  // Cancel clears file, table, error/success, and input
  const handleCancel = () => {
    setFxFile(null);
    setSelectedFileName(null);
    setFxRates([]);
    setError(null);
    setSuccessMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // onClose && onClose(); // keep commented unless you want to close the page/modal
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8">FX FILE</h1>
        <div className="bg-white shadow rounded-xl p-8">
          {/* File Upload Box */}
          <div className="mb-8">
            <label htmlFor="fx-upload-file" className="block font-semibold text-gray-800 mb-2 text-lg">
              Upload files<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-gray-50 mb-3">
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15.75V19a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 19v-3.25M7.5 10.5l4.5-4.5m0 0l4.5 4.5m-4.5-4.5V16.5"
                />
              </svg>
              <span className="text-gray-700 text-base font-medium">Drop files here</span>
              <span className="text-xs text-gray-500 mt-1 mb-1">Supported format: CSV</span>
              <span className="text-sm">
                <label
                  htmlFor="fx-upload-file"
                  className="text-indigo-700 hover:underline cursor-pointer font-semibold"
                >
                  Browse files
                </label>
                <input
                  id="fx-upload-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFxFileChange}
                />
              </span>
              {selectedFileName && (
                <span className="mt-2 text-sm text-gray-800 font-semibold">
                  Selected file: <span className="text-indigo-700">{selectedFileName}</span>
                </span>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600"
                onClick={handleUploadClick}
              >
                Upload
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse rounded-xl border overflow-hidden text-base">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-6 py-3 font-bold">Symbol</th>
                  <th className="px-6 py-3 font-bold">Bid</th>
                  <th className="px-6 py-3 font-bold">Ask</th>
                </tr>
              </thead>
              <tbody>
                {fxRates.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-8">
                      No rates loaded yet.
                    </td>
                  </tr>
                ) : (
                  fxRates.map((rate, idx) => (
                    <tr key={rate.symbol + idx} className="hover:bg-gray-50">
                      <td className="px-6 py-3">{rate.symbol}</td>
                      <td className="px-6 py-3">{rate.bid}</td>
                      <td className="px-6 py-3">{rate.ask}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Save FX Button */}
          <div className="flex">
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded text-base disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleFxSave}
              disabled={fxRates.length === 0}
              aria-disabled={fxRates.length === 0}
            >
              + Save FX
            </button>
          </div>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mt-4 max-w-xl">
            <div
              className="bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded shadow-sm text-sm"
              role="status"
              aria-live="polite"
            >
              <strong className="font-semibold">Success: </strong>
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 max-w-xl">
            <div
              className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-sm text-sm"
              role="alert"
            >
              <strong className="font-semibold">Error: </strong>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

FxRateUpload.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default FxRateUpload;