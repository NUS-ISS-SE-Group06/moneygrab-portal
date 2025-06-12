import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

const navItems = [
  { label: "Account", path: "/account" },
  { label: "Money Changer", path: "/money-changer" },
  { label: "FX Rate Upload", path: "/fx-rate-upload" },
  { label: "Commission", path: "/commission" },
  { label: "Currency", path: "/currency" },
  { label: "Compute Rates", path: "/compute-rates" },
  { label: "View Rates", path: "/view-rates" },
  { label: "Currency Codes", path: "/currency-codes" },
  { label: "Transactions", path: "/transactions" }
];

function Sidebar({ width }) {
  const location = useLocation();

  return (
    <aside
      className="bg-white border-r px-4 py-6 h-screen"
      style={{ width, minWidth: 160, maxWidth: 360, transition: "width 0.1s" }}
    >
      <div className="flex items-center mb-10">
        <span className="font-bold text-lg">MoneyGrab</span>
      </div>
      <nav className="space-y-2 text-gray-700">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded transition
              ${location.pathname === item.path
                ? "bg-green-600 text-white font-semibold outline outline-2 outline-blue-400"
                : "hover:bg-green-100 hover:text-green-700"}`}
            style={{ cursor: "pointer" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function LayoutWithResizableSidebar() {
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = () => setDragging(true);

  const onMouseMove = (e) => {
    if (!dragging) return;
    document.body.style.userSelect = "none";
    const newWidth = e.clientX;
    if (newWidth >= 160 && newWidth <= 360) setSidebarWidth(newWidth);
  };

  const onMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar width={sidebarWidth} />
      {/* Drag handle */}
      <div
        className="w-2 cursor-ew-resize bg-gray-200 hover:bg-blue-300 transition"
        onMouseDown={onMouseDown}
        style={{ zIndex: 10, userSelect: "none" }}
      />
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
