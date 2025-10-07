"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Button,
  createTheme,
  Modal,
  TextField,
  Typography,
  ThemeProvider,
  MenuItem,
} from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineMail } from "react-icons/md";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import Loader from "../../Loader/Loader";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

type Props = {
  isTeam: boolean;
};

// Define Course interface if needed
interface Course {
  _id: string;
  title?: string;
}

// User interface from API
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  courses: Course[];
  createdAt: string;
}

// DataGrid row type
interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: number;
  created_at: string;
}

interface UpdateUserRolePayload {
  id: string;
  role: string;
}

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [userId, setUserId] = useState("");
  const [open, setOpen] = useState(false);

  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("User deleted successfully!");
      refetch();
    }
    if (deleteError && "data" in deleteError) {
      const errorMessage = deleteError as { data?: { message?: string } };
      toast.error(errorMessage.data?.message || "Failed to delete user");
    }
  }, [deleteSuccess, deleteError, refetch]);

  const handleDelete = async (userId: string) => {
    await deleteUser(userId);
    setOpen(false);
  };

  const handleAddMember = async () => {
    try {
      if (!email) {
        toast.error("Please enter an email!");
        return;
      }

      const user: User | undefined = data?.users.find(
        (u: User) => u.email === email
      );
      if (!user) {
        toast.error("User not found!");
        return;
      }

      const payload: UpdateUserRolePayload = { id: user._id, role };
      await updateUserRole(payload).unwrap();

      toast.success("User role updated successfully!");
      setActive(false);
      setEmail("");
      setRole("admin");
      refetch();
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const e = err as { data?: { message?: string } };
        toast.error(e.data?.message || "Failed to update role");
      } else {
        toast.error("Failed to update role");
      }
    }
  };

  // Global theme config
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme === "dark" ? "dark" : "light",
          primary: { main: theme === "dark" ? "#57c7a3" : "#2563eb" },
          error: { main: "#dc2626" },
          background: {
            default: theme === "dark" ? "#111827" : "#f9fafb",
            paper: theme === "dark" ? "#1f2937" : "#ffffff",
          },
          text: {
            primary: theme === "dark" ? "#f3f4f6" : "#111827",
            secondary: theme === "dark" ? "#9ca3af" : "#4b5563",
          },
        },
        shape: { borderRadius: 16 },
        typography: {
          fontFamily: "Inter, sans-serif",
          button: { textTransform: "none", fontWeight: 500 },
        },
      }),
    [theme]
  );

  // DataGrid columns
  const columns: GridColDef<UserRow>[] = [
    { field: "id", headerName: "ID", flex: 0.6 },
    { field: "name", headerName: "Name", flex: 0.6 },
    { field: "email", headerName: "Email", flex: 0.8 },
    { field: "role", headerName: "Role", flex: 0.4 },
    { field: "courses", headerName: "Courses", flex: 0.4 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
    {
      field: "emailIcon",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <Box
          component="a"
          href={`mailto:${params.row.email}`}
          target="_blank"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <MdOutlineMail
            size={20}
            style={{ color: theme === "dark" ? "#f3f4f6" : "#111827" }}
          />
        </Box>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <Button
          onClick={() => {
            setOpen(true);
            setUserId(params.row.id);
          }}
        >
          <AiOutlineDelete
            size={20}
            className={theme === "dark" ? "text-red-400" : "text-red-600"}
          />
        </Button>
      ),
    },
  ];

  // Data rows
  const rows: UserRow[] = [];
  const userData: User[] | undefined = isTeam
    ? data?.users.filter((u: User) => u.role === "admin")
    : data?.users;

  userData?.forEach((item: User) =>
    rows.push({
      id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      courses: item.courses.length,
      created_at: format(item.createdAt),
    })
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="mt-[100px] ml-[20px]">
        {isLoading ? (
          <Loader />
        ) : (
          <Box p={2}>
            {/* Top Bar */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="contained"
                onClick={() => setActive(true)}
                sx={{ borderRadius: "12px", px: 3, py: 1 }}
              >
                Add Member
              </Button>
            </Box>

            {/* DataGrid */}
            <Box
              sx={{
                height: "80vh",
                "& .MuiDataGrid-root": {
                  border: "none",
                  borderRadius: "12px",
                  boxShadow:
                    theme === "dark"
                      ? "0px 4px 20px rgba(0,0,0,0.5)"
                      : "0px 4px 20px rgba(0,0,0,0.1)",
                  backgroundColor:
                    theme === "dark" ? "#1f2937" : "#ffffff",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor:
                    theme === "dark"
                      ? "#1e3a8a !important"
                      : "#3b82f6 !important",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                },
                "& .MuiDataGrid-cell": {
                  color: theme === "dark" ? "#f3f4f6" : "#111827",
                },
              }}
            >
              <DataGrid checkboxSelection rows={rows} columns={columns} />
            </Box>
          </Box>
        )}

        {/* Add Member Modal */}
        <Modal open={active} onClose={() => setActive(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" mb={2} sx={{ color: "text.primary" }}>
              Add New Member
            </Typography>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { color: muiTheme.palette.text.secondary } }}
              InputProps={{ style: { color: muiTheme.palette.text.primary } }}
            />
            <TextField
              fullWidth
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ mb: 3 }}
              InputLabelProps={{ style: { color: muiTheme.palette.text.secondary } }}
              InputProps={{ style: { color: muiTheme.palette.text.primary } }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </TextField>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={() => setActive(false)}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: theme === "dark" ? "#374151" : "#e5e7eb",
                  color: theme === "dark" ? "#f3f4f6" : "#111827",
                  "&:hover": { backgroundColor: theme === "dark" ? "#4b5563" : "#d1d5db" },
                }}
              >
                Cancel
              </Button>
              <Button variant="contained" sx={{ borderRadius: "12px" }} onClick={handleAddMember}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 350,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={1} sx={{ color: "text.primary" }}>
              Delete User?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone.
            </Typography>
            <Box display="flex" justifyContent="center" gap={2} mt={3}>
              <Button
                onClick={() => setOpen(false)}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: theme === "dark" ? "#374151" : "#e5e7eb",
                  color: theme === "dark" ? "#f3f4f6" : "#111827",
                  "&:hover": { backgroundColor: theme === "dark" ? "#4b5563" : "#d1d5db" },
                }}
              >
                Cancel
              </Button>
              <Button variant="contained" color="error" sx={{ borderRadius: "12px" }} onClick={() => handleDelete(userId)}>
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
};

export default AllUsers;
