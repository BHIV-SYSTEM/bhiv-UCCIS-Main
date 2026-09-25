import api from "./api";

export const getAnalytics =
  async () => {

    const telemetry =
      await api.get("/telemetry");

    const incidents =
      await api.get("/incidents");

    const escalations =
      await api.get("/escalations");

    return {
      telemetry: telemetry.data,
      incidents: incidents.data,
      escalations: escalations.data
    };
  };