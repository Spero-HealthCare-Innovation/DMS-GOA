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
  // border: `1px solid ${status === "Completed"
  //     ? "#00e676"
  //     : status === "Pending"
  //       ? "#f44336"
  //       : "#ccc"
  //   }`,
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

// const tasks = [
//   {
//     id: 1,
//     taskName: "221367345861",
//     description: "22136734",
//     initiatedBy: "Flood",
//     // duration: "1:30:00",
//     status: "High",
//     // mode: "Manual",
//     date: "6/05/2025",
//     time: "14:03:27",
//     action: "Get Data",
//   },
//   {
//     id: 2,
//     taskName: "221367345861",
//     description: "221367345861",
//     initiatedBy: "Cyclone",
//     // duration: "1:30:00",
//     initiatedBy: "Medium",
//     mode: "Manual",
//     date: "6/05/2025",
//     time: "14:03:27",
//     action: "Dispatch",
//   },
// ];
const tasks = [
  {
    id: 1,
    alertId: "A123",
    disasterId: "D456",
    disasterType: "Earthquake",
    date: "2025-05-08",
    time: "14:30",
    priority: "High",
    initiatedBy: "John Doe",
    status: "In Progress",
  },
  {
    id: 2,
    alertId: "A124",
    disasterId: "D457",
    disasterType: "Flood",
    date: "2025-05-09",
    time: "09:00",
    priority: "Low",
    initiatedBy: "Jane Smith",
    status: "Completed",
  },
  // Add more tasks as needed
];


function SopTask({ darkMode }) {
  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "#0a1929" : "#ffffff";

  return (
    <>
      {/* <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography
          variant="h6"
          sx={{
            color: textColor,
            Roboto: 400,
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: "16px",
            verticalAlign: "middle",
            paragraphSpacing: "16px",
          }}
        >
          <strong>Task</strong>
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search Your Location"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "300px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              backgroundColor: darkMode ? "#1e293b" : "#fff",
              color: darkMode ? "#fff" : "#000",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: darkMode ? "#444" : "#ccc",
            },
            "& input": {
              color: darkMode ? "#fff" : "#000",
            },
          }}
        />
      </Box> */}

      <Paper
        elevation={3}
        sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            pb: 2, // padding from bottom
          }}
        >
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
              width: "200px", // smaller width
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                backgroundColor: darkMode ? "#1e293b" : "#fff",
                color: darkMode ? "#fff" : "#000",
                px: 1, // horizontal padding inside input
                py: 0.2, // vertical padding
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: darkMode ? "#444" : "#ccc",
              },
              "& input": {
                color: darkMode ? "#fff" : "#000",
                padding: "6px 8px", // controls input height
                fontSize: "13px",
              },
            }}
          />
        </Box>
        {/* <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableBody>
                  
                  <EnquiryCard>
                    {[
                      "Task Name",
                      "Description",
                      "Initiated By",
                      "Duration",
                      "Date & Time",
                      "Status",
                      "Mode",
                      "Actions",
                      "Comments",
                      "View",
                    ].map((label, idx) => (
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

                
                  {tasks.length === 0 ? (
                    <Box p={2}>
                      <Typography align="center" color="textSecondary">
                        No tasks available.
                      </Typography>
                    </Box>
                  ) : (
                    tasks.map((item) => (
                      <EnquiryCardBody key={item.id} status={item.status}>
                        <StyledCardContent
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {item.taskName}
                          </Typography>
                        </StyledCardContent>
                        <StyledCardContent
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {item.description}
                          </Typography>
                        </StyledCardContent>
                        <StyledCardContent
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {item.initiatedBy}
                          </Typography>
                        </StyledCardContent>
                        <StyledCardContent
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {item.duration}
                          </Typography>
                        </StyledCardContent>
                        <StyledCardContent
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {item.date + " " + item.time}
                          </Typography>
                        </StyledCardContent>
                        <StyledCardContent
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                item.status === "Completed"
                                  ? "#00e676"
                                  : "#f44336",
                            }}
                            variant="subtitle2"
                          >
                            {item.status}
                          </Typography>
                        </StyledCardContent>
                        <StyledCardContent
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {item.mode}
                          </Typography>
                        </StyledCardContent>
                        <StyledCardContent
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            sx={{ minWidth: 100 }} // Set consistent width
                          >
                            {item.action}
                          </Button>
                        </StyledCardContent>
                        <StyledCardContent
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
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
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Visibility
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
        </Grid> */}

<Grid container spacing={2}>
  <Grid item xs={12}>
    <TableContainer>
      <Table>
        <TableBody>
          {/* Header */}
          <EnquiryCard sx={{ display: "flex", flexDirection: "row" }}>
            {[
              "Alert Id",
              "Disaster Id",
              "Disaster Type",
              "Date & Time",
              "Priority",
              "Initiated By",
              "Add",
              "View",
            ].map((label, idx) => (
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

          {/* Rows */}
          {tasks.length === 0 ? (
            <Box p={2}>
              <Typography align="center" color="textSecondary">
                No tasks available.
              </Typography>
            </Box>
          ) : (
            tasks.map((item) => (
              <EnquiryCardBody
                key={item.id}
                status={item.status}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <StyledCardContent sx={{ flex: 1, justifyContent: "center", display: "flex" }}>
                  <Typography variant="subtitle2">{item.alertId}</Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center", display: "flex" }}>
                  <Typography variant="subtitle2">{item.disasterId}</Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center", display: "flex" }}>
                  <Typography variant="subtitle2">{item.disasterType}</Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center", display: "flex" }}>
                  <Typography variant="subtitle2">
                    {item.date} {item.time}
                  </Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center", display: "flex" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: item.priority === "High" ? "#f44336" : "#00e676",
                    }}
                  >
                    {item.priority}
                  </Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center", display: "flex" }}>
                  <Typography variant="subtitle2">{item.initiatedBy}</Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center", display: "flex" }}>
                  <AddCircleOutline
                    sx={{
                      color: "#00f0c0",
                      cursor: "pointer",
                      fontSize: 28,
                    }}
                  />
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center", display: "flex" }}>
                  <Visibility
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

      </Paper>
    </>
  );
}

export default SopTask;
