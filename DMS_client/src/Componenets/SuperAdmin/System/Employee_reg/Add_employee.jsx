import { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper, InputAdornment, Grid, Popover, Snackbar } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Search, ArrowBack, DeleteOutline, EditOutlined, } from "@mui/icons-material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Alert } from '@mui/material';
import { styled } from "@mui/material/styles";
import dayjs from 'dayjs';
import { Select, MenuItem, IconButton, Popper } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import { useAuth } from './../../../../Context/ContextAPI';

function Add_employee({ darkMode }) {
  const port = import.meta.env.VITE_APP_API_KEY;

  const {
    states,
    districts,
    Tehsils,
    Citys,
    selectedStateId,
    selectedDistrictId,
    selectedTehsilId,
    selectedCityID,
    setSelectedStateId,
    setSelectedDistrictId,
    setSelectedTehsilId,
    setSelectedCityId,
    loading,
    error,
  } = useAuth();


  const [empName, setEmpName] = useState('');
  const [empContact, setEmpContact] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDOJ, setEmpDOJ] = useState('');
  const [empDOB, setEmpDOB] = useState('');
  const [groupId, setGroupId] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [employees, setEmployees] = useState([]);


  // Format date properly for API submission
  const formatDate = (date) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // gets YYYY-MM-DD
    } catch (err) {
      console.error("Date formatting error:", err);
      return '';
    }
  };

  const formattedDOB = formatDate(empDOB);
  const formattedDOJ = formatDate(empDOJ);


  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleStateChange = (e) => {
    setSelectedStateId(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrictId(e.target.value);
  };

  const handleTehsilChange = (e) => {
    setSelectedTehsilId(e.target.value);
  };

  const handleCityChange = (e) => {
    setSelectedCityId(e.target.value);
  };

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


  const inputStyle = {
    // Set desired width
    height: "3rem",
    '& .MuiInputBase-input': {
      color: textColor,
    },
    '& .MuiInputBase-root': {
      height: "100%",             // Ensure input wrapper matches height
      padding: "0 12px",          // Horizontal padding
      display: 'flex',
      alignItems: 'center',       // Center content vertically
    },
    borderRadius: '12px',
    '& fieldset': {
      border: 'none', // Remove border
    },
    backgroundColor: inputBgColor,
    '& input::placeholder': {
      fontSize: '0.85rem',
      color: textColor,
    },
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', // Add box shadow
    '&:hover': {
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Increase shadow on hover
    }
  }



  // const alerts = [
  //   {
  //     empName: "Akshata",
  //     empContact: "9876543212",
  //     empDOJ: "22-02-25",
  //     groupID: "G-2323",
  //     state: "maharashtra"
  //   },
  //   {
  //     empName: "Sneha",
  //     empContact: "9876543212",
  //     empDOJ: "22-02-25",
  //     groupID: "G-2323",
  //     state: "maharashtra"
  //   },
  //   {
  //     empName: "Shubham",
  //     empContact: "9876543212",
  //     empDOJ: "22-02-25",
  //     groupID: "G-2323",
  //     state: "maharashtra"
  //   },
  //   {
  //     empName: "Anjali",
  //     empContact: "9876543212",
  //     empDOJ: "22-02-25",
  //     groupID: "G-2323",
  //     state: "maharashtra"
  //   },
  //   {
  //     empName: "Prajata",
  //     empContact: "9876543212",
  //     empDOJ: "22-02-25",
  //     groupID: "G-2323",
  //     state: "maharashtra"
  //   },
  //   {
  //     empName: "Mayank",
  //     empContact: "9876543212",
  //     empDOJ: "22-02-25",
  //     groupID: "G-2323",
  //     state: "maharashtra"
  //   },
  //   {
  //     empName: "Nikita",
  //     empContact: "9876543212",
  //     empDOJ: "22-02-25",
  //     groupID: "G-2323",
  //     state: "maharashtra"
  //   },

  // ];


  const open = Boolean(anchorEl);
  const handleOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };



  // POST API INTEGRATION FOR EMPLOYEE

  // Form submission
  // const handleSubmit = async () => {
  //   if (!empName || !empContact || !empEmail || !empDOJ || !empDOB || !groupId ||
  //     !selectedStateId || !selectedDistrictId || !selectedTehsilId || !selectedCityID) {
  //     alert("Please fill all required fields");
  //     return;
  //   }

  //   const payload = {
  //     emp_username: empName,
  //     grp_id: groupId,
  //     emp_email: empEmail,
  //     emp_name: empName,
  //     emp_contact_no: empContact,
  //     emp_doj: formatDate(empDOJ),
  //     emp_dob: formatDate(empDOB),
  //     emp_is_login: "0",
  //     state_id: selectedStateId,
  //     dist_id: selectedDistrictId,
  //     tahsil_id: selectedTehsilId,
  //     city_id: selectedCityID,
  //     emp_is_deleted: "0",
  //     emp_added_by: "1",
  //     emp_modified_by: "1",
  //     password: "DMS@Spero",
  //     password2: "DMS@Spero"
  //   };

  //   try {
  //     console.log("Sending employee data:", payload);
  //     const res = await axios.post(`${port}/admin_web/employee_post/`, payload);
  //     console.log("Employee Registered:", res.data);

  //     setShowSuccessAlert(true);

  //     // Optional: Auto-hide after 3 seconds
  //     setTimeout(() => setShowSuccessAlert(false), 3000);

  //     // Reset form after successful submission
  //     setEmpName('');
  //     setEmpContact('');
  //     setEmpEmail('');
  //     setEmpDOJ('');
  //     setEmpDOB('');
  //     setGroupId('');
  //     setSelectedStateId('');
  //     setSelectedDistrictId('');
  //     setSelectedTehsilId('');
  //     setSelectedCityId('');

  //     // alert("Employee added successfully!");
  //   } catch (err) {
  //     console.error("Error creating employee:", err.response?.data || err.message);
  //     alert("Failed to add employee. Please check the console for details.");
  //   }
  // };

  const initialEmployeeData = [
    {
      empName: "Akshata",
      empContact: "9876543212",
      empDOJ: "22-02-25",
      groupID: "G-2323",
      state: "maharashtra"
    },
    {
      empName: "Sneha",
      empContact: "9876543212",
      empDOJ: "22-02-25",
      groupID: "G-2323",
      state: "maharashtra"
    }
  ]

  const handleSubmit = async () => {
    if (!empName || !empContact || !empEmail || !empDOJ || !empDOB || !groupId ||
      !selectedStateId || !selectedDistrictId || !selectedTehsilId || !selectedCityID) {
      alert("Please fill all required fields");
      return;
    }

    // Generate a unique username based on name and timestamp
    const timestamp = new Date().getTime();
    const uniqueUsername = `${empName.replace(/\s+/g, '_').toLowerCase()}_${timestamp}`;

    const payload = {
      emp_username: uniqueUsername, // Use unique username to avoid conflict
      grp_id: groupId,
      emp_email: `${uniqueUsername}@example.com`, // Generate unique email to avoid conflict
      emp_name: empName,
      emp_contact_no: empContact,
      emp_doj: formatDate(empDOJ),
      emp_dob: formatDate(empDOB),
      emp_is_login: "0",
      state_id: selectedStateId,
      dist_id: selectedDistrictId,
      tahsil_id: selectedTehsilId,
      city_id: selectedCityID,
      emp_is_deleted: "0",
      emp_added_by: "1",
      emp_modified_by: "1",
      password: "DMS@Spero",
      password2: "DMS@Spero"
    };

    try {
      console.log("Sending employee data:", payload);
      const res = await axios.post(`${port}/admin_web/employee_post/`, payload);
      console.log("Employee Registered:", res.data);

      // Get state name from the states array
      const stateName = states.find(state => state.state_id === selectedStateId)?.state_name || "Unknown";

      await fetchEmployees();
      setShowSuccessAlert(true);

      // Optional: Auto-hide after 3 seconds
      setTimeout(() => setShowSuccessAlert(false), 3000);

      // Reset form after successful submission
      setEmpName('');
      setEmpContact('');
      setEmpEmail('');
      setEmpDOJ('');
      setEmpDOB('');
      setGroupId('');
      setSelectedStateId('');
      setSelectedDistrictId('');
      setSelectedTehsilId('');
      setSelectedCityId('');

    } catch (err) {
      console.error("Error creating employee:", err.response?.data || err.message);

      if (err.response?.data) {
        const errorData = err.response.data;
        let errorMessage = "Failed to add employee:\n";

        if (errorData.emp_username) {
          errorMessage += `- Username already exists\n`;
        }
        if (errorData.emp_email) {
          errorMessage += `- Email already exists\n`;
        }
        if (errorData.detail === "Employee with this emp_name already exists.") {
          errorMessage += `- Employee name already exists\n`;
        }

        alert(errorMessage);
      } else {
        alert("Failed to add employee. Please check the console for details.");
      }
    }

  };

  const paginatedData = employees; // ← this now comes from state

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${port}/admin_web/employee_get/`, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`, // Replace with actual token variable
        },
      });

      const employeeData = response.data.map(emp => {
        const stateName = states.find(state => state.state_id === emp.state_id)?.state_name || "Unknown";

        return {
          empName: emp.emp_name,
          empContact: emp.emp_contact_no,
          empDOJ: dayjs(emp.emp_doj).format("DD-MM-YY"),
          groupID: emp.grp_id,
          state: stateName,
          fullData: emp,
        };
      });

      setEmployees(employeeData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };


  useEffect(() => {
    fetchEmployees();
  }, []);



  return (
    <div style={{ marginLeft: "3.5rem" }}>
      <Snackbar
        open={showSuccessAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => setShowSuccessAlert(false)}
      
      >
        <Alert
          onClose={() => setShowSuccessAlert(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%'}}
        >
          Employee added successfully!
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
          Add Employee
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
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 1 }}>
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
                          Emp  Name
                        </Typography>
                      </StyledCardContent>
                      <StyledCardContent
                        sx={{
                          flex: 2.5,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">
                          Emp Contact
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
                          Emp DOJ
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
                          Group ID
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
                          State
                        </Typography>
                      </StyledCardContent>
                      <StyledCardContent
                        sx={{
                          flex: 2,
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">
                          Action
                        </Typography>
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
                    employees
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((item, index) => (

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
                          <StyledCardContent
                            sx={{ flex: 0.6, justifyContent: "center" }}
                          >
                            <Typography variant="subtitle2" sx={fontsTableBody}>
                              {(page - 1) * rowsPerPage + index + 1}
                            </Typography>
                          </StyledCardContent>

                          <StyledCardContent
                            sx={{
                              flex: 2,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.empName}
                            </Typography>
                          </StyledCardContent>
                          <StyledCardContent
                            sx={{
                              flex: 2,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.empContact}
                            </Typography>
                          </StyledCardContent>

                          <StyledCardContent
                            sx={{
                              flex: 2,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.empDOJ}
                            </Typography>
                          </StyledCardContent>
                          <StyledCardContent
                            sx={{
                              flex: 2,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.groupID}
                            </Typography>
                          </StyledCardContent>
                          <StyledCardContent
                            sx={{
                              flex: 2,
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
                              flex: 1.5,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
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
                    page < Math.ceil(employees.length / rowsPerPage) &&
                    setPage(page + 1)
                  }
                  sx={{
                    cursor:
                      page < Math.ceil(employees.length / rowsPerPage)
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
            color="warning"
            startIcon={<EditOutlined />}
            onClick={() => {
              if (selectedEmployee) {
                // Populate form with employee data
                setEmpName(selectedEmployee.empName);
                setEmpContact(selectedEmployee.empContact);
                setEmpEmail(selectedEmployee.empEmail);
                // Convert display date format back to YYYY-MM-DD for the input field
                const dateParts = selectedEmployee.empDOJ.split('-');
                if (dateParts.length === 3) {
                  const formattedDate = `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                  setEmpDOJ(formattedDate);
                }
                setGroupId(selectedEmployee.groupID);

                // If you have the full data stored in fullData property:
                if (selectedEmployee.fullData) {
                  setSelectedStateId(selectedEmployee.fullData.state_id);
                  setSelectedDistrictId(selectedEmployee.fullData.dist_id);
                  setSelectedTehsilId(selectedEmployee.fullData.tahsil_id);
                  setSelectedCityId(selectedEmployee.fullData.city_id);
                  setEmpDOB(selectedEmployee.fullData.emp_dob);
                }
              }
              handleClose();
            }}
          >
            Edit
          </Button>

// 9. Implement the delete functionality in the Popover
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<DeleteOutline />}
            onClick={() => {
              if (selectedEmployee) {
                // Filter out the selected employee from the employees array
                setEmployees(prev => prev.filter(emp =>
                  emp.empName !== selectedEmployee.empName ||
                  emp.empContact !== selectedEmployee.empContact));
              }
              handleClose();
            }}
          >
            Delete
          </Button>
        </Popover>

        <Grid item xs={12} md={4.9}>


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
              Add Employee
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First TextField */}
              <TextField
                fullWidth
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                placeholder="Employee Name"
                InputLabelProps={{ shrink: false }}
                sx={inputStyle}
              />
              {/* Second TextField */}
              <TextField
                fullWidth
                placeholder="Emp Contact No"
                value={empContact}
                onChange={(e) => setEmpContact(e.target.value)}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First TextField */}
              <TextField
                fullWidth
                placeholder="Employee Email"
                value={empEmail}
                onChange={(e) => setEmpEmail(e.target.value)}
                sx={inputStyle}
              />
              {/* Second TextField */}
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="date"
                placeholder="Emp DOJ"
                value={empDOJ}
                onChange={(e) => setEmpDOJ(e.target.value)}
                sx={selectStyles}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First TextField */}
              <TextField
                fullWidth
                placeholder="Group ID"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                sx={selectStyles}
              />
              {/* Second Select  */}
              <Select
                value={selectedStateId}
                onChange={handleStateChange}
                fullWidth
                displayEmpty
                placeholder="Select State"
                defaultValue=""
                inputProps={{
                  "aria-label": "Select State",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled sx={inputStyle}>
                  Select State
                </MenuItem>
                {states.map(state => (
                  <MenuItem key={state.state_id} value={state.state_id}>{state.state_name}</MenuItem>
                ))}


                {/* Add more options as needed */}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First Dropdown */}
              <Select
                fullWidth
                displayEmpty
                placeholder="Select District"
                defaultValue=""
                value={selectedDistrictId}
                onChange={handleDistrictChange}
                inputProps={{
                  "aria-label": "Select Name",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled>
                  Select District
                </MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district.dis_id} value={district.dis_id}>
                    {district.dis_name}
                  </MenuItem>
                ))}
                {/* Add more options as needed */}
              </Select>

              {/* Second Dropdown */}
              <Select
                fullWidth
                value={selectedTehsilId}
                onChange={handleTehsilChange}
                displayEmpty
                placeholder="Select Tehsil"
                defaultValue=""
                inputProps={{
                  "aria-label": "Select Name",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled>
                  Select Tehsil
                </MenuItem>
                {Tehsils.map((tehsil) => (
                  <MenuItem key={tehsil.tah_id} value={tehsil.tah_id}>
                    {tehsil.tah_name}
                  </MenuItem>
                ))}


                {/* Add more options as needed */}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First Dropdown */}
              <Select
                fullWidth
                displayEmpty
                value={selectedCityID}
                onChange={handleCityChange}
                placeholder="Select City"
                defaultValue=""
                inputProps={{
                  "aria-label": "Select Name",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled>
                  Select City
                </MenuItem>

                {Citys.map((city) => (
                  <MenuItem key={city.cit_id} value={city.cit_id}>
                    {city.cit_name}
                  </MenuItem>
                ))}

                {/* Add more options as needed */}
              </Select>

              {/* Second Textfield */}

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="date"
                placeholder="Employee DOB"
                value={empDOB}
                onChange={(e) => setEmpDOB(e.target.value)}
                sx={selectStyles}
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

export default Add_employee
