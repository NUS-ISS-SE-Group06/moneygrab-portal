import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";

export default function Commision() {
  // State for commission and loading
  const [commissionSchemes, setCommissionSchemes] = useState([]);
  const [commissionRates, setCommissionRates] = useState([]);
  const [companyCommissionSchemes, setCompanyCommissionSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("Commission");

  // Placeholder API call
  useEffect(() => {
    // Simulate API call (replace with real fetch later)
    setTimeout(() => {
      setCommissionSchemes([
        {
          id: "01",
          commissiontag: "Standard",
          description:
            "Default commission scheme for most money changers. Offers standard rates and commission. Suitable for companies with low to moderate transaction volumes.",
          isdefault: true,
        },
        {
          id: "02",
          commissiontag: "VIP1",
          description:
            "Designed for active money changers with consistent volume. Offers better commission rates than Standard. Requires minimum monthly transaction volume.",
          isdefault: false,
        },
        {
          id: "03",
          commissiontag: "VIP2",
          description:
            "Premium scheme for high-volume money changers. Offers the lowest commission rates, with custom terms, priority support, and dedicated relationship management.",
          isdefault: false,
        },
      ]);

      setCommissionRates([
        {
          id: "01",
          symbol: "USD",
          rate: 0.1,
        },
        {
          id: "02",
          symbol: "AUD",
          rate: 0.05,
        },
        {
          id: "03",
          symbol: "IDR",
          rate: 0.2,
        },
        {
          id: "04",
          symbol: "MYR",
          rate: 0.23,
        },
        {
          id: "05",
          symbol: "OTHER",
          rate: 0.01,
        },
      ]);

      setCompanyCommissionSchemes([
        {
          id: "01",
          moneychanger: "ABC Money Ltd",
          commissiontag: "Standard",
        },
        {
          id: "02",
          moneychanger: "PTY Transfer Ltd",
          commissiontag: "Standard",
        },
        {
          id: "03",
          moneychanger: "WSS Gram Ltd",
          commissiontag: "VIP1",
        },
        {
          id: "04",
          moneychanger: "Raffles Moneygram Ltd",
          commissiontag: "Standard",
        },
      ]);

      setLoading(false);
    }, 1000);
    // In real use:
    // fetch('/api/commisionscheme')
    //   .then(res => res.json())
    //   .then(data => { setCommissionScheme(data); setLoading(false); })
    //   .catch(err => { setError("API Error"); setLoading(false); });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMMISSION SCHEME</h1>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium">
            + Create New Scheme
          </button>
        </div>
        {/* Error Message */}
        <div className="mb-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
            <p className="font-bold">Error Message</p>
            <p>Unable to create commission scheme</p>
          </div>
        </div>
        {/* Scheme Table */}
        <div className="bg-white shadow rounded">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4">Commission Tag</th>
                  <th className="py-2 px-4">Description</th>
                  <th className="py-2 px-4">Default</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {commissionSchemes.map((scheme) => (
                  <tr key={scheme.id} className="border-b last:border-b-0">
                    <td className="py-2 px-4">{scheme.commissiontag}</td>
                    <td className="py-2 px-4">{scheme.description}</td>
                    <td className="py-2 px-4">
                      <input
                        type="checkbox"
                        checked={scheme.isdefault}
                        readOnly
                        className="cursor-default"
                      />
                    </td>
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

        <hr className="border-t border-black my-6" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMMISSION RATES</h1>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium">
            + Create New Commision Rate
          </button>
        </div>
        {/* Error Message */}
        <div className="mb-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
            <p className="font-bold">Error Message</p>
            <p>Unable to create commission rates</p>
          </div>
        </div>
        {/* Rates Table */}
        <div className="bg-white shadow rounded">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4">Symbol</th>
                  <th className="py-2 px-4">Commission Rates</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {commissionRates.map((rates) => (
                  <tr key={rates.id} className="border-b last:border-b-0">
                    <td className="py-2 px-4">{rates.symbol}</td>
                    <td className="py-2 px-4">{rates.rate}</td>
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

        <hr className="border-t border-black my-6" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMPANY COMMISSION SCHEME</h1>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium">
            + Set Commision Scheme
          </button>
        </div>
        {/* Error Message */}
        <div className="mb-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
            <p className="font-bold">Error Message</p>
            <p>Unable to create company commission scheme</p>
          </div>
        </div>
        {/* Company Scheme Table */}
        <div className="bg-white shadow rounded">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4">Money Changer</th>
                  <th className="py-2 px-4">Commission Tag</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {companyCommissionSchemes.map((scheme) => (
                  <tr key={scheme.id} className="border-b last:border-b-0">
                    <td className="py-2 px-4">{scheme.moneychanger}</td>
                    <td className="py-2 px-4">{scheme.commissiontag}</td>
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
