import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateMoneyChangerModal from "../CreateMoneyChangerModal";
import axios from "../../../api/axios";

// Mock axios
jest.mock("axios");

describe("CreateMoneyChangerModal", () => {
  const onCloseMock = jest.fn();
  const onCreateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits form successfully", async () => {
    // Mock API response
    axios.post.mockResolvedValueOnce({
      data: { id: 1, companyName: "Test Co" }
    });

    // Render component with required props
    render(
      <CreateMoneyChangerModal
        onClose={onCloseMock}
        onCreate={onCreateMock}
      />
    );

    // Fill form fields
    await userEvent.type(screen.getByPlaceholderText("Company name"), "Test Co");
    await userEvent.type(screen.getByPlaceholderText("Email"), "test@example.com");

    // Submit form
    fireEvent.submit(screen.getByTestId("moneychanger-form"));

    // Assertions
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(onCreateMock).toHaveBeenCalledWith({ id: 1, companyName: "Test Co" });
      expect(onCloseMock).toHaveBeenCalledWith(true);
    });
  });
});
