import { useState, useEffect } from "react";
import { ApiMethod } from "@/app/types/types";
import { apiCall } from "@/app/api/api-utils";
import { GAD7Score } from "@/app/types/dashboard";
import { getYbocsData } from "@/app/api/api-calls/get-ybocs";

export const useSymptomData = () => {
  const [scores, setScores] = useState(null);
  const [gad7Scores, setGAD7Scores] = useState<GAD7Score[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ybocsData, gad7Data] = await Promise.all([
          getYbocsData(),
          getGAD7Data(),
        ]);
        setScores(ybocsData);
        setGAD7Scores(gad7Data);
      } catch (error) {
        console.error("Failed to fetch scores:", error);
        setError("Failed to load symptom data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGAD7Data = async (): Promise<GAD7Score[]> => {
    try {
      return await apiCall("/assessments/gad7/", ApiMethod.Get, "fetch GAD7 scores");
    } catch (error) {
      throw new Error("Failed to fetch GAD7 scores");
    }
  };

  return { scores, gad7Scores, loading, error };
};
