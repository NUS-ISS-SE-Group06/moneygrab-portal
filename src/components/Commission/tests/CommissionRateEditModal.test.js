import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommissionRateEditModal from "../CommissionRateEditModal";
import api from "../../../api/axios";
import "@testing-library/jest-dom";

jest.mock("../../../api/axios");
const mockedApi = api;

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

  test("renders modal with fields", () => {
    render(
      <CommissionRateEditModal
        selectedRecord={mockCommissionRate}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    expect(screen.getByText("Edit Commission Rates")).toBeInTheDocument();
    expect(screen.getByText("Commission Tag")).toBeInTheDocument();
    expect(screen.getByText("Symbol")).toBeInTheDocument();

    // These values should now be rendered
    expect(screen.getByText("Scheme A")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Enter commission rate/i);
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("0.5");
  });

  test("shows validation error when rate is empty", async () => {
    const rateEmpty = { ...mockCommissionRate, rate: "" };

    render(
      <CommissionRateEditModal
        selectedRecord={rateEmpty}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    const input = screen.getByPlaceholderText(/Enter commission rate/i);
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText(/A valid commission rate greater than 0 is required/i)
    ).toBeInTheDocument();
  });

  test("submits valid data successfully", async () => {
    const updated = { ...mockCommissionRate, rate: 0.8 };
    mockedApi.put.mockResolvedValueOnce({ data: updated });

    render(
      <CommissionRateEditModal
        selectedRecord={mockCommissionRate}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    const input = screen.getByPlaceholderText(/Enter commission rate/i);
    fireEvent.change(input, { target: { value: "0.8" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/api/v1/commission-rates/${mockCommissionRate.id}`,
        {
          id: mockCommissionRate.id,
          currencyId: mockCommissionRate.currencyId,
          schemeId: mockCommissionRate.schemeId,
          rate: "0.8",
          updatedBy: 1,
        }
      );
      expect(onUpdated).toHaveBeenCalledWith(updated);
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("displays error on API failure", async () => {
    const errorMessage = "Rate update failed due to conflict.";
    mockedApi.put.mockRejectedValueOnce({
      response: {
        data: errorMessage,
      },
    });

    render(
      <CommissionRateEditModal
        selectedRecord={mockCommissionRate}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    const input = screen.getByPlaceholderText(/Enter commission rate/i);
    fireEvent.change(input, { target: { value: "1.2" } });
    fireEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText((text) => text.includes("Rate update failed"))
    ).toBeInTheDocument();
  });
});
