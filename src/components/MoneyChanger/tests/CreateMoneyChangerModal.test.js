import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateMoneyChangerModal from "../CreateMoneyChangerModal";
import axios from "../../../api/axios";

// Mock axios
jest.mock("../../../api/axios");

describe("CreateMoneyChangerModal", () => {
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn(); // Updated from onCreateMock

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits form successfully", async () => {
    // Mock API response
    axios.post.mockResolvedValueOnce({
      data: { id: 1, companyName: "Test Co", email: "test@example.com" } // Include email for validation
    });

    // Render component with required props
    render(
      <CreateMoneyChangerModal
        onClose={onCloseMock}
        onSave={onSaveMock} // Updated from onCreate
      />
    );

    // Fill form fields
    await userEvent.type(screen.getByPlaceholderText("Company name"), "Test Co");
    await userEvent.type(screen.getByPlaceholderText("Email"), "test@example.com");

    // Submit form
    fireEvent.submit(screen.getByTestId("moneychanger-form"));

    // Assertions
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/v1/money-changers", expect.objectContaining({
        companyName: "Test Co",
        email: "test@example.com",
      }));
      expect(onSaveMock).toHaveBeenCalledWith({ id: 1, companyName: "Test Co", email: "test@example.com" }); // Updated callback
      expect(onCloseMock).toHaveBeenCalledWith(true);
    });
  });
});