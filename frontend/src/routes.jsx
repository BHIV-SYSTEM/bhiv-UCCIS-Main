import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import EscalationView from "./pages/EscalationView";
import FieldExecution from "./pages/FieldExecution";
import ReplayView from "./pages/ReplayView";
import AISDashboard from "./pages/AISDashboard";

function RoutesPage() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/ais" element={<AISDashboard />} />
      <Route path="/escalation" element={<EscalationView />} />
      <Route path="/execution" element={<FieldExecution />} />
      <Route path="/replay" element={<ReplayView />} />

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

      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}

export default RoutesPage;
