import { useState, useEffect } from "react";
import { API_URL, TokenService } from "@/app/api/auth";
import { OCDItem, Subtype } from "@/app/types/dashboard";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

interface Exposure {
  id: string;
  description: string;
  subtype: string | null;
  discomfort?: number;
}

export const useOCDData = () => {
  const [obsessions, setObsessions] = useState<OCDItem[]>([]);
  const [compulsions, setCompulsions] = useState<OCDItem[]>([]);
  const [subtypes, setSubtypes] = useState<Subtype[]>([]);
  const [exposures, setExposures] = useState<Exposure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          obsessionsResponse,
          compulsionsResponse,
          subtypesResponse,
          exposuresResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/ocd/obsessions/`, {
            headers: {
              Authorization: `Token ${TokenService.getToken()}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${API_URL}/ocd/compulsions/`, {
            headers: {
              Authorization: `Token ${TokenService.getToken()}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${API_URL}/ocd/subtypes/`, {
            headers: {
              Authorization: `Token ${TokenService.getToken()}`,
              "Content-Type": "application/json",
            },
          }),
          apiCall("/exposures/hierarchy", ApiMethod.Get, "fetch hierarchy"),
        ]);

        const obsessionsData = await obsessionsResponse.json();
        const compulsionsData = await compulsionsResponse.json();
        const subtypesData = await subtypesResponse.json();
        const exposuresData = exposuresResponse || [];

        setObsessions(obsessionsData);
        setCompulsions(compulsionsData);
        setSubtypes(subtypesData);
        setExposures(exposuresData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateSubtypes = (newSubtype: Subtype) => {
    setSubtypes((prev) => [...prev, newSubtype]);
  };

  const deleteSubtype = (id: number) => {
    setSubtypes((prev) => prev.filter((subtype) => subtype.id !== id));
  };

  const editSubtype = (id: number, newName: string) => {
    setSubtypes((prev) =>
      prev.map((subtype) =>
        subtype.id === id ? { ...subtype, name: newName } : subtype
      )
    );
  };

  const updateCompulsions = (newCompulsion: OCDItem) => {
    setCompulsions((prev) => [...prev, newCompulsion]);
  };

  const deleteCompulsion = (id: number) => {
    setCompulsions((prev) => prev.filter((compulsion) => compulsion.id !== id));
  };

  const updateObsessions = (newObsession: OCDItem) => {
    setObsessions((prev) => [...prev, newObsession]);
  };

  const deleteObsession = (id: number) => {
    setObsessions((prev) => prev.filter((obsession) => obsession.id !== id));
  };

  const updateExposures = (newExposure: Exposure) => {
    setExposures((prev) => [...prev, newExposure]);
  };

  const deleteExposure = (id: string) => {
    setExposures((prev) => prev.filter((exposure) => exposure.id !== id));
  };

  const editObsession = (id: number, description: string, subtypeId: number | null) => {
    setObsessions((prev) =>
      prev.map((obsession) =>
        obsession.id === id
          ? { ...obsession, description, subtype: subtypeId?.toString() || null }
          : obsession
      )
    );
  };

  const editCompulsion = (id: number, description: string, subtypeId: number | null) => {
    setCompulsions((prev) =>
      prev.map((compulsion) =>
        compulsion.id === id
          ? { ...compulsion, description, subtype: subtypeId?.toString() || null }
          : compulsion
      )
    );
  };

  const editExposure = (id: string, description: string, subtypeId: number | null, discomfort?: number) => {
    setExposures((prev) =>
      prev.map((exposure) =>
        exposure.id === id
          ? {
            ...exposure,
            description,
            subtype: subtypeId?.toString() || null,
            discomfort: discomfort !== undefined ? discomfort : exposure.discomfort
          }
          : exposure
      )
    );
  };

  return {
    obsessions,
    compulsions,
    subtypes,
    exposures,
    loading,
    error,
    updateSubtypes,
    deleteSubtype,
    editSubtype,
    updateCompulsions,
    deleteCompulsion,
    updateObsessions,
    deleteObsession,
    updateExposures,
    deleteExposure,
    editObsession,
    editCompulsion,
    editExposure,
  };
};
