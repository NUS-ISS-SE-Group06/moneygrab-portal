import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import api from "../../../api/axios"; // ✅ Your custom instance
import MoneyChangerList from "../MoneyChangerList";

// Use the same axios instance used in the component
const mock = new MockAdapter(api, { delayResponse: 0 });

describe("MoneyChangerList", () => {
  beforeEach(() => {
    mock.reset();

    mock.onGet("/api/v1/money-changers").reply(200, [
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
    ]);
  });

  test("renders list of money changers", async () => {
    render(<MoneyChangerList />);

    expect(await screen.findByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Company B")).toBeInTheDocument();
  });

test("deletes a money changer", async () => {
  render(<MoneyChangerList />);

  // Ensure data is loaded
  expect(await screen.findByText("Company A")).toBeInTheDocument();

  // Confirm mock
  jest.spyOn(window, "confirm").mockImplementation(() => true);

  // Set DELETE mock
  mock.onDelete("/api/v1/money-changers/1").reply(204);

  // ⬇️ Mock the refreshed GET after deletion (only Company B remains)
  mock.onGet("/api/v1/money-changers").reply(200, [
    {
      id: 2,
      companyName: "Company B",
      email: "b@example.com",
      uen: "UEN-B",
      dateOfIncorporation: "2020-02-01",
      schemeId: 2,
      country: "Singapore",
    },
  ]);

  const deleteButtons = screen.getAllByText("Delete");
  fireEvent.click(deleteButtons[0]); // Delete Company A

  await waitFor(() => {
    expect(screen.queryByText("Company A")).not.toBeInTheDocument();
  });

  expect(screen.getByText("Company B")).toBeInTheDocument();
});
test("deletes a money changer", async () => {
  render(<MoneyChangerList />);

  // Ensure data is loaded
  expect(await screen.findByText("Company A")).toBeInTheDocument();

  // Confirm mock
  jest.spyOn(window, "confirm").mockImplementation(() => true);

  // Set DELETE mock
  mock.onDelete("/api/v1/money-changers/1").reply(204);

  // ⬇️ Mock the refreshed GET after deletion (only Company B remains)
  mock.onGet("/api/v1/money-changers").reply(200, [
    {
      id: 2,
      companyName: "Company B",
      email: "b@example.com",
      uen: "UEN-B",
      dateOfIncorporation: "2020-02-01",
      schemeId: 2,
      country: "Singapore",
    },
  ]);

  const deleteButtons = screen.getAllByText("Delete");
  fireEvent.click(deleteButtons[0]); // Delete Company A

  await waitFor(() => {
    expect(screen.queryByText("Company A")).not.toBeInTheDocument();
  });

  expect(screen.getByText("Company B")).toBeInTheDocument();
});

});
