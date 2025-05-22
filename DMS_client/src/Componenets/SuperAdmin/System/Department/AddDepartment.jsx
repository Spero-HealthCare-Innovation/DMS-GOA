import React, { use, useEffect, useMemo } from "react";
import {
  Paper,
  Grid,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Stack,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  CardContent,
  TableHead,
  TableRow,
  IconButton,
  Modal,
  InputAdornment,
  Select,
  Popover,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  Search,
  Visibility,
  AddCircleOutline,
  EditNotifications,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
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
import { useAuth } from "../../../../Context/ContextAPI";
import axios from "axios";

const AddDepartment = ({ darkMode, flag, setFlag, setSelectedIncident }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const port = import.meta.env.VITE_APP_API_KEY;
  const token = localStorage.getItem("access_token");
  const {
    states,
    districts,
    Tehsils,
    Citys,
    setFormValues,
    disasterIds,
    disaster,
    formValues,
    selectedStateId,
    setSelectedStateId,
    setSelectedDistrictId,
    selectedDistrictId,
    selectedTehsilId,
    setSelectedTehsilId,
    setSelectedDisasterIds,
    selectedCityID,
    loading,
    error,
  } = useAuth();
  console.log(Citys, "Citys");

  const handleStateChange = (e) => {
    const id = e.target.value;
    setSelectedStateId(id);
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    setSelectedDistrictId(id);
  };

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const selectStyles = getCustomSelectStyles(isDarkMode);
  const open = Boolean(anchorEl);
  const handleOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    // Optionally store item in state if needed
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const [disasterId, selectedDisasterId] = useState("");
  const [departments, setDepartments] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alertData, setAlertData] = useState([
    {
      departmentName: "000095643228282",
      disasterId: "D-123",
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Talegaon",
      city: "Lohgaon",
    },
    {
      departmentName: "000095643228282",
      disasterId: "D-123",
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Talegaon",
      city: "Lohgaon",
    },
    {
      departmentName: "000095643228282",
      disasterId: "D-123",
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Talegaon",
      city: "Lohgaon",
    },
    {
      departmentName: "000095643228282",
      disasterId: "D-123",
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Talegaon",
      city: "Lohgaon",
    },
    {
      departmentName: "000095643228282",
      disasterId: "D-123",
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Talegaon",
      city: "Lohgaon",
    },
    {
      departmentName: "000095643228282",
      disasterId: "D-123",
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Talegaon",
      city: "Lohgaon",
    },
    {
      departmentName: "0000956432282",
      disasterId: "D-123",
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Talegaon",
      city: "Lohgaon",
    },
    // Add more dummy objects...
  ]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return departments.slice(start, end);
  }, [page, rowsPerPage, departments]);

  const labelColor = darkMode ? "#5FECC8" : "#1976d2";
  const borderColor = darkMode ? "#7F7F7F" : "#ccc";
  const fontFamily = "Roboto, sans-serif";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "#0a1929" : "#ffffff";
  const TableDataColor = darkMode
    ? "rgba(0, 0, 0, 0.04)"
    : "rgba(255, 255, 255, 0.16)";

  const inputBgColor = darkMode
    ? "rgba(255, 255, 255, 0.16)"
    : "rgba(0, 0, 0, 0.04)";

  const disasterOptions = [
    { id: 1, name: "Flood" },
    { id: 2, name: "Earthquake" },
    { id: 3, name: "Fire" },
  ];


  const saveDepartment = async () => {
    const payload = {
      dep_name: formValues.dep_name.trim(),
      dis_id: selectedDistrictId,
      state_id: selectedStateId,
      tah_id: selectedTehsilId,
      cit_id: selectedCityID || (Citys.length > 0 ? Citys[0].cit_id : ""),
    };

    // Check for duplicate entry before calling the API
  

    try {
      const res = await axios.post(
        `${port}/admin_web/department_post/`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newDepartment = {
        departmentName: res.data.dep_name,
        disasterId: getNameById(
          disasterIds,
          "dis_id",
          "dis_name",
          res.data.dis_id
        ),
        state: getNameById(states, "state_id", "state_name", res.data.state_id),
        city: getNameById(Citys, "cit_id", "cit_name", res.data.cit_id),
        tehsil: getNameById(Tehsils, "tah_id", "tah_name", res.data.tah_id),
        district: getNameById(districts, "dis_id", "dis_name", res.data.dis_id),
      };

      // Append to the state so no need to re-fetch entire list
      setDepartments((prev) => [newDepartment, ...prev]);

      // Optional: clear form
      setFormValues({ dep_name: "" });
      setSelectedStateId("");
      setSelectedDistrictId("");
      setSelectedTehsilId("");
      selectedCityID("");
    } catch (error) {
      console.error("Save Error:", error.response?.data || error.message);
    }
  };

  const getNameById = (list, idField, nameField, id) => {
    if (!Array.isArray(list) || id == null) return "-";
    const found = list.find((item) => item[idField] === id);
    return found ? found[nameField] : "-";
  };

  return (
    // ..
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "#5FECC8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <ArrowBackIosIcon
            sx={{ fontSize: 20, color: darkMode ? "#fff" : "#000" }}
          />{" "}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <AccountCircleIcon sx={{ color: labelColor }} /> */}
            <Typography
              variant="h6"
              sx={{
                color: labelColor,
                fontWeight: 600,
                fontFamily,
                fontSize: 16,
              }}
            >
              Add Employee
            </Typography>
            <TextField
              // variant="outlined"
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
          </Box>{" "}
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              backgroundColor: bgColor,
              p: 2,
              borderRadius: 2,
              color: textColor,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadingCard
                      sx={{
                        backgroundColor: "#5FECC8",
                        color: "#000",
                        display: "flex",
                        width: "100%",
                        borderRadius: 2,
                        p: 3,
                      }}
                    >
                      <StyledCardContent
                        sx={{
                          flex: 0.3,
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
                          flex: 1.2,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">
                          Department Name
                        </Typography>
                      </StyledCardContent>
                      {/* <StyledCardContent
                        sx={{
                          flex: 1.2,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">Disaster ID</Typography>
                      </StyledCardContent> */}
                      <StyledCardContent
                        sx={{
                          flex: 1,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">State</Typography>
                      </StyledCardContent>
                      <StyledCardContent
                        sx={{
                          flex: 1,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">District</Typography>
                      </StyledCardContent>
                      <StyledCardContent
                        sx={{
                          flex: 1,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">Tehsil</Typography>
                      </StyledCardContent>
                      <StyledCardContent
                        sx={{
                          flex: 1,
                          justifyContent: "center",
                          borderRight: "1px solid black",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">City</Typography>
                      </StyledCardContent>
                      <StyledCardContent
                        sx={{
                          flex: 0.8,
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">Actions</Typography>
                      </StyledCardContent>
                    </TableHeadingCard>
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
                    paginatedData
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((item, index) => (
                        <TableDataCardBody
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
                          <StyledCardContent
                            sx={{ flex: 0.3, justifyContent: "center" }}
                          >
                            <Typography variant="subtitle2" sx={fontsTableBody}>
                              {(page - 1) * rowsPerPage + index + 1}
                            </Typography>
                          </StyledCardContent>
                          <StyledCardContent
                            sx={{
                              flex: 1.4,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.departmentName}
                            </Typography>
                          </StyledCardContent>
                          {/* <StyledCardContent
                            sx={{
                              flex: 1.5,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.disaster}
                            </Typography>
                          </StyledCardContent> */}
                          <StyledCardContent
                            sx={{
                              flex: 1,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.state}
                            </Typography>
                          </StyledCardContent>
                          <StyledCardContent
                            sx={{
                              flex: 1,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.district}
                            </Typography>
                          </StyledCardContent>
                          <StyledCardContent
                            sx={{
                              flex: 0.8,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.tehsil}
                            </Typography>
                          </StyledCardContent>
                          <StyledCardContent
                            sx={{
                              flex: 1.3,
                              justifyContent: "center ",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.city}
                            </Typography>
                          </StyledCardContent>
                          <StyledCardContent
                            sx={{
                              flex: 1,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <MoreHorizIcon
                              onClick={(e) => handleOpen(e, item)}
                              sx={{
                                color: "#00f0c0",
                                cursor: "pointer",
                                // fontSize: 35,
                                justifyContent: "center",
                                ...fontsTableBody,
                              }}
                            />
                          </StyledCardContent>
                        </TableDataCardBody>
                      ))
                  )}
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
                    page < Math.ceil(departments.length / rowsPerPage) &&
                    setPage(page + 1)
                  }
                  sx={{
                    cursor:
                      page < Math.ceil(departments.length / rowsPerPage)
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

        {/* Department Registration Form */}
        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              backgroundColor: bgColor,
              p: 2,
              borderRadius: 2,
              color: textColor,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Typography
              sx={{
                color: labelColor,
                fontWeight: 600,
                fontSize: 16,
                fontFamily: "Roboto",
                mb: 2,
                // fontFamily,
              }}
            >
              Add User
            </Typography>

            <Grid container spacing={2}>
              {/* Department Name - TextField */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Department Name"
                  value={formValues.dep_name}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      dep_name: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: false }}
                  sx={selectStyles}
                />
              </Grid>

              {/* State - Dropdown */}
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={selectedStateId}
                  onChange={(e) => setSelectedStateId(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Select State" }}
                  sx={selectStyles}
                >
                  <MenuItem value="" disabled>
                    <em>Select State</em>
                  </MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state.state_id} value={state.state_id}>
                      {state.state_name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* District - Dropdown */}
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  displayEmpty
                  defaultValue=""
                  inputProps={{ "aria-label": "Select District" }}
                  disabled={!selectedStateId}
                  sx={selectStyles}
                >
                  <MenuItem value="" disabled>
                    Select District
                  </MenuItem>
                  {districts.map((districts) => (
                    <MenuItem key={districts.dis_id} value={districts.dis_id}>
                      {districts.dis_name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Tehsil - Dropdown */}
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  displayEmpty
                  value={selectedTehsilId}
                  onChange={(e) => setSelectedTehsilId(e.target.value)}
                  defaultValue=""
                  inputProps={{ "aria-label": "Select Tehsil" }}
                  sx={selectStyles}
                  disabled={!selectedDistrictId} // 🔒 Disable when no district selected
                >
                  <MenuItem value="" disabled>
                    Select Tehsil
                  </MenuItem>
                  {Tehsils.map((Tehsils) => (
                    <MenuItem key={Tehsils.tah_id} value={Tehsils.tah_id}>
                      {Tehsils.tah_name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* City - Dropdown */}
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  displayEmpty
                  defaultValue=""
                  inputProps={{ "aria-label": "Select City" }}
                  sx={selectStyles}
                >
                  <MenuItem value="" disabled>
                    Select City
                  </MenuItem>
                  {Citys.map((city) => (
                    <MenuItem key={city.cit_id} value={city.cit_id}>
                      {city.cit_name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Disaster ID - Dropdown */}
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  displayEmpty
                  defaultValue=""
                  value={formValues.dis_id || ""}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      dis_id: e.target.value,
                    }))
                  }
                  inputProps={{ "aria-label": "Select Disaster" }}
                  sx={selectStyles}
                >
                  <MenuItem
                    value=""
                    disabled
                    sx={{ backgroundColor: inputStyle }}
                  >
                    Select Disaster ID
                  </MenuItem>
                  {disaster.map((d) => (
                    <MenuItem key={d.dis_id} value={d.dis_id}>
                      {d.dis_id}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                    mb: 1,
                  }}
                >
                  <Button
                    variant="contained"
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
                    onClick={saveDepartment}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddDepartment;
