import React from "react";
import LayoutWithResizableSidebar from "./components/sidebar";
import ManageAccounts from "./ManageAccounts"; // or your own content
import Commission from "./pages/Commission"; // Adjust the import path as necessary

function App() {
  return (
    <LayoutWithResizableSidebar>
      <ManageAccounts />
    </LayoutWithResizableSidebar>
  );
}

export default App;
