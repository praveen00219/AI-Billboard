import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { reportApi } from "../../api/report.api";

export const useAiAnalysis = () => {
    const { reportId } = useParams();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['ai-analysis', reportId],
        queryFn: () => reportApi.getAiAnalysis(reportId),
        enabled: !!reportId,
    });

    return {
        loading: isLoading,
        error: error?.message,
        analysisData: data,
        getAiAnalysis: refetch,
        reportId
    };
};