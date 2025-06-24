import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MoneyChangerList from "../MoneyChangerList";
import axios from "../../../api/axios"; // Your custom axios instance

jest.mock("../../../api/axios");

describe("MoneyChangerList", () => {
  const mockData = [
    {
      id: 1,
      companyName: "Company A",
      email: "a@example.com",
      uen: "UEN-A",
      dateOfIncorporation: "2020-01-01",
      schemeId: 1,
      country: "Singapore",
    },
    {
      id: 2,
      companyName: "Company B",
      email: "b@example.com",
      uen: "UEN-B",
      dateOfIncorporation: "2020-02-01",
      schemeId: 2,
      country: "Singapore",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders list of money changers", async () => {
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<MoneyChangerList />);

    expect(await screen.findByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Company B")).toBeInTheDocument();
  });

  test("deletes a money changer", async () => {
    // Initial GET with both companies
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<MoneyChangerList />);

    // Ensure data is loaded
    expect(await screen.findByText("Company A")).toBeInTheDocument();

    // Confirm mock
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    // DELETE response
    axios.delete.mockResolvedValueOnce({ status: 204 });

    // New GET after deletion (only Company B remains)
    axios.get.mockResolvedValueOnce({
      data: [mockData[1]],
    });

    // Click delete
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Company A")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Company B")).toBeInTheDocument();
  });
});