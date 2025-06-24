import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditMoneyChangerModal from "../EditMoneyChangerModal";
import "@testing-library/jest-dom";
import api from "../../../api/axios";

jest.mock("../../../api/axios"); // ✅ correct mock path

describe("EditMoneyChangerModal", () => {
  const mockData = {
    id: 1,
    companyName: "Test Company",
    email: "test@example.com",
    dateOfIncorporation: "2020-01-01",
    uen: "UEN12345678",
    address: "123 Test St",
    country: "Singapore",
    postalCode: "123456",
    notes: "Test note",
    scheme: "Scheme - 01",
    role: "Money Changer Staff",
    logoBase64: "",
    logoFilename: "",
    kycBase64: "",
    kycFilename: "",
    locations: ["Tampines"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders and populates form", async () => {
    api.get.mockResolvedValueOnce({ data: mockData });

    render(<EditMoneyChangerModal id={1} onClose={jest.fn()} onUpdate={jest.fn()} />);

    expect(await screen.findByDisplayValue("Test Company")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("UEN12345678")).toBeInTheDocument();
  });

  it("allows updating fields and submits successfully", async () => {
    api.get.mockResolvedValueOnce({ data: mockData });
    api.put.mockResolvedValueOnce({ data: { ...mockData, uen: "UEN98765432" } });

    const onClose = jest.fn();
    const onUpdate = jest.fn();

    render(<EditMoneyChangerModal id={1} onClose={onClose} onUpdate={onUpdate} />);

    const uenInput = await screen.findByLabelText("UEN");
    fireEvent.change(uenInput, { target: { value: "UEN98765432" } });

    const updateButton = screen.getByRole("button", { name: /update/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ uen: "UEN98765432" }));
      expect(onClose).toHaveBeenCalledWith(true);
    });
  });

  it("shows error when required fields are missing", async () => {
    const incompleteData = { ...mockData, companyName: "", email: "" };
    api.get.mockResolvedValueOnce({ data: incompleteData });

    render(<EditMoneyChangerModal id={1} onClose={jest.fn()} onUpdate={jest.fn()} />);

    const updateButton = await screen.findByRole("button", { name: /update/i });
    fireEvent.click(updateButton);

    expect(await screen.findByText(/Company Name and Email are required/i)).toBeInTheDocument();
  });

  it("handles API fetch failure", async () => {
    api.get.mockRejectedValueOnce({ response: { status: 500 } });

    render(<EditMoneyChangerModal id={999} onClose={jest.fn()} onUpdate={jest.fn()} />);

    expect(await screen.findByText(/failed to fetch data/i)).toBeInTheDocument();
  });
});
