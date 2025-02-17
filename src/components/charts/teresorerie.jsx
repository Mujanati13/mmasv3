import React, { useEffect, useState } from "react";
import { Button, Space, Input, DatePicker, message, Table } from "antd";
const { RangePicker } = DatePicker;
import {
  FileTextOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DotChartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import DemoDualAxes from "./dudLine";
import ContratsType from "./echeance";
import { Endpoint } from "../../utils/endpoint";

function Teresorerie({ darkmode }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("all");
  const [columns, setColumns] = useState([]);
  const defaultStartDate = moment().startOf("month");
  const defaultEndDate = moment().endOf("month");

  // Style configurations based on dark mode
  const themeStyles = {
    container: `w-[55%] h-60 rounded-md p-4 ${
      darkmode ? 'bg-green-400' : 'bg-white'
    } shadow-sm`,
    text: darkmode ? 'text-white' : 'text-black',
    statCard: (color) => `w-40 h-40 rounded-md p-3 ${
      darkmode 
        ? color === 'green' ? 'bg-green-900/20' 
          : color === 'red' ? 'bg-red-900/20'
          : 'bg-purple-900/20'
        : color === 'green' ? 'bg-green-50'
          : color === 'red' ? 'bg-red-50'
          : 'bg-purple-50'
    }`,
    iconBox: (color) => `h-8 w-8 rounded-full flex justify-center items-center ${
      darkmode 
        ? color === 'green' ? 'bg-green-800/50'
          : color === 'red' ? 'bg-red-800/50'
          : 'bg-purple-800/50'
        : color === 'green' ? 'bg-green-200'
          : color === 'red' ? 'bg-red-200'
          : 'bg-purple-200'
    }`,
    statText: darkmode ? 'text-gray-200' : 'text-gray-800'
  };

  const handleDateChange = async (dates, paymentType) => {
    if (!dates || dates.length !== 2) {
      return;
    }

    const [startDate, endDate] = dates;
    setLoading(true);

    try {
      const response = await fetch(
        Endpoint()+`/api/stat/tresorerie?start_date=${startDate.format(
          "YYYY-MM-DD"
        )}&end_date=${endDate.format("YYYY-MM-DD")}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      message.error("Échec de la récupération des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDateChange([defaultStartDate, defaultEndDate], paymentType);
  }, [paymentType]);

  function getSorter(key) {
    if (key === "nom_complet") {
      return (a, b) => a[key].localeCompare(b[key]);
    }
    if (key === "date_recrutement") {
      return (a, b) => new Date(a[key]) - new Date(b[key]);
    }
    return null;
  }

  function getColumnTitle(key) {
    const titles = {
      nom_complet: "Nom complet",
      fonction: "Fonction",
      tel: "Téléphone",
      mail: "Mail",
      date_recrutement: "Date de recrutement",
      actions: "Actions",
    };
    return titles[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  function getFilters(data, key) {
    const uniqueValues = [...new Set(data.map((item) => item[key]))];
    return uniqueValues.map((value) => ({ text: value, value }));
  }

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("jwtToken");
      try {
        const response = await fetch(
          "https://JyssrMmas.pythonanywhere.com/api/staff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const jsonData = await response.json();

        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_coach || index,
          nom_complet: `${item.prenom} ${item.nom}`,
        }));

        const desiredKeys = [
          "nom_complet",
          "fonction",
          "tel",
          "actions",
        ];

        const generatedColumns = desiredKeys.map((key) => {
          const columnConfig = {
            title: getColumnTitle(key),
            dataIndex: key,
            key,
            sorter: getSorter(key),
            className: darkmode ? 'text-white' : 'text-black',
          };

          if (["nom_complet", "fonction"].includes(key)) {
            columnConfig.filters = getFilters(processedData, key);
            columnConfig.onFilter = (value, record) =>
              record[key].indexOf(value) === 0;
          }

          return columnConfig;
        });

        setColumns(generatedColumns);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [darkmode]);

  return (
    <div className={themeStyles.container}>
      {JSON.parse(localStorage.getItem(`data`))[0].fonction === "Administration" ? (
        <div>
          <div className="flex items-center justify-between">
            <div className={`font-medium ${themeStyles.text}`}>Trésorerie</div>
            <Space>
              <RangePicker
                onChange={(dates) => handleDateChange(dates, paymentType)}
                className={darkmode ? 'ant-picker-dark' : ''}
              />
            </Space>
          </div>
          <div className="w-full mt-5 flex items-center justify-between">
            {/* Recette Card */}
            <div className={themeStyles.statCard('green')}>
              <div className="flex items-center space-x-2">
                <div className={themeStyles.iconBox('green')}>
                  <BarChartOutlined className={themeStyles.text} />
                </div>
                <div className={`text-sm font-normal ${themeStyles.statText}`}>Recette</div>
              </div>
              <div className={`font-medium mt-5 ${themeStyles.statText}`}>
                {data ? (
                  `${data.solde_recette} MAD`
                ) : (
                  "Chargement..."
                )}
              </div>
            </div>

            {/* Dépenses Card */}
            <div className={themeStyles.statCard('red')}>
              <div className="flex items-center space-x-2">
                <div className={themeStyles.iconBox('red')}>
                  <DotChartOutlined className={themeStyles.text} />
                </div>
                <div className={`text-sm font-normal ${themeStyles.statText}`}>Dépenses</div>
              </div>
              <div className={`font-medium mt-5 ${themeStyles.statText}`}>
                {data ? (
                  `${data.solde_depense} MAD`
                ) : (
                  "Chargement..."
                )}
              </div>
            </div>

            {/* Solde période Card */}
            <div className={themeStyles.statCard('purple')}>
              <div className="flex items-center space-x-2">
                <div className={themeStyles.iconBox('purple')}>
                  <LineChartOutlined className={themeStyles.text} />
                </div>
                <div className={`text-sm font-normal ${themeStyles.statText}`}>Solde période</div>
              </div>
              <div className={`font-medium mt-5 ${themeStyles.statText}`}>
                {data ? (
                  `${data.solde_peroid} MAD`
                ) : (
                  "Chargement..."
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Table
          pagination={{
            pageSize: 7,
            showQuickJumper: true,
          }}
          size="small"
          className={`w-full mt-5 ${darkmode ? 'ant-table-dark' : ''}`}
          columns={columns}
        />
      )}
    </div>
  );
}

export default Teresorerie;