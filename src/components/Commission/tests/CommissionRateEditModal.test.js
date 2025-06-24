import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommissionRateEditModal from "../CommissionRateEditModal";
import axios from "../../../api/axios";

jest.mock("axios");

const mockCommissionRate = {
  id: 1,
  nameTag: "Scheme A",
  currencyId: 2,
  currency: "USD",
  schemeId: 1,
  rate: 0.5,
};

const onClose = jest.fn();
const onUpdated = jest.fn();

describe("CommissionRateEditModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal with fields", async () => {
    render(
      <CommissionRateEditModal
        selectedCommissionRate={mockCommissionRate}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    expect(screen.getByText("Edit Commission Rates")).toBeInTheDocument();
    expect(screen.getByText("Scheme A")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter commission rate/i)).toHaveValue(0.5);
  });

  test("shows validation error when rate is empty", async () => {
    const rateZero = { ...mockCommissionRate, rate: "" };

    render(
      <CommissionRateEditModal
        selectedCommissionRate={rateZero}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter commission rate/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText(/A valid commission rate greater than 0 is required/i)).toBeInTheDocument();
  });

  test("submits valid data successfully", async () => {
    const updated = { ...mockCommissionRate, rate: 0.8 };
    axios.put.mockResolvedValueOnce({ data: updated });

    render(
      <CommissionRateEditModal
        selectedCommissionRate={mockCommissionRate}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter commission rate/i), {
      target: { value: "0.8" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(onUpdated).toHaveBeenCalledWith(updated);
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("displays error on API failure", async () => {
    axios.put.mockRejectedValueOnce({
      response: {
        data: "Rate update failed due to conflict.",
      },
    });

    render(
      <CommissionRateEditModal
        selectedCommissionRate={mockCommissionRate}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter commission rate/i), {
      target: { value: "1.2" },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText(/Rate update failed/i)).toBeInTheDocument();
  });
});
