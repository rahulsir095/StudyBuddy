"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  createTheme,
  Modal,
  Typography,
  ThemeProvider,
} from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { useTheme } from "next-themes";
import { useDeleteCourseMutation, useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import Loader from "../../Loader/Loader";
import toast from "react-hot-toast";
import Link from "next/link";

const AllCourses = () => {
  const { theme } = useTheme();
  const [openDelete, setOpenDelete] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data,refetch } = useGetAllCoursesQuery({},
    { refetchOnMountOrArgChange: true });
  const [deleteCourse,{isSuccess,error}] = useDeleteCourseMutation();

  // Theme
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


  const columns = [
    { field: "id", headerName: "ID", flex: 0.6 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "rating", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "createdAt", headerName: "Created At", flex: 0.5 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.3,
      renderCell: (params: any) => (
  <Box className="flex items-center justify-center w-full h-full">
    <Link href={`/admin/edit-course/${params.row.id}`}>
      <FiEdit2
        size={20}
        className={theme === "dark" ? "text-white" : "text-black"}
      />
    </Link>
  </Box>
),

    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setCourseId(params.row.id);
            setOpenDelete(true);
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

  const rows: any = [];
  data?.courses.forEach((item: any) => {
    rows.push({
      id: item._id,
      title: item.name,
      rating: item.ratings,
      purchased: item.purchased,
      createdAt: format(item.createdAt),
    });
  });

  useEffect(()=>{
     if(isSuccess){
      toast.success("Course Deleted Successfully.");
      refetch();
     }
     if(error){
      if("data" in error){
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
     }
  },[isSuccess,error]);

  const handleCourseDelete = async()=>{
    const id = courseId;
    setOpenDelete(false);
    await deleteCourse(id);
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="mt-[100px]">
        {isLoading ? (
          <Loader />
        ) : (
          <Box p={2}>
            <Box
              sx={{
                height: "85vh",
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
                  backgroundColor: theme === "dark" ? "#1e3a8a !important" : "#3b82f6 !important",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: theme === "dark" ? "#1e3a8a !important" : "#3b82f6 !important",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "15px",
                },
                "& .MuiDataGrid-cell": {
                  color: theme === "dark" ? "#f3f4f6" : "#111827",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: theme === "dark" ? "#1e3a8a" : "#2563eb",
                  color: "#ffffff",
                },
              }}
            >
              <DataGrid checkboxSelection rows={rows} columns={columns} showToolbar />
            </Box>
          </Box>
        )}

        {/* Delete Confirmation Modal */}
        <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
          <Box
            sx={{
              position: "absolute" as "absolute",
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
              Delete Course?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone.
            </Typography>
            <Box display="flex" justifyContent="center" gap={2} mt={3}>
              <Button
                onClick={() => setOpenDelete(false)}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: theme === "dark" ? "#374151" : "#e5e7eb",
                  color: theme === "dark" ? "#f3f4f6" : "#111827",
                  "&:hover": {
                    backgroundColor: theme === "dark" ? "#4b5563" : "#d1d5db",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ borderRadius: "12px" }}
                onClick={handleCourseDelete}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
};

export default AllCourses;
