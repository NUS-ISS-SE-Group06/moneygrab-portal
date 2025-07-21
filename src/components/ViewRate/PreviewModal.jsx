import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import RateBoard from "./RateBoard";
import moolaLogo from "../../assets/moola-logo.png";

const PreviewModal = ({ style, computedRates = [], isOpen, onClose }) => {
  const dialogRef = useRef(null);
  const headerRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPosition({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }
    };

    const handleMouseUp = () => setDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const handleDragStart = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      headerRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      open
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "95%",
        maxWidth: "90vw",
        maxHeight: "90vh",
        border: "none",
        padding: 0,
        zIndex: 1000,
        cursor: dragging ? "grabbing" : "default",
      }}
      className="shadow-lg rounded bg-white overflow-auto"
      aria-labelledby="previewModalTitle"
    >
      <div
        ref={headerRef}
        className="bg-gray-100 border-b flex justify-between items-center p-2 cursor-move"
        onMouseDown={handleDragStart}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Draggable modal header"
      >
        <div className="flex items-center space-x-2">
          <img src={moolaLogo} alt="Moola Logo" className="w-8 h-8" />
          <h2 id="previewModalTitle" className="text-lg font-semibold">
            Preview Rates - {style}
          </h2>
        </div>
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="text-gray-700 text-lg font-bold px-2 hover:text-red-500"
        >
          ✕
        </button>
      </div>
      <div className="p-2">
        <RateBoard rates={computedRates} style={style} />
      </div>
    </dialog>
  );
};

PreviewModal.propTypes = {
  style: PropTypes.string.isRequired,
  computedRates: PropTypes.arrayOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PreviewModal;
