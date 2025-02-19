import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Endpoint } from "../../utils/endpoint";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 ${darkmode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <p className={`text-sm ${darkmode ? 'text-gray-200' : 'text-gray-800'}`}>
            {`${label}: ${payload[0].value} étudiants`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
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
  }

  if (error) {
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
  }

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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={false}
              stroke={darkmode ? "#374151" : "#E5E7EB"} 
            />
            <XAxis 
              type="number"
              tick={{ fill: darkmode ? "#e5e7eb" : "#333333" }}
              tickFormatter={(value) => `${value} étudiants`}
              stroke={darkmode ? "#4B5563" : "#D1D5DB"}
            />
            <YAxis 
              type="category"
              dataKey="course"
              tick={{ fill: darkmode ? "#e5e7eb" : "#333333" }}
              stroke={darkmode ? "#4B5563" : "#D1D5DB"}
            />
            <Tooltip 
              content={<CustomTooltip />}
            />
            <Bar 
              dataKey="students"
              fill={darkmode ? "#60A5FA" : "#3B82F6"}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CourseDistribution;