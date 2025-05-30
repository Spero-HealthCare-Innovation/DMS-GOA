import {
  Paper,
  Grid,
  Typography,
  TextField,
  Skeleton,
  Box,
} from "@mui/material";

const CaseClosureDetails = ({ darkMode, flag, selectedIncident }) => {
  const labelColor = darkMode ? "#5FECC8" : "#1976d2";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const fontFamily = "Roboto, sans-serif";
  const borderColor = darkMode ? "#7F7F7F" : "#e0e0e0";

  const textFieldStyle = {
    "& .MuiInputLabel-root": { color: labelColor },
    "& .MuiOutlinedInput-root": {
      backgroundColor: darkMode ? "#1e293b" : "#fff",
      borderRadius: 2,
    },
  };

const renderText = (label, value) => (
  <Box
    sx={{
      pb: 1.5,
      mb: 1.5,
      borderBottom: `1px solid ${borderColor}`,
    }}
  >
    <Typography
      variant="body2"
      sx={{ color: labelColor, fontWeight: 600, fontFamily }}
    >
      {label}
    </Typography>
    {selectedIncident ? (
      <Typography variant="body2" sx={{ fontFamily, color: textColor }}>
        {value || "N/A"}
      </Typography>
    ) : (
      <Skeleton variant="text" width={120} height={24} />
    )}
  </Box>
);


  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontFamily,
          mb: 2,
          fontWeight: 700,
          color: labelColor,
        }}
      >
        Case Closure Details
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: darkMode ? "#0a1929" : "#ffffff",
          color: textColor,
          transition: "all 0.3s ease",
        }}
      >
        <Grid container spacing={3}>
      {/* Left Column */}
<Grid
  item
  xs={12}
  md={3}
  sx={{
    borderRight: { md: `1px solid ${borderColor}` },
    pr: { md: 3 },
  }}
>
  <Typography
    variant="subtitle1"
    sx={{
      fontWeight: 600,
      color: labelColor,
      fontFamily,
      mb: 2,
    }}
  >
    Incident Info
  </Typography>
{flag === 0 ? (
  <Box>
    {renderText("Alert ID", selectedIncident?.IncidentId)}
    {renderText("Disaster Id", selectedIncident?.disasterType)}
    {renderText("Disaster Type", selectedIncident?.disasterType)}
  </Box>
) : (
  <Box>
    {/* You can put placeholder text or leave it empty */}
    <Typography variant="body2" sx={{ color: textColor, fontFamily }}>
      No incident data to display.
    </Typography>
  </Box>
)}

</Grid>
          {/* Middle Column */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              borderRight: { md: `1px solid ${borderColor}` },
              px: { md: 3 },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: labelColor,
                fontFamily,
                mb: 2,
              }}
            >
              Case Timeline
            </Typography>

            <Grid container spacing={2}>
              {[
                ["Acknowledge", selectedIncident?.acknowledge],
                ["Start Base Location", selectedIncident?.startBaseLocation],
                ["At Scene", selectedIncident?.atScene],
                ["From Scene", selectedIncident?.fromScene],
                ["Back to Base", selectedIncident?.backToBase],
              ].map(([label, value], i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label={label}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={value || ""}
                    InputProps={{ sx: { color: textColor } }}
                    sx={textFieldStyle}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: labelColor,
                fontFamily,
                mb: 2,
              }}
            >
              Closure Remark
            </Typography>

            <TextField
              label="Remark"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={selectedIncident?.closureRemark || ""}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { color: textColor } }}
              sx={textFieldStyle}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default CaseClosureDetails;
