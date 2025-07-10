import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutWithResizableSidebar from "./components/sidebar";
import ManageAccounts from "./ManageAccounts";
import Commission from "./pages/Commission";
import Currency from "./pages/Currency";
import MoneyChanger from "./pages/MoneyChanger";
import ManageCurrency from "./pages/ManageCurrency";
import Home from "./pages/Home";
import Login from "./pages/Login";
import {Amplify } from "aws-amplify";
import awsConfig from "./aws/aws-exports";
import {fetchAuthSession } from "@aws-amplify/auth"; 
import RequireAuth from "./components/Auth/RequireAuth";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import FxRateUpload from "./components/FXUpload/FxRateUpload";
import ComputeRate from "./pages/ComputeRate";


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// Add PropTypes validation for ErrorBoundary
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

// Configure Amplify with error handling
try {
  console.log("Amplify configuration being used:", awsConfig);
  
  // Validate configuration before applying - Fixed: Using optional chaining consistently
  if (!awsConfig?.Auth?.Cognito?.userPoolId || !awsConfig?.Auth?.Cognito?.userPoolClientId) {
    throw new Error("Invalid AWS configuration: Missing required Cognito settings");
  }
  
  Amplify.configure(awsConfig);
  console.log("Amplify configured successfully");
} catch (error) {
  console.error("Failed to configure Amplify:", error);
  // Show user-friendly error
  alert("Failed to configure authentication. Please check your AWS settings.");
}

function ComingSoon({ label }) {
  return (
    <div className="text-gray-500 text-xl">
      <div>{label}</div>
      <div className="mt-4 text-base">Coming soon...</div>
    </div>
  );
}

// Add PropTypes validation for ComingSoon
ComingSoon.propTypes = {
  label: PropTypes.string.isRequired,
};

// Enhanced AuthInit component with error handling
function AuthInit() {
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("AuthInit: Checking auth session...");
        const session = await fetchAuthSession();
        console.log("AuthInit: Session check complete:", {
          hasTokens: !!session?.tokens,
          hasIdToken: !!session?.tokens?.idToken,
          hasAccessToken: !!session?.tokens?.accessToken
        });
        
        // No need to manually store tokens - Amplify handles this automatically
        
      } catch (error) {
        console.log("AuthInit: No active session:", error.message);
        // This is normal if user is not logged in
      }
    };
    
    initializeAuth().catch(error => {
      console.error("AuthInit: Initialization failed:", error);
      setInitError(error);
    });
  }, []);

  if (initError) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h3>Auth Initialization Error:</h3>
        <p>{initError.message}</p>
      </div>
    );
  }

  return null; // this component only performs side effects
}

// Create router with error handling
let router;
try {
  router = createBrowserRouter(
    [
      { path: "/login", element: <Login /> },
      {
        path: "/",
        element: (
          <RequireAuth>
            <LayoutWithResizableSidebar />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Home /> },
          { path: "account", element: <ManageAccounts /> },
          { path: "money-changer", element: <MoneyChanger /> },
          { path: "fx-rate-upload", element: <FxRateUpload /> },
          { path: "commission", element: <Commission label="Commission Scheme" /> },
          { path: "currency", element: <Currency label="Currency" /> },
          { path: "compute-rates", element: <ComputeRate label="Compute Rates" /> },
          { path: "view-rates", element: <ComingSoon label="ComingSoon" /> },
          { path: "currency-codes", element: <ManageCurrency label="Manage Currency Codes" /> },
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
  console.log("Router created successfully");
} catch (error) {
  console.error("Failed to create router:", error);
}

const queryClient = new QueryClient();

export default function App() {
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      console.error('App level error:', error);
      setAppError(error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (appError) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Application Error:</h2>
        <p>{appError.message}</p>
      </div>
    );
  }

  if (!router) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Router Configuration Error</h2>
        <p>Failed to initialize router. Check console for details.</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthInit />
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}