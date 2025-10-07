import React from 'react'
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  Label,
  YAxis,
  LabelList,
  Bar
} from "recharts"
import Loader from '../../Loader/Loader'
import { useGetCouresAnalyticsQuery } from '@/redux/features/analytics/analyticsApi'
import { styles } from '@/app/styles/style'

type AnalyticsItem = {
  name: string;
  uv: number;
};

const CourseAnalytics = () => {
  const { data, isLoading } = useGetCouresAnalyticsQuery({});
  const analyticsData: AnalyticsItem[] = [];

  if (data && data.courses?.last12Months) {
    data.courses.last12Months.forEach((item: { month: string; count: number }) => {
      analyticsData.push({ name: item.month, uv: item.count });
    });
  }

  const minValue = 0;

  return (
    <>
      {isLoading ? (<Loader />) : (
        <div className="h-screen">
          {/* Header */}
          <div className="mt-[50px]">
            <h1 className={`${styles.title} px-5 !text-start`}>
              Courses Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              Last 12 months analytics data
            </p>
          </div>

          {/* Chart */}
          <div className="w-full h-[90%] flex items-center justify-center">
            <ResponsiveContainer width="90%" height="50%">
              <BarChart data={analyticsData}>
                <XAxis dataKey="name">
                  <Label offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis domain={[minValue, "auto"]} />
                <Bar dataKey="uv" fill="#3faf82">
                  <LabelList dataKey="uv" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  )
}

export default CourseAnalytics