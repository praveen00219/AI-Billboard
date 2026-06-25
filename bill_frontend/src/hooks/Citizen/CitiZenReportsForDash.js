import { useQuery } from "@tanstack/react-query";
import { reportApi } from "../../api/report.api";
import { useState, useEffect } from "react";

export const CitizenReportsForDash = (authenticated) => {
  const [userName, setUserName] = useState("User");

  const {
    data,
    isLoading: loading,
    error,
    refetch: fetchReports,
  } = useQuery({
    queryKey: ["citizenReports"],
    queryFn: () => reportApi.getAuthReporting(),
    enabled: !!authenticated,
  });

  const reports = data?.reports || [];
  
  // Calculate stats from data
  const stats = {
    totalReports: reports.length,
    pendingReports: reports.filter((r) => r.status === "pending").length,
    approvedReports: reports.filter((r) => r.status === "approved").length,
    rejectedReports: reports.filter((r) => r.status === "rejected").length,
    myReports: reports.length,
  };

  useEffect(() => {
    if (data?.reports?.[0]?.userName) {
      setUserName(data.reports[0].userName);
    }
  }, [data]);

  return { reports, stats, loading, error: error?.message, userName, fetchReports };
};