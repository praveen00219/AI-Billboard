import { useEffect, useState } from "react";
import { authorityApiClient } from "../../api/apiClient";

export const AllCitizens = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCitizens = async () => {
    try {
      setLoading(true);
      const response = await authorityApiClient.get("/authority/getalluser-for-authority");
      const data = response.data;

      if (data.status && data.users) {
        setCitizens(data.users);
      } else {
        setCitizens([]);
      }
    } catch (err) {
      console.error("Fetch citizens error:", err);
      setError("Failed to fetch citizens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  return { citizens, loading, error, refetch: fetchCitizens };
};
