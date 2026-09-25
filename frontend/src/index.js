import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AISDashboard from "./pages/AISDashboard";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ais" element={<AISDashboard />} />

        {/* Task 13 Phase Routes */}
        <Route path="/phase/replay" element={<Dashboard />} />
        <Route path="/phase/concurrency" element={<Dashboard />} />
        <Route path="/phase/corruption" element={<Dashboard />} />
        <Route path="/phase/lineage" element={<Dashboard />} />
        <Route path="/phase/enforcement" element={<Dashboard />} />
        <Route path="/phase/field" element={<Dashboard />} />
        <Route path="/phase/stability" element={<Dashboard />} />
        <Route path="/phase/governance" element={<Dashboard />} />
        <Route path="/phase/failure" element={<Dashboard />} />
        <Route path="/phase/final" element={<Dashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
