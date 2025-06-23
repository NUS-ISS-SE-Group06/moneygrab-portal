import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateMoneyChangerModal from "../CreateMoneyChangerModal";
import axios from "../../../api/axios";

// Mock axios
jest.mock("axios");

describe("CreateMoneyChangerModal", () => {
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

 it("submits form successfully", async () => {
  axios.post.mockResolvedValueOnce({ data: { id: 1, companyName: "Test Co" } });

  render(<CreateMoneyChangerModal onClose={onCloseMock} onSave={onSaveMock} />);

  await userEvent.type(screen.getByPlaceholderText("Company name"), "Test Co");
  await userEvent.type(screen.getByPlaceholderText("Email address"), "test@example.com");

  fireEvent.submit(screen.getByTestId("moneychanger-form"));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
    expect(onSaveMock).toHaveBeenCalledWith({ id: 1, companyName: "Test Co" });
    expect(onCloseMock).toHaveBeenCalled();
  });
});

});
