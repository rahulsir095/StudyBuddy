import React, { FC } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

type Props = {
  isDashboard?: boolean;
};

const OrdersAnalytics: FC<Props> = ({ isDashboard }) => {
  const {data,isLoading} = useGetOrdersAnalyticsQuery({});

  // Dummy data
//   const analyticsData = [
//     { month: "Page 1", count: 120 },
//     { month: "Page 2", count: 200 },
//     { month: "Page 3", count: 150 },
//     { month: "Page 4", count: 300 },
//     { month: "Page 5", count: 180 },
//     { month: "Page 6", count: 250 },
//     { month: "Page 7", count: 400 },
//   ];

  const analyticsData: any[] = [];
  data &&
    data.orders.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.month, count: item.count });
    });


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
          {/* Header */}
          <div className={isDashboard ? "mt-[20px] pl-[40px] mb-2" : "mt-[50px]"}>
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Orders Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 months analytics data
              </p>
            )}
          </div>

          {/* Chart */}
          <div
            className={`w-full ${
              isDashboard ? "h-[90%]" : "h-full"
            } flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={isDashboard ? "100%" : "50%"}
            >
              <LineChart
                data={analyticsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isDashboard && <Legend />}
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersAnalytics;
