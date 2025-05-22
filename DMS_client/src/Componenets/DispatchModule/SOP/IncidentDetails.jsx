import {
  Paper,
  Grid,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Stack,
} from "@mui/material";
import CommentsPanel from "./CommentsPanel";

function IncidentDetails({ darkMode, flag, setFlag, selectedIncident }) {
  console.log("Selected Incident:", selectedIncident);
  console.log("Flag:", flag);

  const labelColor = darkMode ? "#5FECC8" : "#1976d2";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const borderColor = darkMode ? "#7F7F7F" : "#ccc";
  const fontFamily = "Roboto, sans-serif";

  const boxStyle = {
    mb: 2,
    pb: 1.5,
    borderBottom: `1px solid ${borderColor}`,
  };

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
          padding: 2,
        }}
      >
        {flag === 1 ? (
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
              <Box sx={boxStyle}>
                <Typography
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Alert ID
                </Typography>
                <Typography variant="subtitle2" sx={{ fontFamily }}>
                  {selectedIncident?.pk_id || "N/A"}
                </Typography>
              </Box>

              <Box sx={boxStyle}>
                {" "}
                {/* 🟢 ADDED BORDER */}
                <Typography
                  variant="subtitle2"
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Disaster Id
                </Typography>
                <Typography variant="subtitle2" sx={{ fontFamily }}>
                  {selectedIncident?.disasterId || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Alert Type
                </Typography>
                <Typography variant="subtitle2" sx={{ fontFamily }}>
                  {selectedIncident?.disasterType || "N/A"}
                </Typography>
              </Box>
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
              <Box sx={boxStyle}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Response Procedure
                </Typography>
                <Typography variant="subtitle2" sx={{ fontFamily }}>
                  Mass intimation to public, Media, Boat, Fisheries
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Responder Scope
                </Typography>
                <Stack spacing={1} mt={1}>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    <FormControlLabel
                      control={
                        <Checkbox defaultChecked sx={{ color: labelColor }} />
                      }
                      label={
                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                          Police
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={<Checkbox sx={{ color: labelColor }} />}
                      label={
                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                          Fire
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={<Checkbox sx={{ color: labelColor }} />}
                      label={
                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                          Marine
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={<Checkbox sx={{ color: labelColor }} />}
                      label={
                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                          Fisheries
                        </Typography>
                      }
                    />
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={5} pl={{ md: 2 }}>
              <CommentsPanel darkMode={darkMode} flag={flag} />
            </Grid>
          </Grid>
        ) : (
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
              <Box sx={boxStyle}>
                <Typography
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Incident ID
                </Typography>
                <Typography variant="subtitle2" sx={{ fontFamily }}>
                  {selectedIncident?.IncidentId || "N/A"}
                </Typography>
              </Box>

              <Box sx={boxStyle}>
                {" "}
                {/* 🟢 ADDED BORDER */}
                <Typography
                  variant="subtitle2"
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Incident Type
                </Typography>
                <Typography variant="subtitle2" sx={{ fontFamily }}>
                  {selectedIncident?.disasterType || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Alert Type
                </Typography>
                <Typography variant="subtitle2" sx={{ fontFamily }}>
                  {selectedIncident?.disasterType || "N/A"}
                </Typography>
              </Box>
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
              <Box sx={boxStyle}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Response Procedure
                </Typography>
                <Typography variant="subtitle2" sx={{ fontFamily }}>
                  Mass intimation to public, Media, Boat, Fisheries
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                >
                  Responder Scope
                </Typography>
                <Stack spacing={1} mt={1}>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    <FormControlLabel
                      control={
                        <Checkbox defaultChecked sx={{ color: labelColor }} />
                      }
                      label={
                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                          Police
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={<Checkbox sx={{ color: labelColor }} />}
                      label={
                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                          Fire
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={<Checkbox sx={{ color: labelColor }} />}
                      label={
                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                          Marine
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={<Checkbox sx={{ color: labelColor }} />}
                      label={
                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                          Fisheries
                        </Typography>
                      }
                    />
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={5} pl={{ md: 2 }}>
              <CommentsPanel darkMode={darkMode} flag={flag} />
            </Grid>
          </Grid>
        )}
      </Paper>
    </>
  );
}

export default IncidentDetails;
