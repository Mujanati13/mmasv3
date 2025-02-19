import React, { useEffect, useState } from "react";
import { Button, Divider, Segmented, Tooltip, Modal, Popover } from "antd";
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Endpoint } from "../../utils/endpoint";

const ContratsType = ({ darkmode }) => {
  const [expiringContracts, setExpiringContracts] = useState({});
  const [soonExpiringContracts, setSoonExpiringContracts] = useState({});
  const [displayExpired, setDisplayExpired] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const response = await fetch(
          Endpoint()+"/api/clients/contracts/expiring/",
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setExpiringContracts(data.expiring_contracts);
        setSoonExpiringContracts(data.soon_expiring_contracts);
      } catch (error) {
        console.error("Failed to fetch contract data:", error);
      }
    };

    fetchContractData();
  }, []);

  const handleToggleDisplay = (value) => {
    setDisplayExpired(value === "Expirés");
  };

  const showModal = (clientName) => {
    setSelectedClient(clientName);
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className={`w-3/4 overflow-auto overflow-ellipsis h-80 shadow-sm rounded-md pl-4 pr-4 pb-4 pt-4 border 
      ${darkmode 
        ? 'bg-gray-800 border-gray-700 text-gray-200' 
        : 'bg-white border-red-50 text-gray-900'
      } transition-colors duration-200`}>
      <div className={`font-medium ${darkmode ? 'text-gray-200' : 'text-gray-900'}`}>
        Contrats à échéance
      </div>
      <div className="mt-4 flex justify-center">
        <Segmented
          default="Expirés"
          defaultValue="Expirés"
          defaultChecked="Expirés"
          options={[
            {
              label: "Expirés",
              value: "Expirés",
            },
            {
              label: "Bientôt expirés",
              value: "Bientôt expirés",
            },
          ]}
          onChange={handleToggleDisplay}
          className={darkmode ? 'ant-segmented-dark' : ''}
        />
      </div>
      <div className="mt-7">
        {displayExpired
          ? Object.entries(expiringContracts).map(([clientName, contracts]) => (
              <div key={clientName}>
                {contracts.map((contract, index) => (
                  <div
                    key={`${clientName}-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        width="24"
                        height="24"
                        src="https://img.icons8.com/color/48/expired.png"
                        alt="expired"
                      />
                      <div>
                        <div className={`text-sm ${darkmode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {clientName}
                        </div>
                        <span className={`text-sm ${darkmode ? 'text-gray-400' : 'opacity-55'}`}>
                          {`Contrat: ${contract.numcontrat}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tooltip title="Date de fin">
                        <div className={darkmode ? 'text-gray-300' : ''}>
                          <ClockCircleOutlined />
                        </div>
                      </Tooltip>
                      <Tooltip title="Expiré">
                        <ExclamationCircleOutlined
                          onClick={() => showModal(clientName)}
                          className={darkmode ? 'text-gray-300' : ''}
                        />
                      </Tooltip>
                    </div>
                  </div>
                ))}
                <Divider className={darkmode ? 'border-gray-700' : ''} />
              </div>
            ))
          : Object.entries(soonExpiringContracts).map(
              ([clientName, contracts]) => (
                <div key={clientName}>
                  {contracts.map((contract, index) => (
                    <div
                      key={`${clientName}-${index}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          width="24"
                          height="24"
                          src="https://img.icons8.com/color/48/expired.png"
                          alt="expired"
                        />
                        <div>
                          <div className={`text-sm ${darkmode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {clientName}
                          </div>
                          <span className={`text-sm ${darkmode ? 'text-gray-400' : 'opacity-55'}`}>
                            {`Contrat: ${contract.numcontrat}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tooltip title="Date de fin">
                          <div className={darkmode ? 'text-gray-300' : ''}>
                            <ClockCircleOutlined />
                          </div>
                        </Tooltip>
                        <Tooltip title="Bientôt expiré">
                          <ExclamationCircleOutlined
                            onClick={() => showModal(clientName)}
                            className={darkmode ? 'text-gray-300' : ''}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                  <Divider className={darkmode ? 'border-gray-700' : ''} />
                </div>
              )
            )}
      </div>
      <Modal
        title={`Envoyer un message à ${selectedClient}`}
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        className={darkmode ? 'ant-modal-dark' : ''}
      >
        <p className={darkmode ? 'text-gray-200' : ''}>Contenu du message...</p>
      </Modal>
    </div>
  );
};

export default ContratsType;