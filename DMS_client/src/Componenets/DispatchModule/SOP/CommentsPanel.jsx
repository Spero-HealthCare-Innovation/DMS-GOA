import { useEffect, useState, useRef, useMemo } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Skeleton,
  Avatar,
  Stack,
  Tooltip,
} from "@mui/material";
import { useAuth } from "../../../Context/ContextAPI";

function CommentsPanel({
  darkMode,
  setFlag,
  flag,
  selectedIncident,
  selectedResponders,
  setSelectedResponders,
  fetchDispatchList,
  incidentDetails,
  fetchIncidentDetails,
  highlightedId,
  setHighlightedId,
}) {
  const port = import.meta.env.VITE_APP_API_KEY;
  const userName = localStorage.getItem("userId");
  const { newToken, commentText, setCommentText } = useAuth();
  const Token = localStorage.getItem("access_token");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  console.log(selectedIncident, "selectedIncident in Comment");

  // const [commentText, setCommentText] = useState("");

  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [allComments, setAllComments] = useState([]);
  console.log(commentText, "allCommentsssssssssss");

  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const bottomRef = useRef(null);

  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "202328" : "#ffffff";

  const paperStyle = {
    padding: 1,
    marginTop: 0.5,
    borderRadius: 3,
    width: "100%",
    // maxWidth: 600,
    // minHeight: 220,
    // maxHeight: 800,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: bgColor,
    color: textColor,
    transition: "background-color 0.5s ease-in-out, color 0.5s ease-in-out",
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(`${port}/admin_web/comment_get`);
      const data = await response.json();
      setAllComments(data || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fetchIncidentDetails]);

  const handlealertSaveClick = async () => {
    if (!commentText.trim()) return;

    const payload = {
      responder_scope: selectedResponders.map(String),
      alert_id: selectedIncident?.pk_id,
      disaster_type: selectedIncident?.disaster_id_id,
      comments: commentText,
      comm_added_by: userName,
      inc_added_by: userName,
      latitude: selectedIncident?.latitude,
      longitude: selectedIncident?.longitude,
      alert_type: selectedIncident?.alert_type,
      mode: "2",
    };

    try {
      const response = await fetch(`${port}/admin_web/DMS_Incident_Post/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token || newToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Dispatch alert sent successfully!",
          severity: "success",
        });
        setCommentText("");
        setSelectedResponders([]);
        setFlag(0);

        setHighlightedId(null);
        await fetchDispatchList();
      } else {
        throw new Error("API Error");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to send dispatch alert.",
        severity: "error",
      });
    }
  };

  // const handleCommentSendClick = async () => {
  //   if (!commentText.trim()) return;

  //   try {
  //     const response = await fetch(
  //       `${port}/admin_web/comments_post/${selectedIncident?.inc_id}/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${Token || newToken}`,
  //         },
  //         body: JSON.stringify({
  //           comments: commentText,
  //           comm_added_by: userName,
  //         }),
  //       }
  //     );

  //     // if (!response.ok) throw new Error("Failed to send comment.");

  //     // const secondResponse = await fetch(`http://210.212.165.119/Spero_DMS/dms/alert_details`, {
  //     //   method: "POST",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //     Authorization: `Bearer ${Token || newToken}`,
  //     //   },
  //     //   body: JSON.stringify({
  //     //     caller_name: selectedIncident?.incident_details[0]?.caller_name || null,
  //     //     caller_no: selectedIncident?.incident_details[0]?.caller_no || null,
  //     //     disaster_name: selectedIncident?.incident_details[0]?.disaster_name || null,
  //     //     location: selectedIncident?.incident_details[0]?.location || null,
  //     //     summary: selectedIncident?.incident_details[0]?.summary || null,
  //     //     units: "1",
  //     //     inc_type: selectedIncident?.incident_details[0]?.inc_type || null,
  //     //     incident_id: selectedIncident?.incident_id || null,
  //     //     latitude: selectedIncident?.incident_details[0]?.latitude || null,
  //     //     longitude: selectedIncident?.incident_details[0]?.longitude || null,
  //     //     // alert_type: selectedIncident?.alert_type || null,
  //     //   }),
  //     // });

  //     if (!response.ok)
  //       throw new Error("Failed to log comment activity.");
  //     setSnackbar({
  //       open: true,
  //       message: "Comment sent successfully!",
  //       severity: "success",
  //     });

  //     setCommentText("");
  //     await fetchDispatchList();
  //     fetchIncidentDetails();
  //   } catch (err) {
  //     console.error(err);
  //     setSnackbar({
  //       open: true,
  //       message: "Failed to send comment.",
  //       severity: "error",
  //     });
  //   }
  // };

  const handleCommentSendClick = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(
        `${port}/admin_web/comments_post/${selectedIncident?.inc_id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token || newToken}`,
          },
          body: JSON.stringify({
            comments: commentText,
            comm_added_by: userName,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to log comment activity.");

      setSnackbar({
        open: true,
        message: "Comment sent successfully!",
        severity: "success",
      });

      setCommentText("");
      await fetchDispatchList();
      fetchIncidentDetails();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to send comment.",
        severity: "error",
      });
    }
  };

  // const handleCommentSendClick = async () => {
  //   if (!commentText.trim()) return;

  //   try {
  //     const response = await fetch(
  //       `${port}/admin_web/comments_post/${selectedIncident?.inc_id}/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${Token || newToken}`,
  //         },
  //         body: JSON.stringify({
  //           comments: commentText,
  //           comm_added_by: userName,
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //       const newComment = {
  //         comments: commentText,
  //         comm_added_by: userName,
  //         comm_id: Date.now(),
  //         incident_id: selectedIncident?.inc_id,
  //          comm_created_at: new Date().toISOString(),
  //       };

  //       setAllComments((prev) => [...prev, newComment]);

  //       setSnackbar({
  //         open: true,
  //         message: "Comment sent successfully!",
  //         severity: "success",
  //       });

  //       setCommentText("");
  //       fetchDispatchList();
  //     } else {
  //       throw new Error("Failed to send comment.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setSnackbar({
  //       open: true,
  //       message: "Failed to send comment.",
  //       severity: "error",
  //     });
  //   }
  // };

  const getInitials = (name) => name?.charAt(0)?.toUpperCase() || "?";
  const incidentComments = useMemo(() => {
    if (
      Array.isArray(incidentDetails?.comments) &&
      incidentDetails.comments.length > 0
    ) {
      return incidentDetails.comments;
    }
    if (selectedIncident) {
      return allComments.filter(
        (item) => String(item?.incident_id) === String(selectedIncident?.inc_id)
      );
    }
    return [];
  }, [incidentDetails, allComments, selectedIncident]);

  return (
    <Paper elevation={1} sx={paperStyle}>
      {flag !== 1 && selectedIncident?.inc_id && (
        <Box
          mb={2}
          sx={{
            minHeight: 150,
            maxHeight: 150,

            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            px: 1,
            pr: 0.5,
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
          }}
        >
          {incidentComments.length > 0 ? (
            incidentComments.map(
              ({
                comm_id,
                comments: commentMsg,
                comm_added_by,
                comm_created_at,
              }) => {
                const isOwnComment = comm_added_by === userName;
                return (
                  <Box
                    key={comm_id}
                    sx={{
                      display: "flex",
                      justifyContent: isOwnComment ? "flex-end" : "flex-start",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-end">
                      {!isOwnComment && (
                        <Tooltip title={comm_added_by} arrow>
                          <Avatar sx={{ bgcolor: "#0288d1", fontSize: 14 }}>
                            {comm_added_by
                              ? comm_added_by.charAt(0).toUpperCase()
                              : "U"}
                          </Avatar>
                        </Tooltip>
                      )}
                      <Box
                        sx={{
                          backgroundColor: isOwnComment
                            ? darkMode
                              ? "#0f766e"
                              : "#d1fae5"
                            : darkMode
                            ? "rgb(77,77,77)"
                            : "#f3f4f6",
                          color: isOwnComment
                            ? darkMode
                              ? "#e0f2f1"
                              : "#065f46"
                            : darkMode
                            ? "#e2e8f0"
                            : "#111827",
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          maxWidth: "80%",
                          wordBreak: "break-word",
                          whiteSpace: "pre-line",
                          textAlign: "left",
                        }}
                      >
                        <Typography variant="body2">
                          {commentMsg || "No comment message"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "0.7rem", opacity: 0.7 }}
                        >
                          {new Date(
                            comm_created_at || Date.now()
                          ).toLocaleTimeString()}
                        </Typography>
                      </Box>
                      {isOwnComment && (
                        <Tooltip title={comm_added_by} arrow>
                          <Avatar sx={{ bgcolor: "#6a1b9a", fontSize: 14 }}>
                            {comm_added_by
                              ? comm_added_by.charAt(0).toUpperCase()
                              : "?"}
                          </Avatar>
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>
                );
              }
            )
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments for this incident.
            </Typography>
          )}
          <div ref={bottomRef} />
        </Box>
      )}

      {/* Input + Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: darkMode ? "rgb(77,77,77)" : "#f9f9f9",
          borderRadius: 2,
          px: 1,
          py: 0.5,
          mt: 1,
        }}
      >
        <TextField
          placeholder={placeholderVisible ? "Type a comment..." : ""}
          variant="standard"
          fullWidth
          multiline
          maxRows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onFocus={() => setPlaceholderVisible(false)}
          onBlur={(e) => {
            if (e.target.value.trim() === "") setPlaceholderVisible(true);
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: "0.9rem",
              color: textColor,
              px: 1,
              py: 0.5,
            },
          }}
          sx={{ backgroundColor: "transparent" }}
        />

        <Button
          variant="contained"
          color={flag === 1 ? "primary" : "secondary"}
          onClick={flag === 1 ? handlealertSaveClick : handleCommentSendClick}
          disabled={!commentText.trim()}
          sx={{ borderRadius: 2, px: 3, whiteSpace: "nowrap", height: "100%" }}
        >
          {flag === 1 ? "Save" : "Send"}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default CommentsPanel;
