"use client";

import React, { FC, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import UserAnalytics from "../Analytics/UserAnalytics";
import OrdersAnalytics from "../Analytics/OrderAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type CompareData = {
  currentMonth: number;
  previousMonth: number;
  percentChange: number;
};

type Props = {
  open?: boolean;
  value: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        thickness={4}
        color={value > 99 ? "info" : "error"}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </Box>
  );
};

const DashboardWidgets: FC<{ open?: boolean }> = ({ open }) => {
  const [userComparePercentage, setUserComparePercentage] =
    useState<CompareData>();
  const [ordersComparePercentage, setOrdersComparePercentage] =
    useState<CompareData>();

  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  // helper function to handle divide-by-zero
  const calculatePercentChange = (current: number, previous: number) => {
    if (previous === 0 && current > 0) return 100;
    if (previous === 0 && current === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  useEffect(() => {
    if (isLoading || ordersLoading) return;

    if (data && ordersData) {
      const usersLastTwoMonths = data.users.last12Months.slice(-2);
      const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

      if (usersLastTwoMonths.length === 2 && ordersLastTwoMonths.length === 2) {
        const usersCurrentMonth = usersLastTwoMonths[1].count;
        const usersPreviousMonth = usersLastTwoMonths[0].count;
        const ordersCurrentMonth = ordersLastTwoMonths[1].count;
        const ordersPreviousMonth = ordersLastTwoMonths[0].count;

        const usersPercentChange = calculatePercentChange(
          usersCurrentMonth,
          usersPreviousMonth
        );
        const ordersPercentChange = calculatePercentChange(
          ordersCurrentMonth,
          ordersPreviousMonth
        );

        setUserComparePercentage({
          currentMonth: usersCurrentMonth,
          previousMonth: usersPreviousMonth,
          percentChange: usersPercentChange,
        });

        setOrdersComparePercentage({
          currentMonth: ordersCurrentMonth,
          previousMonth: ordersPreviousMonth,
          percentChange: ordersPercentChange,
        });
      }
    }
  }, [data, ordersData, isLoading, ordersLoading]);

  const formatPercent = (value?: number) => {
    if (value === undefined) return "0%";
    const formatted = value.toFixed(1);
    return value >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  return (
    <div className="mt-[30px] min-h-screen">
      <div className="grid grid-cols-[75%_25%] gap-6">
        {/* Left Side: Analytics */}
        <div className="p-8">
          <UserAnalytics isDashboard={true} />
        </div>

        {/* Right Side: Widgets stacked */}
        <div className="flex flex-col gap-6 pt-[80px] pr-8">
          {/* Orders Widget */}
          <div className="w-full dark:bg-[#111C43] bg-white rounded-sm shadow">
            <div className="flex items-center p-5 justify-between">
              <div>
                <BiBorderLeft className="dark:text-[#45CBA8] text-black text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-white text-black text-[28px]">
                  {ordersComparePercentage?.currentMonth ?? 0}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA8] text-black text-[20px] font-[400]">
                  Sales Obtained
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={Math.min(
                    Math.abs(ordersComparePercentage?.percentChange ?? 0),
                    100
                  )}
                  open={open}
                />
                <h5
                  className={`text-center pt-4 ${
                    (ordersComparePercentage?.percentChange ?? 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatPercent(ordersComparePercentage?.percentChange)}
                </h5>
              </div>
            </div>
          </div>

          {/* Users Widget */}
          <div className="w-full dark:bg-[#111C43] bg-white rounded-sm shadow">
            <div className="flex items-center p-5 justify-between">
              <div>
                <PiUsersFourLight className="dark:text-[#45CBA8] text-black text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-white text-black text-[28px]">
                  {userComparePercentage?.currentMonth ?? 0}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA8] text-black text-[20px] font-[400]">
                  New Users
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={Math.min(
                    Math.abs(userComparePercentage?.percentChange ?? 0),
                    100
                  )}
                  open={open}
                />
                <h5
                  className={`text-center pt-4 ${
                    (userComparePercentage?.percentChange ?? 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatPercent(userComparePercentage?.percentChange)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-[65%_35%] mt-[-20px]">
        {/* Left: Orders Analytics */}
        <div className="dark:bg-[#111c43] w-[94%] mt-[30px] h-[40vh] shadow-sm m-auto rounded-md">
          <OrdersAnalytics isDashboard={true} />
        </div>

        {/* Right: Recent Transactions */}
        <div className="p-5">
          <h5 className="dark:text-[#fff] text-black text-[20px] font-[400] font-Poppins pb-3">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
