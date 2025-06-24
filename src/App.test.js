import React from "react";

 // Adjust path as needed
import PropTypes from "prop-types";
import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import LayoutWithResizableSidebar from "./components/sidebar";
import ManageAccounts from "./ManageAccounts";
import Commission from "./pages/Commission";
import MoneyChanger from "./pages/MoneyChanger";

function ComingSoon({ label }) {
  return (
    <div className="text-gray-500 text-xl">
      <div>{label}</div>
      <div className="mt-4 text-base">Coming soon...</div>
    </div>
  );
}
// Add PropTypes validation
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
  test("renders the default redirect route to ManageAccounts", async () => {
    const router = getTestRouter("/");
    render(<RouterProvider router={router} />);
    expect(await screen.findByText(/Manage Accounts/i)).toBeInTheDocument();
  });

  test("renders MoneyChanger page", async () => {
    const router = getTestRouter("/money-changer");
    render(<RouterProvider router={router} />);
    // Look for a more specific heading instead of generic link text
    expect(await screen.findByRole("heading", { name: /Manage Money Changers/i })).toBeInTheDocument();
  });

 test("renders ComingSoon for FX Rate Upload", async () => {
  const router = getTestRouter("/fx-rate-upload");
  render(<RouterProvider router={router} />);

  // Grab the main content area
  const main = screen.getByRole("main");

  // Assert both heading and subtext are rendered
  expect(within(main).getByText("FX Rate Upload")).toBeInTheDocument();
  expect(within(main).getByText("Coming soon...")).toBeInTheDocument();
});

  test("renders Commission label", async () => {
    const router = getTestRouter("/commission");
    render(<RouterProvider router={router} />);
    // If multiple headings, find all and check for expected one
    const headings = await screen.findAllByRole("heading", { name: /Commission Scheme/i });
    expect(headings.length).toBeGreaterThan(0);
  });
});
