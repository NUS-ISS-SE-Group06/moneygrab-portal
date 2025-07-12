import React, {useState, useEffect, useCallback } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import LogoutButton from "./Auth/LogoutButton";
import MoolaLogo from "../assets/moola-logo.png"

const navItems = [
  { label: "Account", path: "/account" },
  { label: "Money Changer", path: "/money-changer" },
  { label: "FX Rate Upload", path: "/fx-rate-upload" },
  { label: "Commission", path: "/commission" },
  { label: "Currency", path: "/currency" },
  { label: "Compute Rates", path: "/compute-rates" },
  { label: "View Rates", path: "/view-rates" },
  { label: "Currency Codes", path: "/currency-codes" },
  { label: "Transactions", path: "/transaction" }
];

function Sidebar({ width }) {
  const location = useLocation();

  return (
    <aside
      className="bg-white border-r px-4 py-6 h-screen flex flex-col"
      style={{ width, minWidth: 160, maxWidth: 360, transition: "width 0.1s" }}
    >
      {/* Header */}
      <div className="flex items-center space-x-2  mb-10">
         <img
          src={MoolaLogo}
          alt="MoolaFX Logo"
          className="h-10 w-auto"
        />
           <span className="font-bold text-lg">MoneyGrab</span>
      </div>
      
      {/* Navigation - flex-1 makes this section take up remaining space */}
      <nav className="space-y-2 text-gray-700 flex-1">
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
      
      {/* Logout Button - positioned at bottom */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </aside>
  );
}

export default function LayoutWithResizableSidebar() {
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = () => setDragging(true);

  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    document.body.style.userSelect = "none";
    const newWidth = e.clientX;
    if (newWidth >= 160 && newWidth <= 360) setSidebarWidth(newWidth);
  }, [dragging]);

  const onMouseUp = useCallback(() => {
    setDragging(false);
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar width={sidebarWidth} />
      <div
        className="w-2 cursor-ew-resize bg-gray-200 hover:bg-blue-300 transition"
        onMouseDown={onMouseDown}
        style={{ zIndex: 10, userSelect: "none" }}
      />
      <main className="flex-1 p-10 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}