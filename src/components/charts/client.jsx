import React, { useEffect, useState } from "react";
import { Button, message, Tag } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { Endpoint } from "../../utils/endpoint";

function Client({ darkmode }) {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Theme styles configuration
  const themeStyles = {
    container: `w-[20%] h-60 rounded-md ${
      darkmode ? 'bg-gray-800 border-gray-700' : 'bg-white border-red-100'
    }`,
    innerContainer: `w-full h-60 border rounded-md p-3 ${
      darkmode ? 'bg-gray-800 border-gray-700' : 'bg-white border-red-100'
    }`,
    iconContainer: `h-10 w-10 rounded-full flex justify-center items-center ${
      darkmode ? 'bg-green-900/30' : 'bg-green-200'
    }`,
    icon: `text-lg ${darkmode ? 'text-green-300' : 'text-green-700'}`,
    title: `text-sm font-medium ${darkmode ? 'text-gray-200' : 'text-gray-800'}`,
    text: `font-medium opacity-70 text-sm ${darkmode ? 'text-gray-300' : 'text-gray-600'}`,
    tag: (type) => {
      const colors = {
        default: darkmode ? 'blue' : 'default',
        active: darkmode ? 'green' : 'success',
        inactive: darkmode ? 'red' : 'error'
      };
      return colors[type] || colors.default;
    }
  };

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);

      try {
        const response = await fetch(Endpoint()+"/api/clients/status/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();        
        setClientData(result);
      } catch (error) {
        message.error("Failed to fetch client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  const StatItem = ({ label, value, tagType = 'default' }) => (
    <div className={`${themeStyles.text} mt-2 flex items-center gap-2`}>
      <Tag color={themeStyles.tag(tagType)}>{label}</Tag>
      <span>{value}</span>
    </div>
  );

  return (
    <div className={themeStyles.container}>
      <div className={themeStyles.innerContainer}>
        <div className="flex items-center space-x-2">
          <div className={themeStyles.iconContainer}>
            <UsergroupAddOutlined className={themeStyles.icon} />
          </div>
          <div className={themeStyles.title}>Etudiants</div>
        </div>
        
        <div className="p-2 flex flex-col justify-center w-full">
          {loading ? (
            <div className={`${themeStyles.text} mt-5`}>Loading...</div>
          ) : (
            clientData && (
              <>
                <StatItem 
                  label="Etudiants" 
                  value={clientData?.total_client} 
                />
                <StatItem 
                  label="Actifs" 
                  value={clientData?.active_count} 
                  tagType="active"
                />
                <StatItem 
                  label="Inactifs" 
                  value={clientData?.inactive_count} 
                  tagType="inactive"
                />
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Client;