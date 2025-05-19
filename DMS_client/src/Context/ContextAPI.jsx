import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  console.log(districts, "districts");

  const [selectedStateId, setSelectedStateId] = useState(null);
  const [Tehsils, setTehsils] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedTehsilId, setSelectedTehsilId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const port = import.meta.env.VITE_APP_API_KEY;
  const token = localStorage.getItem("access_token");

  // 🔹 1. Fetch all states on load
  const fetchStates = async () => {
    try {
      const res = await axios.get(`${port}/admin_web/state_get/`);
      setStates(res.data);
    } catch (err) {
      setError(err);
    }
  };

  // 🔹 2. Fetch districts based on selected state
  const fetchDistrictsByState = async (stateId) => {
    if (!stateId) return;
    try {
      const res = await axios.get(
        `${port}/admin_web/state_get_idwise/${stateId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDistricts(res.data || []); // Adjust based on API response structure
      console.log(res.data, "res.data");
    } catch (err) {
      setError(err);
    }
  };

  const fetchDistrictIDWise = async (stateId) => {
    if (!stateId) return;
    try {
      const res = await axios.get(
        `${port}/admin_web/district_get_idwise/${stateId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Districts by state ${stateId}:`, res.data);
      setDistricts(res.data || []); // ✅ Make sure this matches your response format
    } catch (err) {
      console.error("Error fetching district by ID:", err);
      setError(err);
    }
  };

  useEffect(() => {
    if (selectedStateId) {
      fetchDistrictIDWise(selectedStateId);
    } else {
      setDistricts([]);
    }
  }, [selectedStateId]);

  const fetchTehsilsByDistrict = async (DistID) => {
    if (!DistID) return;
    try {
      const res = await axios.get(`${port}/admin_web/Tahsil_get/${DistID}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`tehsile by state ${DistID}:`, res.data);
      setTehsils(res.data || []);
      console.log(res.data, "resdata");
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    if (selectedDistrictId) {
      fetchTehsilsByDistrict(selectedDistrictId);
    } else {
      setTehsils([]); // clear if no state selected
    }
  }, [selectedDistrictId]);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedStateId) {
      fetchDistrictsByState(selectedStateId);
    } else {
      setDistricts([]); // clear if no state selected
    }
  }, [selectedStateId]);

  return (
    <AuthContext.Provider
      value={{
        states,
        districts,
        selectedDistrictId,
        selectedStateId,
        Tehsils,
        setSelectedStateId,
        loading,
        error,
        setSelectedDistrictId,
        setSelectedTehsilId,
        // selectedDistrictId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
