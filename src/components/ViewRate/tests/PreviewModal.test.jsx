import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PreviewModal from "../PreviewModal";

const mockRates = [
  {
    currencyCode: "USD",
    unit: "1",
    rateValues: {
      buyRate: 1.9999,
      sellRate: 2.2222,
      rtAsk: 2.0001,
    },
  },
  {
    currencyCode: "EUR",
    unit: "1",
    rateValues: {
      buyRate: 3.3333,
      sellRate: 4.4444,
    },
  },
];

describe("PreviewModal", () => {
  it("renders Normal Monitor Style correctly", () => {
    render(
      <PreviewModal
        isOpen={true}
        style="Normal Monitor Style"
        computedRates={mockRates}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText(/Normal Monitor Style/)).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("EUR")).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("1.9999"))).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes("2.2222"))).toBeInTheDocument();
  });

  it("renders Extended Monitor Style correctly", () => {
    render(
      <PreviewModal
        isOpen={true}
        style="Extended Monitor Style"
        computedRates={mockRates}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText(/Extended Monitor Style/)).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("EUR")).toBeInTheDocument();
  });

  it("renders Multi Currency Style correctly", () => {
    render(
      <PreviewModal
        isOpen={true}
        style="Normal Monitor - Multi Currency Style"
        computedRates={mockRates}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("EUR")).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    render(
      <PreviewModal
        isOpen={false}
        style="Normal Monitor Style"
        computedRates={mockRates}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByText("USD")).not.toBeInTheDocument();
    expect(screen.queryByText("EUR")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(
      <PreviewModal
        isOpen={true}
        style="Normal Monitor Style"
        computedRates={mockRates}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalled();
  });

  it("drag events do not crash", () => {
    render(
      <PreviewModal
        isOpen={true}
        style="Normal Monitor Style"
        computedRates={mockRates}
        onClose={jest.fn()}
      />
    );

    const header = screen.getByRole("button", { name: /draggable modal header/i });
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });
    fireEvent.mouseUp(document);
  });
});
