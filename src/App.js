import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LayoutWithResizableSidebar from "./components/sidebar";
import ManageAccounts from "./ManageAccounts";
import Commission from "./pages/Commission";
import MoneyChanger from "./pages/MoneyChanger";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Amplify } from "aws-amplify";
import awsConfig from "./aws/aws-exports";
import { fetchAuthSession } from "@aws-amplify/auth"; 

// Configure Amplify
console.log("Amplify configuration being used:", awsConfig);
Amplify.configure(awsConfig);

function ComingSoon({ label }) {
  return (
    <div className="text-gray-500 text-xl">
      <div>{label}</div>
      <div className="mt-4 text-base">Coming soon...</div>
    </div>
  );
}

// Move useAuthInit into a component
function AuthInit() {
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        const accessToken = session.tokens?.accessToken?.toString();

        if (idToken && accessToken) {
          localStorage.setItem("idToken", idToken);
          localStorage.setItem("accessToken", accessToken);
        }
      } catch (e) {
        console.log("Not logged in yet");
      }
    };
    fetchTokens();
  }, []);

  return null; // this component only performs side effects
}

const router = createBrowserRouter(
  [
    { path: "/login", element: <Login /> },
    {
      path: "/",
      element: <LayoutWithResizableSidebar />,
      children: [
        { index: true, element: <Home /> },
        { path: "account", element: <ManageAccounts /> },
        { path: "money-changer", element: <MoneyChanger /> },
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
  return (
    <>
      <AuthInit /> {/* Hook called inside a component */}
      <RouterProvider router={router} />
    </>
  );
}
