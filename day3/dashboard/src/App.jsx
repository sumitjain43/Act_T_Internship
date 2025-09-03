import React from "react";
import { Routes } from "react-router-dom";
import Dashboard from "./components/Dasboard";
import { Route } from "react-router-dom";
import Customers from "./pages/Custom";
import Setting from "./pages/Setting";

function App() {
  return (
    <Routes>
      <Route path="" element={<Dashboard/>}/>
      <Route path="/customers" element={<Customers/>}/>
      <Route path="/settings" element={<Setting/>}/>
    </Routes>
  );
}

export default App;