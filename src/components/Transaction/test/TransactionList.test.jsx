import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionList from "../Transaction";
import api from "../../../api/axios";

jest.mock("../../../api/axios");

const mockTransactions = [
  {
    id: 1,
    customerId: "CUST001",
    currentStatus: "Pending",
    email: "user1@example.com",
    foreignAmount: 100,
    sgdAmount: 135,
    moneyChangerId: 10,
    currencyId: "USD",
    transactionDate: "2025-07-11T10:00:00Z",
  },
];

describe("TransactionList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("user", JSON.stringify({ id: 1 }));
  });

  it("renders loading state initially", async () => {
    api.get.mockResolvedValueOnce({ data: [] });

    render(<TransactionList />);
    expect(screen.getByText(/Loading transactions/i)).toBeInTheDocument();
  });

  it("renders transaction list after fetch", async () => {
    api.get.mockResolvedValueOnce({ data: mockTransactions });

    render(<TransactionList />);

    // Wait for table content to appear
    expect(await screen.findByText("Transaction List")).toBeInTheDocument();
    expect(screen.getByText("CUST001")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("handles fetch error", async () => {
    api.get.mockRejectedValueOnce(new Error("Network error"));

    render(<TransactionList />);

    expect(await screen.findByText(/Failed to fetch transactions/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Dismiss"));
    expect(screen.queryByText(/Failed to fetch transactions/i)).not.toBeInTheDocument();
  });

  it("opens edit modal on Edit click", async () => {
    api.get.mockResolvedValueOnce({ data: mockTransactions });

    render(<TransactionList />);

    // Wait for the Edit button to appear after fetch
    const editButton = await screen.findByText("Edit");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    // Modal should appear
    expect(await screen.findByText("Edit Transaction")).toBeInTheDocument();
  });
});
