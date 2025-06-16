import React from "react";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import LayoutWithResizableSidebar from "./components/sidebar";
import ManageAccounts from "./ManageAccounts";
import Commission from "./pages/Commission";
import MoneyChanger from "./pages/MoneyChanger";
import Home from "./pages/Home";

function ComingSoon({ label }) {
  return (
    <div className="text-gray-500 text-xl">
      <div>{label}</div>
      <div className="mt-4 text-base">Coming soon...</div>
    </div>
  );
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LayoutWithResizableSidebar />,
      children: [
        { index: true, element: <Home /> },
        { path: "account", element: <ManageAccounts /> },
        { path: "money-changer", element: <MoneyChanger /> }, // Replaced ComingSoon with MoneyChanger
        { path: "fx-rate-upload", element: <ComingSoon label="FX Rate Upload" /> },
        { path: "commission", element: <Commission label="Commission Scheme" /> },
        { path: "currency", element: <ComingSoon label="Currency" /> },
        { path: "compute-rates", element: <ComingSoon label="Compute Rates" /> },
        { path: "view-rates", element: <ComingSoon label="ComingSoon" /> },
        { path: "currency-codes", element: <ComingSoon label="Currency Codes" /> },
        { path: "transactions", element: <ComingSoon label="Transactions" /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    },
  }
);

export default function App() {
  return <RouterProvider router={router} />;
}