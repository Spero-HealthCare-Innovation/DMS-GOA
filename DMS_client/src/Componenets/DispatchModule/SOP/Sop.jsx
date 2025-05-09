import { Grid, Box } from "@mui/material";
import SopTask from "../SOP/SopTask";
import CommentsPanel from "../SOP/CommentsPanel";
import IncidentDetails from "../SOP/IncidentDetails";
import { useLocation } from "react-router-dom";

function Sop({ darkMode, setDarkMode }) {
  const location = useLocation();
  const flag = location.state?.flag;

  console.log(flag, "flag");
  return (
    <>
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          backgroundColor: darkMode ? "#0a1929" : "#f5f5f5",
          minHeight: "100vh",
          transition:
            "background-color 0.5s ease-in-out, color 0.5s ease-in-out",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SopTask
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              flag={flag}
            />
          </Grid>

          {/* Wrap IncidentDetails and CommentsPanel side-by-side */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <IncidentDetails darkMode={darkMode} setDarkMode={setDarkMode} />
              </Grid>
              {/* <Grid item xs={12} md={3}>
                <CommentsPanel darkMode={darkMode} setDarkMode={setDarkMode} />
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Sop;
