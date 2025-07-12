import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditTransactionModal from "../EditTransactionModal";

const mockTransaction = {
  id: 1,
  transactionDate: "2025-07-11T08:30:00Z",
  currentStatus: "Pending",
  customerName: "John Doe",
  foreignAmount: 100,
  sgdAmount: 135,
};

describe("EditTransactionModal", () => {
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn().mockResolvedValue();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with correct initial data", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={onCloseMock}
        onSave={onSaveMock}
        userId={1}
      />
    );

    expect(screen.getByText("Edit Transaction")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100 SGD to 135 MYR")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pending")).toBeInTheDocument();
  });

  it("allows selecting status and entering comments", async () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={onCloseMock}
        onSave={onSaveMock}
        userId={1}
      />
    );

    fireEvent.change(screen.getByLabelText(/Select Status/i), {
      target: { value: "Paid" },
    });

    fireEvent.change(screen.getByLabelText(/Comments/i), {
      target: { value: "Payment received." },
    });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith({
        id: 1,
        status: "Paid",
        comments: "Payment received.",
        userId: 1,
      });
    });

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("shows validation error if 'Cancelled' is selected without comments", async () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={onCloseMock}
        onSave={onSaveMock}
        userId={1}
      />
    );

    fireEvent.change(screen.getByLabelText(/Select Status/i), {
      target: { value: "Cancelled" },
    });

    fireEvent.click(screen.getByText(/Save/i));

    expect(
      screen.getByText((content) =>
        content.includes("Comments are mandatory for Cancelled Status")
      )
    ).toBeInTheDocument();

    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it("shows error message when save fails", async () => {
    onSaveMock.mockRejectedValueOnce(new Error("Save failed"));

    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={onCloseMock}
        onSave={onSaveMock}
        userId={1}
      />
    );

    fireEvent.change(screen.getByLabelText(/Select Status/i), {
      target: { value: "Paid" },
    });

    fireEvent.change(screen.getByLabelText(/Comments/i), {
      target: { value: "Test failure." },
    });

    fireEvent.click(screen.getByText(/Save/i));

    await screen.findByText((content) =>
  content.includes("Unable to update status")
);

    expect(onSaveMock).toHaveBeenCalled();
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
