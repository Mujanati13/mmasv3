import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";
import {
  Card,
  Spin,
  Typography,
  ConfigProvider,
  theme,
  Alert,
  Space,
} from "antd";
import {
  LoadingOutlined,
  FileTextOutlined,
  PartitionOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Endpoint } from "../../utils/endpoint";

const { Title } = Typography;

const TypeContract = ({ darkMode }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Contract type icons mapping - now returning strings instead of components
  const contractIcons = {
    "Full Time": "team",
    "Part Time": "partition",
    Freelance: "user",
    Contract: "file-text",
    Internship: "book",
  };

  // Theme configuration
  const themeToken = {
    light: {
      colorPrimary: "#1890ff",
      colorBgContainer: "#ffffff",
      colorText: "rgba(0, 0, 0, 0.85)",
      colorBorder: "#f0f0f0",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
    },
    dark: {
      colorPrimary: "#177ddc",
      colorBgContainer: "#141414",
      colorText: "rgba(255, 255, 255, 0.85)",
      colorBorder: "#303030",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const authToken = localStorage.getItem("jwtToken");
        const response = await fetch(
          Endpoint() + "/api/clients/contracts/type/",
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        const combinedData = result.labels
          .map((label, index) => ({
            type: label,
            value: result.data[index],
            icon: contractIcons[label] || "file-text",
          }))
          .filter((item) => item.value > 0);

        setChartData(combinedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrorMessage("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    data: chartData,
    xField: "type",
    yField: "value",
    label: {
      position: "middle",
      style: {
        fill: darkMode ? "#ef4444" : "#dc2626",
        fontSize: 14,
        rotate: 90, // Vertical bar labels
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false, // Disable auto-rotation
        style: {
          fill: darkMode ? "#ef4444" : "#dc2626",
          rotate: 0, // Horizontal x-axis labels
        },
      },
      line: {
        style: {
          stroke: darkMode ? "#303030" : "#f0f0f0",
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: darkMode ? "#ef4444" : "#dc2626",
          rotate: 90, // Vertical y-axis labels
        },
      },
      grid: {
        line: {
          style: {
            stroke: darkMode ? "#303030" : "#f0f0f0",
            lineDash: [4, 4],
          },
        },
      },
    },
    color: darkMode ? "#177ddc" : "#1890ff",
    tooltip: {
      domStyles: {
        "g2-tooltip": {
          backgroundColor: darkMode ? "#1f1f1f" : "#fff",
          boxShadow: darkMode
            ? "0 2px 8px rgba(0, 0, 0, 0.45)"
            : "0 2px 8px rgba(0, 0, 0, 0.15)",
          padding: "12px",
          color: darkMode ? "#ef4444" : "#dc2626",
          transform: "rotate(90deg)", // Vertical tooltip text
        },
      },
      formatter: (datum) => {
        return {
          name: datum.type,
          value: `${datum.value} contracts`,
        };
      },
    },
  };

  const currentTheme = darkMode ? themeToken.dark : themeToken.light;

  // Get the appropriate icon component
  const getIcon = (type) => {
    switch (type) {
      case "team":
        return <TeamOutlined />;
      case "partition":
        return <PartitionOutlined />;
      case "user":
        return <UserOutlined />;
      case "book":
        return <BookOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: currentTheme,
      }}
    >
      <Card
        style={{
          height: 400,
          background: currentTheme.colorBgContainer,
          borderColor: currentTheme.colorBorder,
          boxShadow: currentTheme.boxShadow,
        }}
        bodyStyle={{ height: "100%", padding: "24px" }}
      >
        {isLoading ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Space direction="vertical" align="center">
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      fontSize: 24,
                      color: currentTheme.colorPrimary,
                    }}
                  />
                }
              />
              <span style={{ color: currentTheme.colorText }}>
                Loading contract data...
              </span>
            </Space>
          </div>
        ) : errorMessage ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Alert
              message="Error"
              description={errorMessage}
              type="error"
              showIcon
            />
          </div>
        ) : (
          <>
            <Title
              level={4}
              style={{
                textAlign: "center",
                marginBottom: 24,
                color: currentTheme.colorText,
              }}
            >
              Types de Contrat
            </Title>
            <div style={{ height: "calc(100% - 60px)" }}>
              <Column {...chartConfig} />
            </div>
          </>
        )}
      </Card>
    </ConfigProvider>
  );
};

export default TypeContract;
