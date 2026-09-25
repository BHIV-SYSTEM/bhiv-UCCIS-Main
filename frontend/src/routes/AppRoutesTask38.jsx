import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "../governance/Dashboard";
import Incidents from "../governance/Incidents";
import Escalations from "../governance/Escalations";
import Replay from "../governance/Replay";
import Evidence from "../governance/Evidence";
import Analytics from "../governance/Analytics";
import Observability from "../governance/Observability";
import RuntimeHealth from "../governance/RuntimeHealth";
import Domains from "../governance/Domains";
import Settings from "../governance/Settings";

export default function AppRoutesTask38() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/incidents" element={<Incidents />} />
      <Route path="/escalations" element={<Escalations />} />
      <Route path="/replay" element={<Replay />} />
      <Route path="/evidence" element={<Evidence />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/observability" element={<Observability />} />
      <Route path="/runtime" element={<RuntimeHealth />} />
      <Route path="/domains" element={<Domains />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}