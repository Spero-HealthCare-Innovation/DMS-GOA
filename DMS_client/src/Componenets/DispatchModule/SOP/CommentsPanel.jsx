import { useEffect, useState, useRef } from "react";
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
  comments,
  incidentDetails,
}) {
  const port = import.meta.env.VITE_APP_API_KEY;
  const userName = localStorage.getItem("userId");
  const { newToken } = useAuth();
  const Token = localStorage.getItem("access_token");
  console.log(selectedIncident?.inc_id, 'selectedIncidentincommentapanel');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [commentText, setCommentText] = useState("");
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [allComments, setAllComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const bottomRef = useRef(null); // 👈 Ref for auto scroll

  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "#0a1929" : "#ffffff";

  const paperStyle = {
    padding: 1,
    marginTop: 0.5,
    borderRadius: 3,
    maxHeight: 800,
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
      setAllComments(data);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (flag !== 0) {
      fetchComments();
    }
  }, [flag, selectedIncident]);



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
        fetchDispatchList();
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

  const handleCommentSendClick = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(
        `${port}/admin_web/comments_post/${incidentDetails?.inc_id}/`,
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

      if (response.ok) {
        const newComment = {
          comments: commentText,
          comm_added_by: userName,
          comm_id: Date.now(),
        };

        setAllComments((prev) => [...prev, newComment]);

        setSnackbar({
          open: true,
          message: "Comment sent successfully!",
          severity: "success",
        });

        setCommentText("");
        fetchDispatchList();

        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        throw new Error("Failed to send comment.");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to send comment.",
        severity: "error",
      });
    }
  };

  const getInitials = (name) => name?.charAt(0)?.toUpperCase() || "?";

  return (
    <Paper elevation={1} sx={paperStyle}>
      <Typography variant="h6" mb={2} color="#5FECC8">
        Comments
      </Typography>

      {/* Comments Display */}
      {flag !== 1 && (
        <>
          {
            selectedIncident?.inc_id === undefined ? (
              <Typography variant="body2"></Typography>
            )
              :
              (
                <Box
                  mb={2}
                  sx={{
                    height: 100,
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
                      backgroundColor: darkMode ? "#5FECC8" : "#888",
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: darkMode ? "#48c7ab" : "#555",
                    },
                  }}
                >
                  {isLoadingComments ? (
                    [...Array(3)].map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="rectangular"
                        height={30}
                        animation="wave"
                        sx={{
                          borderRadius: 2,
                          my: 0.5,
                          width: i % 2 === 0 ? "80%" : "60%",
                          alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                          bgcolor: darkMode ? "#1e293b" : "#e0e0e0",
                        }}
                      />
                    ))
                  ) : allComments && allComments.length > 0 ? (
                    allComments.map(({ comm_id, comments: commentMsg, comm_added_by }) => {
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
                              <Avatar sx={{ bgcolor: "#0288d1", fontSize: 14 }}>
                                {getInitials(comm_added_by)}
                              </Avatar>
                            )}
                            <Box
                              sx={{
                                backgroundColor: isOwnComment
                                  ? darkMode
                                    ? "#0f766e"
                                    : "#d1fae5"
                                  : darkMode
                                    ? "#1e293b"
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
                                {commentMsg || "no comment Message"}
                              </Typography>
                            </Box>
                            {isOwnComment && (
                              <Avatar sx={{ bgcolor: "#6a1b9a", fontSize: 14 }}>
                                {getInitials(comm_added_by)}
                              </Avatar>
                            )}
                          </Stack>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No comments yet.
                    </Typography>
                  )}
                  <div ref={bottomRef} />
                </Box>
              )
          }
        </>
      )}

      {/* Input + Send/Save Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: darkMode ? "#1e293b" : "#f9f9f9",
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

      {/* Snackbar Message */}
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
