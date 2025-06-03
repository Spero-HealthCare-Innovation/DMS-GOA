import { Grid, Box } from "@mui/material";
import SopTask from "../SOP/SopTask";
import IncidentDetails from "../SOP/IncidentDetails";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../Context/ContextAPI";
import CaseClosureDetails from "./CaseClosureDetails";

function Sop({ darkMode, setDarkMode }) {
  // initStorageLogoutSync.js
  window.addEventListener("storage", (e) => {
    if (e.key === "logout") {
      location.href = "/login";
    }
  });

  useEffect(() => {
    document.title = "DMS|Sop";
  }, []);
  const location = useLocation();
  const flagFromState = location?.state?.triggerStatus ?? 0;
  console.log(flagFromState, "flagFromState");

  const [flag, setFlag] = useState(flagFromState);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const { responderScope, fetchResponderScope } = useAuth();
  const { setDisaterid } = useAuth();
  const [viewmode, setViewmode] = useState("incident");
  console.log(viewmode, "viewmode");

  useEffect(() => {
    if (selectedIncident?.disaster_id_id) {
      console.log(
        "Setting disaster id in context:",
        selectedIncident.disaster_id_id
      );
      setDisaterid(selectedIncident.disaster_id_id);

      // Pass the ID to fetchResponderScope
      fetchResponderScope(selectedIncident.disaster_id_id);
    }
  }, [selectedIncident]);

  console.log(selectedIncident?.disaster_id_id, "selectedIncident");

  return (
    <Box
      sx={{
        ml: { xs: 2.5 },
        pr: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        mx: 0, // No left/right margin
        px: 0, // No horizontal padding
        backgroundColor: darkMode ? "#0a1929" : "#f5f5f5",
        minHeight: "100vh",
        transition: "background-color 0.5s ease-in-out, color 0.5s ease-in-out",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SopTask
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            flag={flag}
            setFlag={setFlag}
            setSelectedIncident={setSelectedIncident}
            setViewmode={setViewmode}
          />
        </Grid>

        {/* Always render IncidentDetails */}
        
         {viewmode !== "closure" ? (
          <Grid item xs={12}>
            <IncidentDetails
              darkMode={darkMode}
              flag={flag}
              setFlag={setFlag}
              selectedIncident={selectedIncident}
              responderScope={responderScope}
              fetchResponderScope={fetchResponderScope}
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <CaseClosureDetails
              darkMode={darkMode}
              flag={flag}
              setFlag={setFlag}
              selectedIncident={selectedIncident}
              responderScope={responderScope}
              fetchResponderScope={fetchResponderScope}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Sop;
