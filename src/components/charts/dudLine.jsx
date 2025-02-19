import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, DatePicker, Spin, Statistic } from "antd";
import moment from "moment";
import { Endpoint } from "../../utils/endpoint";

const { RangePicker } = DatePicker;

const DailyActivityChart = () => {
  const [data, setData] = useState([]);
  const [totalInscriptions, setTotalInscriptions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(1, "month"),
    moment(),
  ]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = dateRange;
      const response = await fetch(
        Endpoint() + `/api/reservations/date/course`,
        {
          headers: {
            Authorization: localStorage.getItem("jwtToken"),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();

      // Transform data for Recharts
      const transformedData = jsonData.data.map((item) => ({
        date: moment(item.date).format("DD/MM/YYYY"),
        value: item.value,
      }));

      setData(transformedData);
      setTotalInscriptions(jsonData.nb_inscription_total);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0 }}>{`Date: ${label}`}</p>
          <p style={{ margin: 0, color: "#1890ff" }}>
            {`Inscriptions: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: "400px" }} className="w-full">
      <Card
        title="Nombre des inscriptions par période"
        // Replace the RangePicker with this custom date range selector
        extra={
          <div className="flex space-x-2 items-center">
            <input
              type="date"
              value={dateRange[0]?.format("YYYY-MM-DD")}
              onChange={(e) =>
                handleDateRangeChange([moment(e.target.value), dateRange[1]])
              }
              className="border rounded px-2 py-1 text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange[1]?.format("YYYY-MM-DD")}
              onChange={(e) =>
                handleDateRangeChange([dateRange[0], moment(e.target.value)])
              }
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        }
      >
        <Statistic
          value={"Total Inscriptions: " + totalInscriptions}
          valueStyle={{ color: "#1890ff" , fontSize: 16}}
          style={{ marginBottom: 16 }}
        />
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1890ff"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DailyActivityChart;
