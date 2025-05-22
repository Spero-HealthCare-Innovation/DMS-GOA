import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Paper, InputAdornment, Grid, Popover, Snackbar } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Search, ArrowBack, DeleteOutline, EditOutlined, } from "@mui/icons-material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { styled } from "@mui/material/styles";
import Pagination from '@mui/material/Pagination';
import { Alert } from '@mui/material';
import { Select, MenuItem, IconButton, Popper } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "./../../../../Context/ContextAPI";
import {
  TableDataCardBody,
  TableHeadingCard,
  CustomTextField,
  getThemeBgColors,
  textfieldInputFonts,
  fontsTableBody,
  getCustomSelectStyles,
  fontsTableHeading,
  StyledCardContent,
  inputStyle,
} from "../../../../CommonStyle/Style";


function Add_group({ darkMode }) {
  const port = import.meta.env.VITE_APP_API_KEY;

  const { newToken } = useAuth(); // ✅ pull token from context

  const [departmentList, setDepartmentList] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [groups, setGroups] = useState([]);



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine effective token (context token takes priority)
  const effectiveToken = newToken || localStorage.getItem("access_token");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      console.log("Using token:", effectiveToken);

      const response = await axios.get(`${port}/admin_web/Department_get/`, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
        },
      });

      console.log(" Departments fetched:", response.data);
      setDepartmentList(response.data);
    } catch (err) {
      console.error(" Error fetching departments:", err);
      if (err.response) {
        console.error("Server Response:", err.response.data);
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveToken) {
      fetchDepartments();
    } else {
      console.warn("No token found for department fetch.");
    }
  }, [effectiveToken]);


  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "#0a1929" : "#ffffff";
  const labelColor = darkMode ? "#5FECC8" : "#1976d2";
  const fontFamily = "Roboto, sans-serif";
  const borderColor = darkMode ? "#7F7F7F" : "#ccc";

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const selectStyles = getCustomSelectStyles(isDarkMode);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);


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
      boxShadow: `0 0 8px ${status === "Completed"
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


  const fontsTableHeading = {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: 0,
    textAlign: "center",
  };

  const inputBgColor = darkMode
    ? "rgba(255, 255, 255, 0.16)"
    : "rgba(0, 0, 0, 0.04)";


  const fontsTableBody = {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 13,
    letterSpacing: 0,
    textAlign: "center",
  };


  const [alertData, setAlertData] = useState([
    {
      departmentID: "D-2202020",
      groupName: "User Admin",
    },
    {
      departmentID: "D-2202020",
      groupName: " Employee Admin",
    },
    {
      departmentID: "D-2202020",
      groupName: "Yes Admin",
    },
    {
      departmentID: "D-2202020",
      groupName: "NO Admin",
    },
    {
      departmentID: "D-2202020",
      groupName: "Small Admin",
    },
    {
      departmentID: "D-2202020",
      groupName: "Big Admin",
    },
    {
      departmentID: "D-2202020",
      groupName: "Super Admin",
    },
    // Add more dummy objects...
  ]);


  const paginatedData = groups.slice((page - 1) * rowsPerPage, page * rowsPerPage);



  const open = Boolean(anchorEl);
  const handleOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    // Optionally store item in state if needed
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleSubmit = async () => {
    if (!departmentId || !groupName) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      grp_code: "GRP001", // static
      permission_status: 1,
      grp_name: groupName,
      dep_id: parseInt(departmentId), // dynamic
      grp_is_deleted: false,
      grp_added_by: "admin_user",
      grp_modified_by: "admin_user",
    };

    try {
      setLoading(true);

      const response = await axios.post(
        `${port}/admin_web/group_post/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${effectiveToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Group added:", response.data);
      // alert("Group successfully added!");
      // Optional: reset form
      setGroupName("");
      setDepartmentId("");
      setShowSuccessAlert(true);

      // Optional: Auto-hide after 3 seconds
      setTimeout(() => setShowSuccessAlert(false), 3000);

      await fetchGroups();

    } catch (err) {
      console.error("Error posting group:", err);


      // Handle specific 409 error
      if (err.response && err.response.status === 409) {
        const detailMessage = err.response.data?.detail || "Conflict error";
        alert(`Failed to add group: ${detailMessage}`);
      } else {
        alert("Failed to add group. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${port}/admin_web/Group_get/`, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
        },
      });

      const formattedGroups = response.data.map(group => ({
        departmentID: group.dep_id,
        groupName: group.grp_name,
        fullData: group
      }));

      setGroups(formattedGroups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };


  useEffect(() => {
    fetchGroups();
  }, []);


  return (
    <div>
      <Snackbar
        open={showSuccessAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => setShowSuccessAlert(false)}
      >
        <Alert
          onClose={() => setShowSuccessAlert(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Group added successfully!
        </Alert>
      </Snackbar>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2, mt: 3 }}>

        {/* Back Arrow */}
        <IconButton size="small" onClick={() => {/* handle back action here */ }} sx={{
          backgroundColor: "#00f0c0",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#00d8ac",
          },
          width: 30,
          height: 30,
        }}>
          <ArrowBackIosIcon sx={{ fontSize: 20, color: darkMode ? "#fff" : "#000", }} />
        </IconButton>

        {/* Label */}
        <Typography variant="h6" sx={{
          color: labelColor,
          fontWeight: 600,
          fontFamily,
          fontSize: 16,
        }}>
          Add Group
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
            width: "200px",
            ml: 5,
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 5 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <EnquiryCard sx={{
                      backgroundColor: "#5FECC8",
                      color: "#000",
                      display: "flex",
                      width: "100%",
                      borderRadius: 2,
                      p: 3,
                    }}>
                      <StyledCardContent
                        sx={{
                          flex: 0.6,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="subtitle2" sx={fontsTableHeading}>
                          Sr. No
                        </Typography>
                      </StyledCardContent>


                      <StyledCardContent
                        sx={{
                          flex: 1.9,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">
                          Department ID
                        </Typography>
                      </StyledCardContent>
                      <StyledCardContent
                        sx={{
                          flex: 2,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">
                          Group Name
                        </Typography>
                      </StyledCardContent>

                      <StyledCardContent
                        sx={{
                          flex: 0.2,
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">Actions</Typography>
                      </StyledCardContent>


                      <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                        <MoreHorizIcon
                          sx={{
                            color: "#00f0c0",
                            cursor: "pointer",
                            fontSize: 28,
                          }}
                        />
                      </StyledCardContent>
                    </EnquiryCard>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedData.length === 0 ? (
                    <Box p={2}>
                      <Typography align="center" color="textSecondary">
                        No tasks available.
                      </Typography>
                    </Box>
                  ) : (
                    paginatedData.map((item, index) => (
                      <EnquiryCardBody
                        key={index}
                        sx={{
                          backgroundColor: inputBgColor,
                          p: 2,
                          borderRadius: 2,
                          color: textColor,
                          display: "flex",
                          width: "100%",
                          mb: 1,
                        }}
                      >
                        <StyledCardContent sx={{ flex: 0.6, justifyContent: "center" }}>
                          <Typography variant="subtitle2" sx={fontsTableBody}>
                            {(page - 1) * rowsPerPage + index + 1}
                          </Typography>
                        </StyledCardContent>

                        <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                          <Typography variant="subtitle2">{item.departmentID}</Typography>
                        </StyledCardContent>

                        <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                          <Typography variant="subtitle2">{item.groupName}</Typography>
                        </StyledCardContent>

                        <StyledCardContent sx={{ flex: 1.5, justifyContent: "center", ...fontsTableBody }}>
                          <MoreHorizIcon
                            onClick={(e) => handleOpen(e, item)}
                            sx={{
                              color: "#00f0c0",
                              cursor: "pointer",
                              fontSize: 28,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          />
                        </StyledCardContent>
                      </EnquiryCardBody>
                    ))
                  )}
                  {/* {paginatedData.map((item, index) => ( */}

                  {/* // ))} */}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
              px={1}
            >
              {/* Records Per Page */}
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{ color: textColor }}>
                  Records per page:
                </Typography>
                <Select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setPage(1); // Reset to first page on limit change
                  }}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "13px",
                    color: textColor,
                    borderColor: borderColor,
                    height: "30px",
                    minWidth: "70px",
                    backgroundColor: bgColor,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: borderColor,
                    },
                    "& .MuiSvgIcon-root": { color: textColor },
                  }}
                >
                  {[5, 10, 25, 50].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Page Navigation */}
              <Box
                sx={{
                  border: "1px solid #ffffff",
                  borderRadius: "6px",
                  px: 2,
                  py: 0.5,
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: textColor,
                  fontSize: "13px",
                }}
              >
                <Box
                  onClick={() => page > 1 && setPage(page - 1)}
                  sx={{
                    cursor: page > 1 ? "pointer" : "not-allowed",
                    userSelect: "none",
                  }}
                >
                  &#8249;
                </Box>
                <Box>{page}</Box>
                <Box
                  onClick={() =>
                    page < Math.ceil(alertData.length / rowsPerPage) &&
                    setPage(page + 1)
                  }
                  sx={{
                    cursor:
                      page < Math.ceil(alertData.length / rowsPerPage)
                        ? "pointer"
                        : "not-allowed",
                    userSelect: "none",
                  }}
                >
                  &#8250;
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              borderRadius: 2,
              minWidth: 120,
            },
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={() => {
              alert("View clicked");
              handleClose();
            }}
          >
            View
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="warning"
            startIcon={<EditOutlined />}
            onClick={() => {
              alert("Edit clicked");
              handleClose();
            }}
          >
            Edit
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<DeleteOutline />}
            onClick={() => {
              alert("Delete clicked");
              handleClose();
            }}
          >
            Delete
          </Button>
        </Popover>

        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 5 }}>
            <Typography
              sx={{
                color: labelColor,
                fontWeight: 600,
                fontSize: 16,

                mb: 2,
                fontFamily,
              }}
            >
              Add Group
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First TextField */}
              <Select
                fullWidth
                displayEmpty
                placeholder="Select District"
                defaultValue=""
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                inputProps={{
                  "aria-label": "Select Name",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled>
                  Select Department
                </MenuItem>
                {departmentList.map((department) => (
                  <MenuItem key={department.dep_id} value={department.dep_id}>
                    {department.dep_name}
                  </MenuItem>
                ))}
                {/* Add more options as needed */}
              </Select>
              {/* Second TextField */}
              <TextField
                fullWidth
                placeholder="Group Name"
                InputLabelProps={{ shrink: false }}
                sx={inputStyle}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  mt: 2,
                  width: "40%",
                  backgroundColor: "#00f0c0",
                  color: "black",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: bgColor,
                    color: "white !important",
                  },
                }}
              >Submit
              </Button>
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default Add_group
