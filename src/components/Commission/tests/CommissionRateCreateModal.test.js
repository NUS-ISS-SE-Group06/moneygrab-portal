import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommissionRateCreateModal from "../CommissionRateCreateModal";
import axios from "../../../api/axios";

jest.mock("../../../api/axios");

const mockScheme = {
  id: 1,
  nameTag: "Scheme A",
};

const onClose = jest.fn();
const onCreated = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CommissionRateCreateModal", () => {
  test("renders the modal with fields", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 2, code: "USD", label: "USD" }],
    });

    render(
      <CommissionRateCreateModal
        selectedScheme={mockScheme}
        onClose={onClose}
        onCreated={onCreated}
      />
    );

    expect(await screen.findByText("Create Commission Rates")).toBeInTheDocument();
    expect(screen.getByText("Scheme A")).toBeInTheDocument();
    expect(screen.getByLabelText(/Symbol/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter commission rate/i)).toBeInTheDocument();
  });

  test("shows validation errors on empty submission", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <CommissionRateCreateModal
        selectedScheme={mockScheme}
        onClose={onClose}
        onCreated={onCreated}
      />
    );

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText(/Symbol is required/i)).toBeInTheDocument();
    expect(screen.getByText(/A valid commission rate greater than 0 is required/i)).toBeInTheDocument();
  });

  test("submits valid data successfully", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 2, code: "USD", label: "USD" }],
    });

    const mockResponse = {
      id: 1,
      currencyId: 2,
      schemeId: 1,
      rate: 0.8,
      createdBy: 1,
    };

    axios.post.mockResolvedValueOnce({ data: mockResponse });

    render(
      <CommissionRateCreateModal
        selectedScheme={mockScheme}
        onClose={onClose}
        onCreated={onCreated}
      />
    );

    await waitFor(() => screen.getByRole("combobox"));

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "2" },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter commission rate/i), {
      target: { value: "0.8" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(onCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          schemeId: 1,
          currencyId: 2,
          rate: 0.8,
        })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("shows error message on API failure", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 2, code: "USD", label: "USD" }],
    });

    axios.post.mockRejectedValueOnce({
      response: {
        status: 409,
        data: "Commission rate for the same currency and scheme already exists.",
      },
    });

    render(
      <CommissionRateCreateModal
        selectedScheme={mockScheme}
        onClose={onClose}
        onCreated={onCreated}
      />
    );

    await waitFor(() => screen.getByRole("combobox"));

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "2" },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter commission rate/i), {
      target: { value: "0.5" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
  });
});
