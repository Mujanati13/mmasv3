import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Card, Spin, Typography, ConfigProvider, theme, Alert, Space } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Endpoint } from "../../utils/endpoint";

const { Title } = Typography;

const themeToken = {
  dark: {
    colorBgContainer: '#1f1f1f',
    colorText: '#ffffff',
    colorBorder: '#333333',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
  },
  light: {
    colorBgContainer: '#ffffff',
    colorText: '#000000',
    colorBorder: '#f0f0f0',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  },
};

const TypeContract = ({ darkMode }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("jwtToken");
        setIsLoading(true);
        const response = await fetch(Endpoint() + "/api/clients/contracts/type/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        const transformedData = result.labels.map((label, index) => ({
          name: label,
          value: result.data[index],
        })).filter(item => item.value > 0);

        setChartData(transformedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrorMessage("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: darkMode ? '#1f1f1f' : '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          color: darkMode ? '#fff' : '#000'
        }}>
          <p style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value} contrats`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: darkMode ? themeToken.dark : themeToken.light,
      }}
    >
      <Card
        style={{
          height: 400,
          background: darkMode ? '#1f1f1f' : '#fff',
          borderColor: darkMode ? '#333' : '#f0f0f0',
        }}
        bodyStyle={{ height: "100%", padding: "24px" }}
      >
        {isLoading ? (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Space direction="vertical" align="center">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: darkMode ? '#1890ff' : '#1890ff' }} />} />
              <span style={{ color: darkMode ? '#fff' : '#000' }}>Loading contract data...</span>
            </Space>
          </div>
        ) : errorMessage ? (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Alert message="Error" description={errorMessage} type="error" showIcon />
          </div>
        ) : (
          <>
            <Title level={4} style={{ 
              textAlign: "center", 
              marginBottom: 24, 
              color: darkMode ? '#fff' : '#000'
            }}>
              Types de Contrat
            </Title>
            <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: darkMode ? '#fff' : '#000' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </Card>
    </ConfigProvider>
  );
};

export default TypeContract;