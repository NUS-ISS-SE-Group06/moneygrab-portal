import React from "react";
import LayoutWithResizableSidebar from "./components/sidebar";
import ManageAccounts from "./ManageAccounts"; // or your own content

function App() {
  return (
    <LayoutWithResizableSidebar>
      <ManageAccounts />
    </LayoutWithResizableSidebar>
  );
}

export default App;