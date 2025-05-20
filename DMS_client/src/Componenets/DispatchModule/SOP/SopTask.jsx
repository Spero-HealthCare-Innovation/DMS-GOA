import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Grid,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import { Search, Visibility, AddCircleOutline } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { tasks, alerts } from "./dummydata";

const EnquiryCard = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#5FECC8",
  borderRadius: "8px 10px 0 0",
  padding: "6px 12px",
  color: "black",
  height: "40px",
}));

const EnquiryCardBody = styled("tr")(({ theme, status }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.mode === "dark" ? "#112240" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  marginTop: "0.5em",
  borderRadius: "8px",
  padding: "10px 12px",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    boxShadow: `0 0 8px ${
      status === "Completed"
        ? "#00e67699"
        : status === "Pending"
        ? "#f4433699"
        : "#88888855"
    }`,
  },
  height: "45px",
}));

const StyledCardContent = styled("td")({
  padding: "0 8px",
  display: "flex",
  alignItems: "center",
});

const Alert=[
  "Alert Id",
  "Disaster Id",
  "Alert Type",
  "Date & Time",
  "Priority",
  "Initiated By",
  "Add",
  "View",
]

const Dispatch=[
  "Alert ID",
  "Disaster ID",
  "Date & Time",
  "Disaster Type",
  "Priority",
  "Status",
  "Mode",
  "Initiated By",
  "View",
]

function SopTask({ darkMode, flag, setFlag, setSelectedIncident }) {
  useLocation(); // This line does nothing
  const location = useLocation(); // This is the correct usage

  const handleBack = () => {
    setFlag(0);
  };

  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "#0a1929" : "#ffffff";

  return (
    <Paper
      elevation={3}
      sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2 }}>
        {flag === 1 && (
          <ArrowBackIcon
            onClick={handleBack}
            sx={{
              cursor: "pointer",
              fontSize: 26,
              color: darkMode ? "#fff" : "#000",
              "&:hover": {
                color: "#00f0c0",
              },
            }}
          />
        )}
        {flag === 1 ? (
          <Typography
            variant="h6"
            sx={{
              color: textColor,
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "32px",
            }}
          >
            Task
          </Typography>
        ) : (
          <Typography
            variant="h6"
            sx={{
              color: textColor,
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "32px",
            }}
          >
            Dispatch SOP
          </Typography>
        )}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "gray", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "200px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              backgroundColor: darkMode ? "#1e293b" : "#fff",
              color: darkMode ? "#fff" : "#000",
              px: 1,
              py: 0.2,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: darkMode ? "#444" : "#ccc",
            },
            "& input": {
              color: darkMode ? "#fff" : "#000",
              padding: "6px 8px",
              fontSize: "13px",
            },
          }}
        />
      </Box>

      {flag === 1 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableBody>
                  <EnquiryCard sx={{ display: "flex", flexDirection: "row" }}>
                    {Alert.map((label, idx) => (
                      <StyledCardContent
                        key={idx}
                        sx={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={500}>
                          {label}
                        </Typography>
                      </StyledCardContent>
                    ))}
                  </EnquiryCard>

                  {alerts.length === 0 ? (
                    <Box p={2}>
                      <Typography align="center" color="textSecondary">
                        No tasks available.
                      </Typography>
                    </Box>
                  ) : (
                    alerts.map((item) => (
                      <EnquiryCardBody
                        key={item.id}
                        status={item.status}
                        sx={{ display: "flex", flexDirection: "row" }}
                      >
                        {[
                          item.alertId,
                          item.disasterId,
                          item.disasterType,
                          `${item.date} ${item.time}`,
                        ].map((val, i) => (
                          <StyledCardContent
                            key={i}
                            sx={{ flex: 1, justifyContent: "center" }}
                          >
                            <Typography variant="subtitle2">{val}</Typography>
                          </StyledCardContent>
                        ))}
                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color:
                                item.priority === "High"
                                  ? "#f44336"
                                  : "#00e676",
                            }}
                          >
                            {item.priority}
                          </Typography>
                        </StyledCardContent>
                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography variant="subtitle2">
                            {item.initiatedBy}
                          </Typography>
                        </StyledCardContent>
                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <AddCircleOutline
                            sx={{
                              color: "#00f0c0",
                              cursor: "pointer",
                              fontSize: 28,
                            }}
                          />
                        </StyledCardContent>
                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Visibility
                            onClick={() => {
                              setSelectedIncident(item); // 👈 Send clicked incident
                              setFlag(1); // 👈 Trigger view mode
                            }}
                            sx={{
                              color: "#00f0c0",
                              cursor: "pointer",
                              fontSize: 28,
                            }}
                          />
                        </StyledCardContent>
                      </EnquiryCardBody>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableBody>
                  {/* Header Row */}
                  <EnquiryCard>
                    {Dispatch.map((label, idx) => (
                      <StyledCardContent
                        key={idx}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={500}>
                          {label}
                        </Typography>
                      </StyledCardContent>
                    ))}
                  </EnquiryCard>

                  {/* Body Rows */}
                  {tasks.length === 0 ? (
                    <Box p={2}>
                      <Typography align="center" color="textSecondary">
                        No tasks available.
                      </Typography>
                    </Box>
                  ) : (
                    tasks.map((item) => (
                      <EnquiryCardBody key={item.id} status={item.status}>
                        {[
                          item.alertId,
                          item.disasterId,
                          `${item.date} ${item.time}`,
                          item.disasterType,
                          item.priority,
                          item.status,
                          item.mode,
                          item.initiatedBy,
                          "View", // Placeholder for icon
                        ].map((val, idx) => (
                          <StyledCardContent
                            key={idx}
                            style={{
                              flex: 1,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {idx === 8 ? (
                              <Visibility
                                onClick={() => {
                                  setSelectedIncident(item);
                                  setFlag(0);
                                }}
                                sx={{
                                  color: "#00f0c0",
                                  cursor: "pointer",
                                  fontSize: 28,
                                }}
                              />
                            ) : (
                              <Typography
                                variant="subtitle2"
                                sx={
                                  idx === 5
                                    ? {
                                        color:
                                          item.status === "Completed"
                                            ? "#00e676"
                                            : "#f44336",
                                      }
                                    : {}
                                }
                              >
                                {val}
                              </Typography>
                            )}
                          </StyledCardContent>
                        ))}
                      </EnquiryCardBody>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}

export default SopTask;
