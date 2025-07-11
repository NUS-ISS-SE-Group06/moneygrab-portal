import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommissionSchemeEditModal from "../CommissionSchemeEditModal";
import axios from "../../../api/axios";
import '@testing-library/jest-dom';

jest.mock("../../../api/axios");

const mockScheme = {
  id: 1,
  nameTag: "Scheme A",
  description: "Initial description",
  isDefault: false,
};

const onClose = jest.fn();
const onUpdated = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CommissionSchemeEditModal", () => {
  test("renders with prefilled data", () => {
    render(
      <CommissionSchemeEditModal
        selectedRecord={mockScheme} // ✅ ensure the prop matches actual usage
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    expect(screen.getByText("Edit Commission Scheme")).toBeInTheDocument();

    const tagInput = screen.getByPlaceholderText("Enter Commission Tag");
    const descInput = screen.getByPlaceholderText("Enter Description");
    const checkbox = screen.getByLabelText(/Default Commission Scheme/i);

    expect(tagInput.value).toBe("Scheme A");
    expect(descInput.value).toBe("Initial description");
    expect(checkbox).not.toBeChecked();
  });

  test("shows error if no tag is present", async () => {
    const badScheme = { ...mockScheme, nameTag: "" };
    render(
      <CommissionSchemeEditModal
        selectedRecord={badScheme}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    fireEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText(/Commission tag is required/i)
    ).toBeInTheDocument();
    expect(onUpdated).not.toHaveBeenCalled();
  });

  test("submits valid data", async () => {
    const updatedResponse = {
      ...mockScheme,
      description: "Updated description",
      isDefault: true,
      updatedBy: 1,
    };

    axios.put.mockResolvedValueOnce({ data: updatedResponse });

    render(
      <CommissionSchemeEditModal
        selectedRecord={mockScheme}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter Description/i), {
      target: { value: "Updated description" },
    });

    fireEvent.click(screen.getByLabelText(/Default Commission Scheme/i));
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/api/v1/schemes/1", {
        description: "Updated description",
        isDefault: true,
        updatedBy: 1,
      });
      expect(onUpdated).toHaveBeenCalledWith(updatedResponse);
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("handles API error gracefully", async () => {
    axios.put.mockRejectedValueOnce({
      response: { data: "Failed to update scheme." },
    });

    render(
      <CommissionSchemeEditModal
        selectedRecord={mockScheme}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    );

    fireEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText((text) =>
        text.includes("Failed to update scheme")
      )
    ).toBeInTheDocument();

    expect(onUpdated).not.toHaveBeenCalled();
  });
});
