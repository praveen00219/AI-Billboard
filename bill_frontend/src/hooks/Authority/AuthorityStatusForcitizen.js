import { authorityApiClient } from "../../api/apiClient";
import { useState } from "react";
import { useEffect } from "react";

export const GetAuthorityStatus = () => {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const GetFetchStatus = async () => {
      try {
        setLoading(true);
        const response = await authorityApiClient.get("/status/citizen-status");
        const data = response.data;
        console.log("API response 👉", data);

        if (data && Array.isArray(data.data)) {
          setStatus(data.data);
        } else {
          setStatus([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    GetFetchStatus();
  }, []);

  const total = status.length;
  const pending = status.filter((s) => s === "pending").length;
  const approved = status.filter((s) => s === "approved").length;
  const rejected = status.filter((s) => s === "rejected").length;

  const stats = { total, pending, approved, rejected };

  return { status, stats, loading };
};
