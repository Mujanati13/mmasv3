import React, { useState, useEffect } from "react";
import { Bar } from "@ant-design/plots";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Endpoint } from "../../utils/endpoint";

const CourseDistribution = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("jwtToken");
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(Endpoint() + "/api/cours_by_etud/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }
        const result = await response.json();
        const transformedData = result.labels
          .map((label, index) => ({
            course: label,
            students: result.data[index],
          }))
          .filter((item) => item.students > 0);
        setData(transformedData);
      } catch (error) {
        console.error("Erreur de récupération des données:", error);
        setError(
          "Échec de la récupération des données. Veuillez réessayer plus tard."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const config = {
    data,
    xField: "students",
    yField: "course",
    seriesField: "course",
    meta: {
      course: {
        alias: "Cours",
      },
      students: {
        alias: "Étudiants",
      },
    },
    legend: {
      position: "top",
      itemName: {
        style: {
          fill: darkmode ? "#e5e7eb" : "#333333",
        },
      },
    },
    xAxis: {
      label: {
        formatter: (v) => `${v} étudiants`,
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
    yAxis: {
      label: {
        autoRotate: false,
        style: {
          fill: darkmode ? "#e5e7eb" : "#333333",
        },
      },
      line: {
        style: {
          stroke: darkmode ? "#4B5563" : "#D1D5DB",
        },
      },
    },
    label: {
      position: "right",
      offset: 4,
      style: {
        fill: darkmode ? "#e5e7eb" : "#333333",
      },
    },
    barBackground: {
      style: {
        fill: darkmode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)",
      },
    },
    color: darkmode
      ? ["#60A5FA", "#818CF8", "#A78BFA", "#F472B6", "#FB7185"]
      : undefined,
    theme: darkmode
      ? {
          backgroundColor: "#1F2937",
        }
      : undefined,
    interactions: [
      {
        type: "active-region",
        enable: false,
      },
    ],
  };

  if (isLoading)
    return (
      <div
        className={`w-full h-80 ${darkmode ? "bg-gray-800" : "bg-white"} 
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
        className={`w-full h-80 ${
          darkmode ? "bg-gray-800 text-red-400" : "bg-white text-red-600"
        } 
            flex items-center justify-center p-4 text-center transition-colors duration-200`}
      >
        {error}
      </div>
    );

  return (
    <div
      className={`w-full h-80 transition-colors duration-200 rounded-lg shadow-sm
            ${darkmode ? "bg-gray-800 border border-gray-700" : "bg-white"}
            pt-5 pb-5`}
    >
      <h2
        className={`font-medium text-center mb-5 transition-colors duration-200
                ${darkmode ? "text-white" : "text-gray-900"}`}
      >
        Répartition des cours par étudiant
      </h2>
      <div className="w-full h-60">
        <Bar {...config} />
      </div>
    </div>
  );
};

export default CourseDistribution;
