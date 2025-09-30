'use client';

import { FC, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";

import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  SettingsIcon,
  ExitToAppIcon,
} from "./Icon";

import avatarDefault from "../../../../public/assests/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface ItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const Item: FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Link href={to} passHref>
        <Typography className="!text-[16px] !font-Poppins text-slate-900 dark:text-white ">{title}</Typography>
      </Link>
    </MenuItem>
  );
};

const Sidebar: FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoutHandler = () => {
    setLogout(true);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${theme === "dark" ? "#0f172a !important" : "#f9fafb !important"}`,
          transition: "all 0.3s ease-in-out",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "8px 30px 8px 20px !important",
          color: theme === "dark" ? "#e2e8f0" : "#1e293b",
          fontWeight: 500,
          transition: "color 0.2s ease-in-out",
        },
        "& .pro-inner-item:hover": {
          color: "#6366f1 !important",
          background: `${theme === "dark" ? "#1e293b" : "#e0e7ff"} !important`,
          borderRadius: "8px",
        },
        "& .pro-menu-item.active": {
          color: "#6366f1 !important",
          background: `${theme === "dark" ? "#1e293b" : "#e0e7ff"} !important`,
          borderRadius: "8px",
        },
      }}
      className="bg-white dark:bg-[#0f172a] shadow-md"
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "0%" : "16%",
        }}
      >
        <Menu iconShape="square">
          {/* Logo and Toggle */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{ margin: "10px 20px 0" }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Link href="#">
                  <h3 className="text-[20px] font-semibold font-Poppins uppercase text-slate-900 dark:text-white pr-1.2">
                    StudyBuddy
                  </h3>
                </Link>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <ArrowBackIosIcon className="text-slate-900 dark:text-slate-100" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* User Info */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  alt="profile-user"
                  width={108}
                  height={100}
                  src={user?.avatar?.url || avatarDefault}
                  priority
                  className="rounded-full border-[3px] border-indigo-500 shadow-lg transition-all duration-300 hover:scale-105"
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-2">
                  {user?.name}
                </Typography>
                <Typography variant="h5" className="text-sm font-medium text-gray-600 dark:text-gray-200 capitalize">
                  {`~ ${user?.role}`}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item title="Dashboard" to="/admin" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />

            <Typography className="text-[18px] font-medium text-slate-900 dark:text-slate-300 capitalize my-4 px-4">
              {!isCollapsed && "Data"}
            </Typography>
            <Item title="Users" to="/admin/users" icon={<GroupsIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Invoices" to="/admin/invoices" icon={<ReceiptOutlinedIcon />} selected={selected} setSelected={setSelected} />

            <Typography className="text-[18px] font-medium text-slate-700 dark:text-slate-300 capitalize my-4 px-4">
              {!isCollapsed && "Content"}
            </Typography>
            <Item title="Create Course" to="/admin/create-course" icon={<VideoCallIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Live Courses" to="/admin/courses" icon={<OndemandVideoIcon />} selected={selected} setSelected={setSelected} />

            <Typography className="text-[18px] font-medium text-slate-700 dark:text-slate-300 capitalize my-4 px-4">
              {!isCollapsed && "Customization"}
            </Typography>
            <Item title="Hero" to="/admin/hero" icon={<WebIcon />} selected={selected} setSelected={setSelected} />
            <Item title="FAQ" to="/admin/faq" icon={<QuizIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Categories" to="/admin/categories" icon={<WysiwygIcon />} selected={selected} setSelected={setSelected} />

            <Typography className="text-[18px] font-medium text-slate-700 dark:text-slate-300 capitalize my-4 px-4">
              {!isCollapsed && "Controllers"}
            </Typography>
            <Item title="Manage Team" to="/admin/team" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />

            <Typography className="text-[18px] font-medium text-slate-700 dark:text-slate-300 capitalize my-4 px-4">
              {!isCollapsed && "Analytics"}
            </Typography>
            <Item title="Courses Analytics" to="/admin/courses-analytics" icon={<BarChartOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Orders Analytics" to="/admin/orders-analytics" icon={<MapOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Users Analytics" to="/admin/users-analytics" icon={<ManageHistoryIcon />} selected={selected} setSelected={setSelected} />

            <Typography className="text-[18px] font-medium text-slate-700 dark:text-slate-300 capitalize my-4 px-4">
              {!isCollapsed && "Extras"}
            </Typography>
            <Item title="Settings" to="/admin/settings" icon={<SettingsIcon />} selected={selected} setSelected={setSelected} />
            <div onClick={logoutHandler}>
              <Item title="Logout" to="/" icon={<ExitToAppIcon />} selected={selected} setSelected={setSelected} />
            </div>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
