import React, { useState, useEffect } from "react";
import { DatePicker, Spin, Alert } from "antd";
import { CalendarOutlined, ToolOutlined } from "@ant-design/icons";
import { Endpoint } from "../../utils/endpoint";

const { RangePicker } = DatePicker;

function Reservations({ darkmode }) {
  const [reservations, setReservations] = useState({ seances: 0, services: 0 });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);
  const [error, setError] = useState(null);

  // Theme styles configuration
  const themeStyles = {
    container: `w-[20%] max-w-md rounded-md p-4 ${
      darkmode ? 'bg-gray-800 border-gray-700' : 'bg-white'
    } shadow-sm`,
    iconContainer: `h-10 w-10 rounded-full flex justify-center items-center ${
      darkmode ? 'bg-orange-900/30 border-gray-700' : 'bg-orange-200'
    }`,
    icon: `text-lg ${darkmode ? 'text-orange-300' : 'text-orange-500'}`,
    title: `font-medium ${darkmode ? 'text-gray-200' : 'text-gray-800'}`,
    statsContainer: `text-center p-3 rounded-md w-full ${
      darkmode ? 'bg-blue-900/20 border-gray-700' : 'bg-blue-50'
    }`,
    statsIcon: `text-2xl mb-2 ${darkmode ? 'text-blue-400' : 'text-blue-500'}`,
    statsValue: `text-2xl font-bold ${darkmode ? 'text-gray-200' : 'text-gray-800'}`,
    statsLabel: `text-sm ${darkmode ? 'text-gray-400' : 'text-gray-500'}`,
    dateRange: `mt-4 text-sm ${darkmode ? 'text-gray-400' : 'text-gray-500'} text-center`,
    spinContainer: 'flex justify-center items-center h-20'
  };

  useEffect(() => {
    fetchReservations();
  }, [dateRange]);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = Endpoint()+"/api/number-of-reservations/";
      if (dateRange) {
        url;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReservations(data.seance_count);
      } else {
        throw new Error("Échec de récupération des réservations");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      setError("Une erreur est survenue lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{height:"10px"}} className={themeStyles.container}>
      <div className="flex items-center space-x-2 mb-4">
        <div className={themeStyles.iconContainer}>
          <CalendarOutlined className={themeStyles.icon} />
        </div>
        <div className={themeStyles.title}>Séances</div>
      </div>

      {error && (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {loading ? (
        <div className={themeStyles.spinContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="mt-4">
          <div className={themeStyles.statsContainer}>
            <CalendarOutlined className={themeStyles.statsIcon} />
            <div className={themeStyles.statsValue}>
              {reservations && reservations}
            </div>
            <div className={themeStyles.statsLabel}>Séances</div>
          </div>
        </div>
      )}

      {dateRange && (
        <div className={themeStyles.dateRange}>
          Réservations du {dateRange[0].format('D MMMM YYYY')} au{' '}
          {dateRange[1].format('D MMMM YYYY')}
        </div>
      )}
    </div>
  );
}

export default Reservations;