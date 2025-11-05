import React from "react";
import PropTypes from "prop-types";
import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import LayoutWithResizableSidebar from "./components/sidebar";
import ManageAccounts from "./pages/ManageAccounts";
import Commission from "./pages/Commission";
import MoneyChanger from "./pages/MoneyChanger";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function ComingSoon({ label }) {
  return (
    <div className="text-gray-500 text-xl">
      <div>{label}</div>
      <div className="mt-4 text-base">Coming soon...</div>
    </div>
  );
}
//Add PropTypes validation
ComingSoon.propTypes = {
  label: PropTypes.string.isRequired,
};
const getTestRouter = (initialPath = "/") =>
  createMemoryRouter(
    [
      {
        path: "/",
        element: <LayoutWithResizableSidebar />,
        children: [
          { index: true, element: <ManageAccounts /> },
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
      initialEntries: [initialPath],
      future: {
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      },
    }
  );


describe("App Routing", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  const renderWithQueryClient = (ui) => {
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };
  
  test("renders the default redirect route to ManageAccounts", async () => {
    const router = getTestRouter("/");
    renderWithQueryClient(<RouterProvider router={router} />);
    expect(await screen.findByText(/Manage Accounts/i)).toBeInTheDocument();
  });

  test("renders MoneyChanger page", async () => {
    const router = getTestRouter("/money-changer");
    renderWithQueryClient(<RouterProvider router={router} />);
    expect(await screen.findByRole("heading", { name: /Manage Money Changers/i })).toBeInTheDocument();
  });

  test("renders ComingSoon for FX Rate Upload", async () => {
    const router = getTestRouter("/fx-rate-upload");
    renderWithQueryClient(<RouterProvider router={router} />);
    const main = screen.getByRole("main");
    expect(within(main).getByText("FX Rate Upload")).toBeInTheDocument();
    expect(within(main).getByText("Coming soon...")).toBeInTheDocument();
  });

  test("renders Commission label", async () => {
    const router = getTestRouter("/commission");
    renderWithQueryClient(<RouterProvider router={router} />);
    const headings = await screen.findAllByRole("heading", { name: /Commission Scheme/i });
    expect(headings.length).toBeGreaterThan(0);
  });
});