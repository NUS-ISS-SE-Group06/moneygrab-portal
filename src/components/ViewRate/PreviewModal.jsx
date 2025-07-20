import React, { useEffect, useRef, useState } from "react";
import RateBoard from "./RateBoard";
import moolaLogo from "../../assets/moola-logo.png";

const PreviewModal = ({ style = "Normal Monitor Style", computedRates = [], onClose }) => {
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [relX, setRelX] = useState(0);
  const [relY, setRelY] = useState(0);
  const [modalPosition, setModalPosition] = useState({ x: 100, y: 100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setModalPosition({
        x: e.clientX - relX,
        y: e.clientY - relY,
      });
    };

    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, relX, relY]);

  const handleMouseDown = (e) => {
    const rect = modalRef.current?.getBoundingClientRect();
    if (rect) {
      setRelX(e.clientX - rect.left);
      setRelY(e.clientY - rect.top);
      setDragging(true);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        left: `${modalPosition.x}px`,
        top: `${modalPosition.y}px`,
        width: "85%",
        height: "auto",
        maxHeight: "90%",
        zIndex: 1000,
      }}
    >
      <div
        ref={modalRef}
        className="bg-white shadow-xl rounded-xl border border-gray-400 w-full flex flex-col overflow-hidden"
      >
        {/* Header with logo and close button */}
        <div
          className="cursor-move bg-gray-100 px-4 py-2 flex justify-between items-center"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-3">
            <img src={moolaLogo} alt="Company Logo" style={{ height: 28 }} />
            <h2 className="text-xl font-bold">Preview Rates - {style}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-700 hover:text-red-500 font-bold text-lg"
            aria-label="Close Preview Modal"
          >
            ✕
          </button>
        </div>

        {/* Rate table */}
        <div className="overflow-auto p-2 bg-white max-h-[75vh]">
          <RateBoard style={style} rates={computedRates} />
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;