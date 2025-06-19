// CreateMoneyChangerModal.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateMoneyChangerModal from "../CreateMoneyChangerModal";
import api from "../../../api/axios";

// Mock the API module
jest.mock("../../../api/axios");

describe("CreateMoneyChangerModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal form with default values", () => {
    render(<CreateMoneyChangerModal onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText(/Create Money Changer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  test("shows error when required fields are empty on submit", async () => {
    render(<CreateMoneyChangerModal onClose={mockOnClose} onSave={mockOnSave} />);
    fireEvent.click(screen.getByText(/Save/i));
    expect(await screen.findByText(/Company Name and Email are required/i)).toBeInTheDocument();
  });

  test("calls API and onSave when form is filled correctly", async () => {
    const mockResponse = { data: { id: 1, companyName: "ABC Money" } };
    api.post.mockResolvedValueOnce(mockResponse);

    render(<CreateMoneyChangerModal onClose={mockOnClose} onSave={mockOnSave} />);

    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: "ABC Money", name: "companyName" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "abc@example.com", name: "email" },
    });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/v1/money-changers",
        expect.objectContaining({
          companyName: "ABC Money",
          email: "abc@example.com",
        })
      );
    });

    expect(mockOnSave).toHaveBeenCalledWith(mockResponse.data);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("displays API error message if request fails", async () => {
    api.post.mockRejectedValueOnce(new Error("Server error"));

    render(<CreateMoneyChangerModal onClose={mockOnClose} onSave={mockOnSave} />);

    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: "ABC Money", name: "companyName" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "abc@example.com", name: "email" },
    });

    fireEvent.click(screen.getByText(/Save/i));

    expect(await screen.findByText(/Creation failed: Server error/i)).toBeInTheDocument();
  });

  test("selects and deselects locations", () => {
    render(<CreateMoneyChangerModal onClose={mockOnClose} onSave={mockOnSave} />);

    const selectButtons = screen.getAllByText("Select", { selector: "button" });
    fireEvent.click(selectButtons[0]); // Select "Tampines"

    expect(screen.getByText("Deselect")).toBeInTheDocument();

    const deselectButton = screen.getByText("Deselect", { selector: "button" });
    fireEvent.click(deselectButton);

    expect(screen.queryByText("Deselect")).not.toBeInTheDocument();
  });
});
