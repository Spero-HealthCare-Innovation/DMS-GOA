import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);



export const AuthProvider = ({ children }) => {
  const port = import.meta.env.VITE_APP_API_KEY;
  const token = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");
  console.log(refresh, "refreshhhhhhhhh");

  const [newToken, setNewToken] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  console.log(districts, "districts");
  // const HERE_API_KEY = 'FscCo6SQsrummInzClxlkdETkvx5T1r8VVI25XMGnyY'
  const HERE_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  const [Tehsils, setTehsils] = useState([]);
  const [Citys, setCitys] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedTehsilId, setSelectedTehsilId] = useState("");
  const [selectedCityID, setSelectedCityId] = useState("");
  console.log(Citys, "selectedCityID");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lattitude, setLattitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  console.log(lattitude, longitude, "lattitude, longitude");

  const [departments, setDepartments] = useState([]);
  const [disaterid, setDisaterid] = useState(null);
  const [disasterIncident, setDisasterIncident] = useState(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState([15.298430295875988, 74.08868128835907]); // Default: Goa
  const [popupText, setPopupText] = useState('');
  console.log(disasterIncident, 'disasterIncident');
  // 🔹 sop page
  const [responderScope, setResponderScope] = useState([]);

  useEffect(() => {
    const disasterValue = disaterid || disasterIncident;
    console.log(disasterValue, 'passingValue');

    if (disasterValue) {
      fetchResponderScope(disasterValue);
    }
  }, [disaterid, disasterIncident]);

  const refreshAuthToken = async () => {
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) {
      console.warn("⚠️ No refresh token found.");
      return;
    }

    try {
      const response = await axios.post(`${port}/admin_web/login/refresh/`, {
        refresh: refresh,
      });

      if (response.data?.access) {
        const updatedToken = response.data.access;

        localStorage.setItem("access_token", updatedToken);
        setNewToken(updatedToken);
        console.log("✅ Access token refreshed");
      } else {
        console.warn("⚠️ No access token returned during refresh.");
      }
    } catch (error) {
      console.error("❌ Error refreshing access token:", error);
    }
  };

  useEffect(() => {
    refreshAuthToken();

    const interval = setInterval(() => {
      refreshAuthToken();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔹 1. Fetch all states on load
  const fetchStates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${port}/admin_web/state_get/`,
        {
          headers: {
            Authorization: `Bearer ${token || newToken}`,
          },
        }
      );
      setStates(res.data);
    } catch (err) {
      console.error("Error fetching states:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 2. Fetch districts based on selected state
  const fetchDistrictsByState = async (stateId) => {
    if (!stateId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${port}/admin_web/district_get_idwise/${stateId}/`,
        {
          headers: {
            Authorization: `Bearer ${token || newToken}`,
          },
        }
      );
      console.log(`Districts by state ${stateId}:`, res.data);
      setDistricts(res.data || []);
    } catch (err) {
      console.error("Error fetching districts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 3. Fetch tehsils based on selected district
  const fetchTehsilsByDistrict = async (districtId) => {
    if (!districtId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${port}/admin_web/Tahsil_get_idwise/${districtId}/`,
        {
          headers: {
            Authorization: `Bearer ${newToken || token}`,
          },
        }
      );
      console.log(`Tehsils by district ${districtId}:`, res.data);
      setTehsils(res.data || []);
    } catch (err) {
      console.error("Error fetching tehsils:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCitysByTehshil = async (tehshilId) => {
    if (!tehshilId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${port}/admin_web/City_get_idwise/${tehshilId}/`,
        {
          headers: {
            Authorization: `Bearer ${newToken || token}`,
          },
        }
      );
      console.log(`Tehsils by district ${tehshilId}:`, res.data);
      setCitys(res.data || []);
    } catch (err) {
      console.error("Error fetching tehsils:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResponderScope = async (disasterValue) => {
    if (!disasterValue) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${port}/admin_web/Responder_Scope_Get/${disasterValue}/`,
        {
          headers: {
            Authorization: `Bearer ${newToken || token}`,
          },
        }
      );
      console.log(res, 'resssssss');

      console.log("Responder Scope:", res.data);
      setResponderScope(res.data || []);
    } catch (err) {
      console.error("Error fetching responder scope:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 3) return;

    const response = await axios.get('https://autosuggest.search.hereapi.com/v1/autosuggest', {
      params: {
        apiKey: HERE_API_KEY,
        q: value,
        at: `${selectedPosition[0]},${selectedPosition[1]}`,
        limit: 5
      }
    });

    setSuggestions(response.data.items.filter(item => item.position));

  };

  const handleSelectSuggestion = async (item) => {
    const { position, address } = item;
    setSelectedPosition([position.lat, position.lng]);
    setLattitude(position.lat);
    setLongitude(position.lng);
    setPopupText(address.label);
    setQuery(address.label);
    setSuggestions([]);
  };

  // 🔹 Effects
  useEffect(() => {
    fetchStates();
  }, []);

  // 🔹 useEffect for selectedStateId change
  useEffect(() => {
    if (selectedStateId) {
      fetchDistrictsByState(selectedStateId);
      setSelectedDistrictId("");
      setSelectedTehsilId("");
      setSelectedCityId("");
      setTehsils([]);
      setCitys([]);
    } else {
      setDistricts([]);
      setTehsils([]);
      setCitys([]);
      setSelectedDistrictId("");
      setSelectedTehsilId("");
      setSelectedCityId("");
    }
  }, [selectedStateId]);

  // 🔹 useEffect for selectedDistrictId change
  useEffect(() => {
    if (selectedDistrictId) {
      fetchTehsilsByDistrict(selectedDistrictId);
      setSelectedTehsilId("");
      setSelectedCityId("");
      setCitys([]);
    } else {
      setTehsils([]);
      setCitys([]);
      setSelectedTehsilId("");
      setSelectedCityId("");
    }
  }, [selectedDistrictId]);

  // ✅ useEffect for selectedTehsilId change (fetch cities)
  useEffect(() => {
    if (selectedTehsilId) {
      fetchCitysByTehshil(selectedTehsilId);
      setSelectedCityId("");
    } else {
      setCitys([]);
      setSelectedCityId("");
    }
  }, [selectedTehsilId]);

  // DISASTER GET API
  const [disaster, setDisaster] = useState([]);
  useEffect(() => {
    const fetchDisaster = async () => {
      const disaster = await fetch(`${port}/admin_web/DMS_Disaster_Type_Get/`, {
        headers: {
          Authorization: `Bearer ${token || newToken}`,
        }
      })
      const disasterData = await disaster.json();
      setDisaster(disasterData);
    };
    fetchDisaster()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        states,
        districts,
        Tehsils,
        Citys,
        departments,
        selectedStateId,
        selectedDistrictId,
        selectedTehsilId,
        selectedCityID,
        setSelectedStateId,
        setSelectedDistrictId,
        setSelectedTehsilId,
        setSelectedCityId,
        loading,
        error,
        newToken,
        fetchResponderScope,
        disaterid,
        setDisaterid,
        responderScope,
        setResponderScope,
        disasterIncident,
        setDisasterIncident,
        handleSearchChange,
        handleSelectSuggestion,
        
        disaster,
        setDisaster,
        query,
        suggestions,
        selectedPosition,
        popupText,
        setPopupText
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
