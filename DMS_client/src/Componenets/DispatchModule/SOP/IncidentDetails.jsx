import {
  Paper,
  Grid,
  Typography,
  Box,
  Stack,
  Checkbox,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import CommentsPanel from "./CommentsPanel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useAuth } from "../../../Context/ContextAPI";

function IncidentDetails({
  darkMode,
  flag,
  setFlag,
  selectedIncident,
  responderScope,
}) {
  window.addEventListener("storage", (e) => {
    if (e.key === "logout") {
      location.href = "/login";
    }
  });

  console.log(responderScope, "responderScope in IncidentDetails");

  const { disaterid } = useAuth();
  console.log(disaterid, "wwwwwwwwwwww");

  const labelColor = darkMode ? "#5FECC8" : "#1976d2";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const borderColor = darkMode ? "#7F7F7F" : "#ccc";
  const fontFamily = "Roboto, sans-serif";

  const boxStyle = {
    mb: 2,
    pb: 1.5,
    borderBottom: `1px solid ${borderColor}`,
  };

  const renderText = (label, value) => (
    <Box sx={boxStyle}>
      <Typography sx={{ color: labelColor, fontWeight: 500, fontFamily }}>
        {label}
      </Typography>
      {selectedIncident ? (
        <Typography variant="subtitle2" sx={{ fontFamily }}>
          {value || "N/A"}
        </Typography>
      ) : (
        <Skeleton variant="text" width={100} height={24} />
      )}
    </Box>
  );

  return (
    <>
      <Typography variant="h6" color={labelColor} sx={{ fontFamily }}>
        Rules
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: darkMode ? "#0a1929" : "#fff",
          color: textColor,
          transition: "all 0.3s ease",
        }}
      >
        <Grid container>
          {/* Left Column */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              borderRight: { md: `1px solid ${borderColor}` },
              pr: { md: 2 },
              mb: { xs: 2, md: 0 },
            }}
          >
            {flag === 1 ? (
              <>
                {renderText("Alert ID", selectedIncident?.pk_id)}
                {renderText("Disaster Id", selectedIncident?.disaster_id_id)}
                {renderText("Disaster Type", selectedIncident?.disaster_name)}
              </>
            ) : (
              <>
                {renderText("Incident ID", selectedIncident?.IncidentId)}
                {renderText("Incident Type", selectedIncident?.disasterType)}
                {renderText("Alert Type", selectedIncident?.disasterType)}
              </>
            )}
          </Grid>

          {/* Middle Column */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              borderRight: { md: `1px solid ${borderColor}` },
              px: { md: 2 },
              mb: { xs: 2, md: 0 },
            }}
          >
            {flag === 1 ? (
              <>
                <Box sx={boxStyle}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                  >
                    Response Procedure
                  </Typography>
                  {responderScope?.sop_responses?.length > 0 ? (
                    <Typography variant="subtitle2" sx={{ fontFamily }}>
                      {responderScope.sop_responses[0].sop_description}
                    </Typography>
                  ) : (
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <InfoOutlinedIcon color="disabled" />
                      <Typography variant="subtitle2" sx={{ fontFamily }}>
                        Response procedure data not available.
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                  >
                    Responder Scope
                  </Typography>
                  {responderScope?.responder_scope?.length > 0 ? (
                    <Stack spacing={1} mt={1}>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {responderScope.responder_scope.map(
                          ({ pk_id, responder_name }) => (
                            <FormControlLabel
                              key={pk_id}
                              control={
                                <Checkbox
                                  defaultChecked
                                  sx={{ color: labelColor }}
                                />
                              }
                              label={
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontFamily }}
                                >
                                  {responder_name}
                                </Typography>
                              }
                            />
                          )
                        )}
                      </Box>
                    </Stack>
                  ) : (
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <InfoOutlinedIcon color="disabled" />
                      <Typography variant="subtitle2" sx={{ fontFamily }}>
                        Responder scope data not available.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <>
                {/* Different UI if flag !== 1 (optional) or repeat same */}
                <Box sx={boxStyle}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                  >
                    Response Procedure
                  </Typography>
                  {selectedIncident ? (
                    <Typography variant="subtitle2" sx={{ fontFamily }}>
                      {selectedIncident.responseProcedure ||
                        "No response procedure available."}
                    </Typography>
                  ) : (
                    <Skeleton variant="text" width="60%" height={24} />
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                  >
                    Responding Units
                  </Typography>
                  {selectedIncident ? (
                    <Stack spacing={1} mt={1}>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {["Health", "Rescue", "NGOs", "Local Bodies"].map(
                          (label) => (
                            <FormControlLabel
                              key={label}
                              control={
                                <Checkbox
                                  defaultChecked
                                  sx={{ color: labelColor }}
                                />
                              }
                              label={
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontFamily }}
                                >
                                  {label}
                                </Typography>
                              }
                            />
                          )
                        )}
                      </Box>
                    </Stack>
                  ) : (
                    <Skeleton variant="rectangular" height={60} width="100%" />
                  )}
                </Box>
              </>
            )}
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={5} pl={{ md: 2 }}>
            {selectedIncident ? (
              <CommentsPanel darkMode={darkMode} flag={flag} />
            ) : (
              <>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default IncidentDetails;
