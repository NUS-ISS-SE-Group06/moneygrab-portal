import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import RateBoard from "./RateBoard";

const PreviewModal = ({ style, computedRates = [], onClose }) => {
  const modalRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const handleMouseDown = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      role="dialog"
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start justify-start"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={modalRef}
        className="bg-white border rounded shadow-lg w-[95%] max-w-[90vw] max-h-[90vh] overflow-auto"
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          className="bg-gray-100 p-2 border-b cursor-move flex justify-between items-center"
        >
          <h2 className="text-lg font-semibold">Preview Rates - {style}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-700 text-lg font-bold px-2 hover:text-red-500"
          >
            ✕
          </button>
        </div>
        <div className="p-2">
          <RateBoard rates={computedRates} style={style} />
        </div>
      </div>
    </div>
  );
};

PreviewModal.propTypes = {
  style: PropTypes.string.isRequired,
  computedRates: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PreviewModal;

