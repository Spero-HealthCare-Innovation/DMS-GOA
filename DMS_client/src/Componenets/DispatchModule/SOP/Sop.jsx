import { Grid, Box } from "@mui/material";
import SopTask from "../SOP/SopTask";
import IncidentDetails from "../SOP/IncidentDetails";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Sop({ darkMode, setDarkMode }) {

  useEffect(() => {
    document.title = "DMS|Sop";
  }, []);
  const location = useLocation();
  const flagFromState = location?.state?.triggerStatus ?? 0;
  console.log(flagFromState, 'flagFromState');

  const [flag, setFlag] = useState(flagFromState);
  const [selectedIncident, setSelectedIncident] = useState(null);

  return (
    <Box
  sx={{
    ml: { xs: -1.5, sm: -2, md: -3 }, 
    pr: { xs: 2, sm: 3, md: 4 },      
    py: { xs: 2, sm: 3 },
      mx: 0, // No left/right margin
    px: 0, // No horizontal padding
    backgroundColor: darkMode ? "#0a1929" : "#f5f5f5",
    minHeight: "100vh",
    transition: "background-color 0.5s ease-in-out, color 0.5s ease-in-out",
      // Scrollbar styling
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: darkMode ? '#1e293b' : '#e0e0e0',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: darkMode ? '#4b5563' : '#9e9e9e',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: darkMode ? '#6b7280' : '#757575',
    },
  }}
>
      <Grid container spacing={2}>
        <Grid item xs={12} >
          <SopTask
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            flag={flag}
            setFlag={setFlag}
            setSelectedIncident={setSelectedIncident}
          />
        </Grid>

        {/* Always render IncidentDetails */}
        <Grid item xs={12}>
          <IncidentDetails
            darkMode={darkMode}
            flag={flag}
            setFlag={setFlag}
            selectedIncident={selectedIncident}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Sop;
