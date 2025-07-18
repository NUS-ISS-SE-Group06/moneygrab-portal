import React, { useRef, useState } from "react";
import RateBoard from "../components/RateBoard";
import moolaLogo from "../assets/moola-logo.png";

const PreviewModal = ({ style, computedRates = [], onClose }) => {
  const modalRef = useRef(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, startX: 0, startY: 0, dragging: false });

  const startDrag = (e) => {
    e.preventDefault();
    setDrag((d) => ({ ...d, startX: e.clientX - d.x, startY: e.clientY - d.y, dragging: true }));
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    setDrag((d) => ({ ...d, x: e.clientX - d.startX, y: e.clientY - d.startY }));
  };

  const stopDrag = () => {
    setDrag((d) => ({ ...d, dragging: false }));
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        ref={modalRef}
        style={{
          position: "absolute",
          top: `calc(10% + ${drag.y}px)`,
          left: `calc(5% + ${drag.x}px)`,
          width: "90vw",
          maxHeight: "80vh",
          backgroundColor: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          onMouseDown={startDrag}
          style={{
            cursor: drag.dragging ? "grabbing" : "grab",
            padding: "10px 16px",
            borderBottom: "1px solid #ccc",
            userSelect: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <img src={moolaLogo} alt="Company Logo" style={{ height: 28 }} />
          </div>
          <div style={{ flexGrow: 1, textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
            Preview Rates - {style}
          </div>
          <div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: 20,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Table from RateBoard */}
        <div style={{ overflow: "auto", flex: 1 }}>
          <RateBoard
            style={style === "Multi Currency Style" ? "Normal Monitor - Multi Currency Style" : style}
            rates={computedRates}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
