import { useState } from "react";
import { authorityApiClient } from "../../api/apiClient";

export const useGetAuthorityInfo = () => {
  const [loading, setLoading] = useState(false);
  const [authority, setAuthority] = useState(null);
  const [error, setError] = useState("");

  const getTheData = async () => {
    setLoading(true);
    setError("");
    try {
      // Correct endpoint: /api/auth/authorityAuth-info
      const response = await authorityApiClient.get("/auth/authorityAuth-info");
      const data = response.data;

      if (data.success && data.authority) {
        setAuthority(data.authority);
        return { success: true, authority: data.authority };
      }

      throw new Error("Unexpected response shape");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch authority info";
      console.error("Authority fetch error:", msg);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { getTheData, authority, loading, error };
};
