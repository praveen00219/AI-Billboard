import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/auth.api";

export const useGetCitizenInfo = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['citizen-info'],
    queryFn: () => authApi.getMe(),
    enabled: localStorage.getItem("isauth") === "true",
  });

  return { 
    getCitizenData: refetch, 
    citizen: data?.user, 
    loading: isLoading, 
    error: error?.message 
  };
};
