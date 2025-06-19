import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommissionRateCreateModal from "../CommissionRateCreateModal";
import MockAdapter from "axios-mock-adapter";
import axios from "../../api/axios";

const mock = new MockAdapter(axios);

const mockScheme = {
  id: 1,
  nameTag: "Scheme A",
};

const onClose = jest.fn();
const onCreated = jest.fn();

afterEach(() => {
  mock.reset();
  jest.clearAllMocks();
});

describe("CommissionRateCreateModal", () => {
  test("renders the modal with fields", () => {
    render(<CommissionRateCreateModal selectedScheme={mockScheme} onClose={onClose} onCreated={onCreated} />);
    expect(screen.getByText("Create Commission Rates")).toBeInTheDocument();
    expect(screen.getByText("Scheme A")).toBeInTheDocument();
  });

  test("shows validation errors on empty submission", async () => {
    render(<CommissionRateCreateModal selectedScheme={mockScheme} onClose={onClose} onCreated={onCreated} />);
    fireEvent.click(screen.getByText("Save"));
    
    expect(await screen.findByText(/Symbol is required/i)).toBeInTheDocument();
    expect(screen.getByText(/A valid commission rate greater than 0 is required/i)).toBeInTheDocument();
  });

  test("submits valid data successfully", async () => {
    const mockResponse = {
      id: 1,
      currencyId: 2,
      schemeId: 1,
      rate: 0.8,
      createdAt: "2025-06-19T06:26:45.084+00:00",
      updatedAt: "2025-06-19T06:26:45.084+00:00",
      createdBy: 1,
      updatedBy: 1,
      isDeleted: false,
    };

    mock.onPost("/api/v1/commission-rates").reply(200, mockResponse);

    render(<CommissionRateCreateModal selectedScheme={mockScheme} onClose={onClose} onCreated={onCreated} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } }); // select USD
    fireEvent.change(screen.getByPlaceholderText(/enter commission rate/i), { target: { value: "0.8" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(onCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          currency: "USD",
          schemeId: 1,
          rate: 0.8,
        })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("shows error message on API failure", async () => {
    mock.onPost("/api/v1/commission-rates").reply(409, "Commission rate for the same currency and scheme already exists.");

    render(<CommissionRateCreateModal selectedScheme={mockScheme} onClose={onClose} onCreated={onCreated} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });
    fireEvent.change(screen.getByPlaceholderText(/enter commission rate/i), { target: { value: "0.5" } });

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
  });
});
