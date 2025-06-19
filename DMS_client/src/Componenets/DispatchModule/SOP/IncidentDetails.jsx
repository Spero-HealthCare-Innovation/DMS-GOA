import {
  Paper,
  Grid,
  Typography,
  Box,
  Stack,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Tooltip,
} from "@mui/material";
import CommentsPanel from "./CommentsPanel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuth } from "../../../Context/ContextAPI";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";

function IncidentDetails({
  darkMode,
  flag,
  setFlag,
  selectedIncident,
  responderScope,
  fetchDispatchList,
  incidentDetails,
  setSelectedIncident,
  fetchIncidentDetails,
  highlightedId,
  setHighlightedId,
}) {
  window.addEventListener("storage", (e) => {
    if (e.key === "logout") {
      location.href = "/login";
    }
  });

  const userName = localStorage.getItem("userId");
  console.log(
    selectedIncident?.inc_id,
    "selectedIncidentselectedIncidentselectedIncident"
  );
  let incident = {};

  if (selectedIncident?.inc_id) {
    console.log(
      selectedIncident.inc_id,
      "selectedIncidentselectedIncidentselectedIncident"
    );
    incident = incidentDetails?.incident_details?.[0] || {};
  }

  const { disaterid, setResponderScopeForDispatch, responderScopeForDispatch } =
    useAuth();

  // const incident = incidentDetails?.incident_details?.[0] || {};
  console.log("Incident Details:", incident);
  const respondersList = incidentDetails?.responders || [];

  // const [selectedResponders, setSelectedResponders] = useState(
  //   responderScope?.responder_scope?.map((item) => item.pk_id)
  // );
  const [selectedResponders, setSelectedResponders] = useState([]);
  console.log(selectedResponders, "selectedReasdadadaspondersssss");

  const comments = incidentDetails?.comments || [];

  // Define colors and styles based on dark mode
  const labelColor = darkMode ? "#5FC8EC" : "#1976d2";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const borderColor = darkMode ? "#7F7F7F" : "#ccc";
  const fontFamily = "Roboto, sans-serif";

  // Style for the box containing label and value
  // This can be customized further based on your design requirements
  const boxStyle = {
    mb: 2,
    pb: 1.5,
    borderBottom: `1px solid ${borderColor}`,
  };

  // Function to render text with label and value
  const renderText = (label, value) => (
    <Box sx={boxStyle}>
      <Typography sx={{ color: labelColor, fontWeight: 500, fontFamily, fontSize: '14px', mt: 1 }}>
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

  useEffect(() => {
    if (Array.isArray(responderScope?.responder_scope)) {
      const defaultSelected = responderScope.responder_scope.map(
        (r) => r.res_id
      );
      setSelectedResponders(defaultSelected);
    }
  }, [responderScope]);

  const [openDialog, setOpenDialog] = useState(false);

  // Get the response procedure text
  const responseProcedure =
    responderScope?.sop_responses?.[0]?.sop_description ||
    incidentDetails?.sop_responses?.[0]?.sop_description ||
    "";

  // Helper to get first 2 lines (or less)
  const getFirstTwoLines = (text) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.slice(0, 2).join("\n") + (lines.length > 2 ? "..." : "");
  };

  return (
    <>
      <Typography variant="h6" color="#fff" sx={{ fontFamily, ml: 2 }}>
        Rules
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: darkMode ? "202328" : "#fff",
          color: textColor,
          transition: "all 0.3s ease",
          mb: 5,
        }}
      >
        <Grid container>
          {/* Left Column */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              borderRight: { md: `1px solid ${borderColor}` },
              pr: { md: 2 },
              mb: { xs: 2, md: 0 },
            }}
          >
            {flag === 1 ? (
              <>
                {renderText("Alert ID", selectedIncident?.pk_id)}
                {renderText(
                  "Time",
                  selectedIncident?.alert_datetime
                    ? new Date(selectedIncident.alert_datetime).toLocaleString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )
                    : "N/A"
                )}
                {renderText("Disaster Type", selectedIncident?.disaster_name)}
              </>
            ) : (
              <>
                <>
                  {incident?.mode === 2 ? (
                    <>
                      {renderText("Incident Id", incident?.incident_id)}
                      {renderText(
                        "Incident Type",
                        incident?.inc_type === 1
                          ? "Emergency"
                          : incident?.inc_type === 2
                            ? "Non-Emergency"
                            : "N/A"
                      )}
                      {renderText(
                        "Alert Type",
                        incident?.alert_type === 1
                          ? "High"
                          : incident?.alert_type === 2
                            ? "Medium"
                            : incident?.alert_type === 3
                              ? "Low"
                              : incident?.alert_type === 4
                                ? "very Low"
                                : "N/A"
                      )}
                      {renderText("Disaster Type", incident?.disaster_name)}
                    </>
                  ) : (
                    <Box sx={{
                      // maxHeight: '250px', overflowY: 'auto',
                      scrollBehavior: "smooth",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: darkMode ? "#0288d1" : "#888",
                        borderRadius: 3,
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: darkMode ? "#5FC8EC" : "#555",
                      },
                    }}>
                      <Grid container spacing={2}>
                        {/* <Grid item xs={12} md={12}>
                          <Typography
                            variant="body2"
                            sx={{ color: labelColor, fontWeight: 500, fontFamily, fontSize: '18px', borderBottom: '1px solid #ccc' }}
                          >
                            Incident Details
                          </Typography>
                        </Grid> */}

                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                            >
                              Caller Name
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontFamily, color: textColor, wordBreak: "break-word" }}
                            >
                              {incident?.caller_name || "N/A"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                            >
                              Caller Number
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontFamily, color: textColor, wordBreak: "break-word" }}
                            >
                              {incident?.caller_no || "N/A"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                            >
                              Ward
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontFamily, color: textColor, wordBreak: "break-word" }}
                            >
                              {incident?.ward || "N/A"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                            >
                              Tehsil
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontFamily, color: textColor, wordBreak: "break-word" }}
                            >
                              {incident?.tehsil || "N/A"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                            >
                              District
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontFamily, color: textColor, wordBreak: "break-word" }}
                            >
                              {incident?.district || "N/A"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                            >
                              Location
                            </Typography>

                            {incident?.location && incident.location.length > 20 ? (
                              <Tooltip title={incident.location} arrow>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontFamily, color: textColor, wordBreak: "break-word", cursor: "pointer" }}
                                >
                                  {incident.location.slice(0, 20)}...
                                </Typography>
                              </Tooltip>
                            ) : (
                              <Typography
                                variant="subtitle2"
                                sx={{ fontFamily, color: textColor, wordBreak: "break-word" }}
                              >
                                {incident?.location || "N/A"}
                              </Typography>
                            )}
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={12}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                            >
                              Summary
                            </Typography>

                            {incident?.summary_name && incident.summary_name.length > 40 ? (
                              <Tooltip title={incident.summary_name} arrow>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontFamily,
                                    color: textColor,
                                    wordBreak: "break-word",
                                    cursor: "pointer"
                                  }}
                                >
                                  {incident.summary_name.slice(0, 40)}...
                                </Typography>
                              </Tooltip>
                            ) : (
                              <Typography
                                variant="subtitle2"
                                sx={{ fontFamily, color: textColor, wordBreak: "break-word" }}
                              >
                                {incident?.summary_name || "N/A"}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </>
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
                {/* Alert-panel */}
                <Box sx={boxStyle}>
                  {/* Heading + Eye icon in one row */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                    >
                      Response Procedure
                    </Typography>

                    {responderScope?.sop_responses?.[0]?.sop_description && (
                      <IconButton
                        size="small"
                        onClick={() => setOpenDialog(true)}
                        sx={{ color: 'orange' }} // eye icon in orange
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  {/* Conditionally show response text or fallback */}
                  {selectedIncident?.inc_id === undefined ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" sx={{ fontFamily }}>
                        No response procedure available.
                      </Typography>
                    </Box>
                  ) : responderScope?.sop_responses?.[0]?.sop_description ? (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontFamily,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'normal', // required for clamping to work
                        }}
                      >
                        {responderScope.sop_responses[0].sop_description}
                      </Typography>

                      {/* Dialog showing full content */}
                      <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        maxWidth="sm"
                        fullWidth
                      >
                        <DialogTitle
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            pr: 1,
                          }}
                        >
                          Response Procedure
                          <IconButton
                            aria-label="close"
                            onClick={() => setOpenDialog(false)}
                            size="small"
                          >
                            <CloseIcon />
                          </IconButton>
                        </DialogTitle>
                        <DialogContent>
                          <Typography
                            variant="body1"
                            sx={{ whiteSpace: 'pre-line', fontFamily }}
                          >
                            {responderScope.sop_responses[0].sop_description}
                          </Typography>
                        </DialogContent>
                      </Dialog>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" sx={{ fontFamily }}>
                        No response procedure available.
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
                          ({ res_id, responder_name }) => (
                            <FormControlLabel
                              key={res_id}
                              control={
                                <Checkbox
                                  checked={selectedResponders.includes(res_id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedResponders((prev) => [
                                        ...prev,
                                        res_id,
                                      ]);
                                    } else {
                                      setSelectedResponders((prev) =>
                                        prev.filter((id) => id !== res_id)
                                      );
                                    }
                                  }}
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
                      {/* <InfoOutlinedIcon color="disabled" /> */}
                      <Typography variant="subtitle2" sx={{ fontFamily }}>
                        Responder scope data not available.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <>
                {/* Dispatch */}
                <Box sx={boxStyle}>
                  {/* Heading + Eye icon in one row */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                    >
                      Response Procedure
                    </Typography>

                    {responderScope?.sop_responses?.[0]?.sop_description && (
                      <IconButton
                        size="small"
                        onClick={() => setOpenDialog(true)}
                        sx={{ color: 'orange' }} // eye icon in orange
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  {/* Conditionally show response text or fallback */}
                  {selectedIncident?.inc_id === undefined ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" sx={{ fontFamily }}>
                        No response procedure available.
                      </Typography>
                    </Box>
                  ) : responderScope?.sop_responses?.[0]?.sop_description ? (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontFamily,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'normal', // required for clamping to work
                        }}
                      >
                        {responderScope.sop_responses[0].sop_description}
                      </Typography>

                      {/* Dialog showing full content */}
                      <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        maxWidth="sm"
                        fullWidth
                      >
                        <DialogTitle
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            pr: 1,
                          }}
                        >
                          Response Procedure
                          <IconButton
                            aria-label="close"
                            onClick={() => setOpenDialog(false)}
                            size="small"
                          >
                            <CloseIcon />
                          </IconButton>
                        </DialogTitle>
                        <DialogContent>
                          <Typography
                            variant="body1"
                            sx={{ whiteSpace: 'pre-line', fontFamily }}
                          >
                            {responderScope.sop_responses[0].sop_description}
                          </Typography>
                        </DialogContent>
                      </Dialog>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" sx={{ fontFamily }}>
                        No response procedure available.
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

                  {Array.isArray(incidentDetails?.["responders scope"]) &&
                    incidentDetails["responders scope"].length > 0 ? (
                    <Stack spacing={1} mt={1}>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {incidentDetails["responders scope"].map(
                          ({ responder_id, responder_name }) => {
                            const isChecked =
                              Array.isArray(incident?.responder_scope) &&
                              incident.responder_scope
                                .map(String)
                                .includes(String(responder_id));

                            return (
                              <FormControlLabel
                                key={responder_id}
                                control={
                                  <Checkbox
                                    checked={isChecked}
                                    disabled
                                    sx={{
                                      color: labelColor,
                                      "&.Mui-checked": {
                                        color: "#5FC8EC",
                                      },
                                      "&:hover": {
                                        backgroundColor: "rgba(0, 191, 165, 0.1)",
                                        borderRadius: "6px",
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography variant="subtitle2" sx={{ fontFamily }}>
                                    {responder_name}
                                  </Typography>
                                }
                              />
                            );

                          }
                        )}
                      </Box>
                    </Stack>
                  ) : (
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      {/* <InfoOutlinedIcon color="disabled" /> */}
                      <Typography variant="subtitle2" sx={{ fontFamily }}>
                        No Responder Scope Assigned.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4} pl={{ md: 2 }}>
            <Typography variant="subtitle2" mb={2} color="#5FC8EC">
              Comments
            </Typography>
            {selectedIncident ? (
              <CommentsPanel
                darkMode={darkMode}
                flag={flag}
                setFlag={setFlag}
                selectedResponders={selectedResponders}
                setSelectedResponders={setSelectedResponders}
                selectedIncident={selectedIncident}
                setSelectedIncident={setSelectedIncident}
                incidentDetails={incidentDetails}
                comments={comments}
                fetchDispatchList={fetchDispatchList}
                fetchIncidentDetails={fetchIncidentDetails}
                highlightedId={highlightedId}
                setHighlightedId={setHighlightedId}

              />
            ) : (
              <Typography
                variant="subtitle2"
                sx={{ fontFamily, color: "#fff", mt: 1 }}
              >
                Please select an incident to view comments.
              </Typography>
            )}
          </Grid>

        </Grid>
      </Paper >
    </>
  );
}

export default IncidentDetails;
