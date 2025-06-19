import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommissionSchemeCreateModal from "../CommissionSchemeCreateModal";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Setup axios mock
const mock = new MockAdapter(axios);

describe("CommissionSchemeCreateModal", () => {
  const onClose = jest.fn();
  const onCreated = jest.fn();

  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  test("renders modal with input fields", () => {
    render(<CommissionSchemeCreateModal onClose={onClose} onCreated={onCreated} />);
    expect(screen.getByText("Create Commission Scheme")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Commission Tag")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Description")).toBeInTheDocument();
  });

  test("shows validation error on empty submission", async () => {
    render(<CommissionSchemeCreateModal onClose={onClose} onCreated={onCreated} />);
    fireEvent.click(screen.getByText("Save"));
    expect(await screen.findByText("Commission tag is required.")).toBeInTheDocument();
  });

test("submits valid data successfully", async () => {
  const mockResponse = {
    id: 2,
    nameTag: "NewTag",
    description: "Test description",
    isDefault: true,
    createdBy: 1,
    createdAt: "2025-06-19T10:00:00Z",
  };

  mock.onPost("/api/v1/schemes").reply(200, mockResponse);

  render(<CommissionSchemeCreateModal onClose={onClose} onCreated={onCreated} />);

  fireEvent.change(screen.getByPlaceholderText("Enter Commission Tag"), {
    target: { value: "NewTag" },
  });
  fireEvent.change(screen.getByPlaceholderText("Enter Description"), {
    target: { value: "Test description" },
  });
  fireEvent.click(screen.getByLabelText(/Default Commission Scheme/i));
  fireEvent.click(screen.getByText("Save"));

  await waitFor(() => {
    expect(onCreated).toHaveBeenCalledWith(expect.objectContaining({ nameTag: "NewTag" }));
    expect(onClose).toHaveBeenCalled();
  });
});


  test("displays error message on API failure", async () => {
    const errorMessage = "Scheme with name 'DuplicateTag' already exists";
    mock.onPost("/api/v1/schemes").reply(409, errorMessage);

    render(<CommissionSchemeCreateModal onClose={onClose} onCreated={onCreated} />);

    fireEvent.change(screen.getByPlaceholderText("Enter Commission Tag"), {
      target: { value: "DuplicateTag" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
