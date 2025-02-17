import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Endpoint } from "../../utils/endpoint";

const StudentGradeDistribution = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("jwtToken");
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(Endpoint() + "/api/Etudiant_by_niveau/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const transformedData = result.labels
          .map((label, index) => ({
            grade: label,
            count: result.data[index],
          }))
          .filter((item) => item.count > 0);
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const config = {
    data,
    xField: "grade",
    yField: "count",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.8,
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
        autoHide: false,
        style: {
          fontSize: 12,
          rotate: 45,
          fill: darkmode ? "#e5e7eb" : "#333333",
        },
      },
      line: {
        style: {
          stroke: darkmode ? "#4B5563" : "#D1D5DB",
        },
      },
      grid: {
        line: {
          style: {
            stroke: darkmode ? "#374151" : "#E5E7EB",
            lineDash: [4, 4],
          },
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: darkmode ? "#e5e7eb" : "#333333",
        },
      },
      line: {
        style: {
          stroke: darkmode ? "#4B5563" : "#D1D5DB",
        },
      },
      grid: {
        line: {
          style: {
            stroke: darkmode ? "#374151" : "#E5E7EB",
            lineDash: [4, 4],
          },
        },
      },
    },
    meta: {
      grade: {
        alias: "Grade Level",
      },
      count: {
        alias: "Number of Students",
      },
    },
    color: darkmode ? "#60A5FA" : "#1890ff",
    tooltip: false, // Disabled tooltips
    theme: darkmode
      ? {
          backgroundColor: "#1F2937",
        }
      : undefined,
    interactions: [], // Removed all interactions including hover
  };

  if (isLoading)
    return (
      <div
        className={`w-full h-96 ${darkmode ? "bg-green-600" : "bg-white"} 
            flex items-center justify-center transition-colors duration-200`}
      >
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: 24, color: darkmode ? "#60A5FA" : "#1890ff" }}
              spin
            />
          }
        />
      </div>
    );

  if (error)
    return (
      <div
        className={`w-full h-96 ${
          darkmode ? "bg-green-600 text-red-400" : "bg-white text-red-600"
        } 
            flex items-center justify-center p-4 text-center transition-colors duration-200`}
      >
        {error}
      </div>
    );

  return (
    <div
      className={`w-full h-96 transition-colors duration-200 rounded-lg shadow-sm
            ${darkmode ? "bg-green-600 border border-gray-700" : "bg-white"}
            pt-5 pb-0`}
    >
      <h2
        className={`font-medium text-center mb-0 transition-colors duration-200
                ${darkmode ? "text-white" : "text-gray-900"}`}
      >
        Etudiants par niveau
      </h2>
      <div className="h-[22rem]">
        <Column {...config} />
      </div>
    </div>
  );
};

export default StudentGradeDistribution;
