import React, { useEffect, useMemo, useState } from "react";
import { Box, createTheme,ThemeProvider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { MdOutlineMail } from "react-icons/md";

type Props = {
  isDashboard: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme } = useTheme();
  const { data, isLoading } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});
  const [orderData, setOrderData] = useState<any>([]);
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

  useEffect(() => {
    if (data && usersData && coursesData) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users.find(
          (user: any) => user._id === item.userId
        );
        const course = coursesData?.courses.find(
          (course: any) => course._id === item.courseId
        );
        return {
          ...item,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "N/A",
          title: course?.name || "Unknown Course",
          price: course ? `${course.price} ₹` : "N/A",
        };
      });

      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);


  const columns: any[] = [
    { field: "id", headerName: "ID", flex: 0.6 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },

    // Show Email & Course Title only when not dashboard
    ...(!isDashboard
      ? [
        {
          field: "userEmail",
          headerName: "Email",
          flex: 0.7,
          renderCell: (params: any) => {
            return (
              <div className="flex items-center gap-2">
                <MdOutlineMail className="text-xl"/>
                <a href={`mailto:${params.row.userEmail}`} className="text-black dark:text-white">
                  {params.row.userEmail}
                </a>
              </div>
            );
          },
        },
        { field: "title", headerName: "Course Title", flex: 1 },
      ]
      : []),

    { field: "price", headerName: "Price", flex: 0.5 },

    // Show Created At only on dashboard
    ...(isDashboard
      ? [{ field: "created_at", headerName: "Created At", flex: 0.5 }]
      : []),
  ];

  const rows: any[] =
    orderData?.map((item: any) => ({
      id: item._id,
      userName: item.userName,
      userEmail: item.userEmail,
      title: item.title,
      price: item.price,
      created_at: format(item.createdAt),
    })) || [];

  return (
    <ThemeProvider theme={muiTheme}>
    <div className={isDashboard ? "mt-[20px]" : "mt-[120px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m={isDashboard ? "0" : "40px"}>
          <Box
            m={isDashboard ? "0" : "40px 0 0 0"}
            height={isDashboard ? "35vh" : "85vh"}
            overflow={"hidden"}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
                transition: "background-color 0.2s ease-in-out", 
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme === "dark" ? "#374151 !important" : "#e5e7eb !important",
                cursor: "pointer",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#fff",
              },
              "& .MuiDataGrid-cell": {
                color: theme === "dark" ? "#f3f4f6" : "#111827",
              },
              "& .name-column--cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor:
                  theme === "dark" ? "#1e3a8a !important" : "#3b82f6 !important",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor:
                  theme === "dark" ? "#4972f5 !important" : "#4972f5 !important",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#4972f5" : "#4972f5",
              },
              "& .MuiCheckbox-root": {
                color: theme === "dark" ? "#b7ebde !important" : "#000 !important",
              },
              
            }}
          >
            <DataGrid
              checkboxSelection={!isDashboard}
              rows={rows}
              columns={columns}
              showToolbar={!isDashboard}             
            />
          </Box>
        </Box>
      )}
    </div>
    </ThemeProvider>
  );
};

export default AllInvoices;
