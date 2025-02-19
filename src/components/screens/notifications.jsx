import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  message,
  Drawer,
  Button,
  Popconfirm,
  Tooltip,
  Modal,
  DatePicker,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  SendOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileAddOutlined,
} from "@ant-design/icons";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { handlePrintPayment } from "../../utils/printable/payment";
import {
  addNewTrace,
  getCurrentDate,
  getCurrentTime,
} from "../../utils/helper";
import TextArea from "antd/es/input/TextArea";
import { Endpoint } from "../../utils/endpoint";

const TableNotification = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [data1, setData1] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open1, setOpen1] = useState(false);
  const [clients, setClients] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [abonnements, setAbonnements] = useState([]);
  const [tarif, setTarif] = useState(0);
  const [add, setAdd] = useState(0);
  const [staffOptions, setStaffOptions] = useState([]);
  const [contract, setcontarct] = useState([]);
  const [contractFilter, setcontarctFilter] = useState([]);
  const [peried, setPeriod] = useState([]);
  const [contartClient, setContartClient] = useState([]);
  const [StaffFilter, setStaffFilter] = useState([]);
  const [contarctClient, setcontarctClient] = useState([]);
  const [searchText1, setSearchText1] = useState("");
  const [selectedValues, setSelectedValues] = useState(["all"]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);

  // State for contract related data
  const [PaymentData, setPaymentData] = useState({
    date_envoye: getCurrentDate(),
    id_admin: null,
    sujet: "",
    contenu: "",
    cible: "",
  });

  const NotificationDetailsModal = ({ visible, onClose, notification }) => {
    return (
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        title=" Details Notification"
      >
        <div className="notification-card border rounded-lg shadow-lg p-6 bg-gradient-to-r from-blue-100 to-blue-50 mb-4">
          <div className="notification-detail border border-blue-300 rounded-lg p-4 bg-white shadow-md mb-3">
            <div className="flex items-center mb-2">
              <strong className="text-blue-600">Sujet :</strong>
              <span className="text-gray-800 ml-2">{notification?.sujet}</span>
            </div>
            <div className="flex items-center mb-2">
              <strong className="text-blue-600">Contenu :</strong>
              <span className="text-gray-800 ml-2">
                {notification?.contenu}
              </span>
            </div>
            <div className="flex items-center mb-2">
              <strong className="text-blue-600">Date d'envoi :</strong>
              <span className="text-gray-800 ml-2">
                {notification?.date_envoye}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const handleSearch1 = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText1(value);
    const filtered = data1.filter((item) =>
      item.nom_client.toLowerCase().includes(value)
    );
    setFilteredData1(filtered);
  };

  useEffect(() => {
    const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(Endpoint() + "api/Parentt/", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        });
        const jsonData = await response.json();

        // Ensure each row has a unique key
        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_parent || index, // Assuming each item has a unique id, otherwise use index
        }));

        setData1(processedData);
        setFilteredData1(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = ["nom", "tel", "civilite"];
        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(key.replace(/\_/g, " ")), // Capitalize the first letter
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "civilite") {
              return <Tag>{text}</Tag>;
            }
            return text;
          },
        }));
        setColumns1(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch(Endpoint() + "api/Parentt/");
      const data = await response.json();
      setClients(data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchAbonnements = async () => {
    try {
      const response = await fetch(Endpoint() + "api/abonnement/");
      const data = await response.json();
      setAbonnements(data.data);
    } catch (error) {
      console.error("Error fetching abonnements:", error);
    }
  };

  useEffect(() => {
    // console.log(JSON.stringify(localStorage.getItem("data")));
    fetchClients();
    fetchAbonnements();
    const adminData = JSON.parse(localStorage.getItem("data"));
    const initialAdminId = adminData ? adminData[0].id_employe : ""; // Accessing the first element's id_admin
    // ContractData.id_admin = initialAdminId;
  }, []);

  // Function to add a new contract
  const addContract = async () => {
    const staff = JSON.parse(localStorage.getItem("data"));
    PaymentData.id_admin = staff[0].id_employe;
    PaymentData.id_staff = staff[0].id_employe;
    PaymentData.cible = selectedValues.toString();

    const authToken = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(Endpoint() + "api/notifications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(PaymentData),
      });
      if (response.ok) {
        const res = await response.json();
        if (res) {
          let usersToNotify;
          if (selectedRowKeys.length === 0) {
            // If no users are selected, use all users from filteredData1
            usersToNotify = filteredData1.map((item) => item.id_parent);
          } else {
            // Otherwise, use the selected users
            usersToNotify = selectedRowKeys.map(
              (key) => filteredData1.find((item) => item.key === key)?.id_parent
            );
          }

          for (const userId of usersToNotify) {
            const notificationData = {
              user_id: userId.toString(),
              title: PaymentData.sujet,
              body: PaymentData.contenu,
              id_admin: PaymentData.id_employe,
            };

            const pushResponse = await fetch(
              Endpoint() + "api/send/notification/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(notificationData),
              }
            );

            if (!pushResponse.ok) {
              console.error(
                `Failed to send push notification to user ${userId}`
              );
            } else {
              console.log(notificationData);
            }
          }

          message.success("Notification ajoutée avec succès");
          setChangedFields([]);
          setAdd(Math.random() * 1000);

          onCloseR();
        } else {
          message.warning("Erreur lors de l'ajout de la notification");
          console.log(res);
        }
      } else {
        // console.log(response);
        message.error("Erreur lors de l'ajout de la notification");
      }
    } catch (error) {
      console.log(error);
      message.warning("An error occurred:", error);
    }
  };

  const showDrawerR = () => {
    if (selectedNotification) {
      setPaymentData(selectedNotification);
      setActiveStep(1); // Set to index 1 to show "Choisissez les destinataires" step
    }
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    setActiveStep(0);
    setPaymentData({
      date_envoye: getCurrentDate(),
      id_admin: null,
      sujet: "",
      contenu: "",
      cible: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(Endpoint() + "api/contrat");
        const jsonData = await response.json();
        setContartClient(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const rowSelection2 = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log("selectedRowKeys changed: ", selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Disable checkbox for specific rows
    }),
  };

  useEffect(() => {
    handleSelectChange(selectedValues);
  }, [selectedValues]);

  const handleSelectChange = (values) => {
    if (values.includes("all")) {
      setFilteredData1(data1);
      return;
    }
    let filtered = data1;

    if (values.includes("non-pay")) {
      const impaye = contartClient
        .filter((cl) => cl.reste > 0)
        .map((cl) => cl.id_client);
      filtered = filtered.filter((item) => impaye.includes(item.id_client));
    }

    if (values.includes("non-date")) {
      const currentDate = new Date();
      const expired = contartClient
        .filter((cl) => new Date(cl.date_fin) < currentDate)
        .map((cl) => cl.id_client);
      filtered = filtered.filter((item) => expired.includes(item.id_client));
    }

    if (values.includes("male")) {
      const impayeMale = clients
        .filter((cl) => cl.civilite === "Monsieur")
        .map((cl) => cl.id_client);
      filtered = filtered.filter((item) => impayeMale.includes(item.id_client));
    }

    if (values.includes("femme")) {
      const impayeFemale = clients
        .filter((cl) => cl.civilite === "Madame")
        .map((cl) => cl.id_client);
      filtered = filtered.filter((item) =>
        impayeFemale.includes(item.id_client)
      );
    }

    setFilteredData1(filtered);
  };

  const generateClientSummary = () => {
    const selectedClients = filteredData1.filter((client) =>
      selectedRowKeys.includes(client.key)
    );
    const totalSelected = selectedClients.length;
    const clientNames = selectedClients
      .map((client) => client.nom_client)
      .join(", ");

    return (
      <div>
        <p>
          <strong>Nombre total de clients sélectionnés:</strong> {totalSelected}
        </p>
        <p>
          <strong>Clients:</strong> {clientNames}
        </p>
      </div>
    );
  };

  // stepper
  const steps = [
    {
      label: " Sujet, Contenu, Date",
      description: (
        <div className="w-full grid grid-cols-2 gap-4 mt-5">
          <div>
            <div>Sujet</div>
            <Input
              value={PaymentData.sujet}
              onChange={(v) => {
                setPaymentData({ ...PaymentData, sujet: v.target.value });
              }}
              prefix={<FileTextOutlined />}
              placeholder="Sujet"
            ></Input>
          </div>{" "}
          <div>
            <div>Contenu</div>
            <TextArea
              value={PaymentData.contenu}
              onChange={(v) => {
                setPaymentData({ ...PaymentData, contenu: v.target.value });
              }}
              prefix={<SendOutlined />}
              placeholder="Contenu"
            ></TextArea>
          </div>
          <div>
            <div>Date</div>
            <DatePicker
              onChange={(v) => {
                setPaymentData({ ...PaymentData, date_envoye: v.target.value });
              }}
              className="w-full"
              format="DD/MM/YYYY"
              type="date"
              value={moment(getCurrentDate())}
              disabled={true}
            ></DatePicker>
          </div>
          <div>
            <div>L'heure</div>
            <Input
              className="w-full"
              type="time"
              value={getCurrentTime()}
              placeholder="Heur"
            ></Input>
          </div>
        </div>
      ),
    },
    {
      label: "Choisissez les destinataires",
      description: (
        <div className="w-full">
          <div className="w-full flex items-center space-x-4">
            <div className="w-52">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search Client"
                value={searchText1}
                onChange={handleSearch1}
              />
            </div>
            <div>
              <Select
                mode="multiple"
                className="w-52"
                defaultValue={["all"]}
                placeholder="Rechercher par balise"
                style={{ flex: 1 }}
                options={[
                  { value: "all", label: "Tout les clients" },
                  {
                    value: "non-pay",
                    label: "Client avec des contarts impayes",
                  },
                  {
                    value: "non-date",
                    label: "Client avec des contarts expire",
                  },
                  { value: "femme", label: "Cote femme" },
                  { value: "male", label: "Cote homme" },
                ]}
                onChange={setSelectedValues}
              />
            </div>
          </div>
          <Table
            pagination={{
              pageSize: 4,
              showQuickJumper: true,
            }}
            size="small"
            className="w-full mt-5"
            columns={columns1}
            dataSource={filteredData1}
            rowSelection={rowSelection2}
          />
        </div>
      ),
    },
    {
      label: "Envoyer notification",
      description: (
        <div>
          <h3>Résumé de la notification</h3>
          <p>
            <strong>Sujet:</strong> {PaymentData.sujet}
          </p>
          <p>
            <strong>Contenu:</strong> {PaymentData.contenu}
          </p>
          <p>
            <strong>Date d'envoi:</strong> {PaymentData.date_envoye}
          </p>
          {/* <h3>Destinataires</h3>
          {generateClientSummary()} */}
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      addContract();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(Endpoint() + "api/notifications/", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        });
        const jsonData = await response.json();
        const processedData = jsonData.map((item, index) => ({
          ...item,
          key: item.id_notif || index, // Assuming each item has a unique id, otherwise use index
        }));
        console.log(processedData);
        setData(processedData);
        setFilteredData(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = ["sujet", "contenu", "date_envoye"];
        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(key.replace(/_/g, " ")),
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "contenu") {
              return <div>{String(text).slice(0, 15)}...</div>;
            } else if (key === "date_inscription") {
              return <Tag>{text}</Tag>;
            }
            return text;
          },
        }));

        // Add a new column for the sum of "salaire" and "prime"

        setColumns(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [authToken, add]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(Endpoint() + "api/staff/", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        });
        const jsonData = await response.json();
        setcontarctClient(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      if (selectedRows.length === 1) {
        setSelectedNotification(selectedRows[0]);
      } else {
        setSelectedNotification(null);
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Disable checkbox for specific rows
    }),
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.sujet.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const ContractData = data.find((client) => client.key === key);
          const response = await fetch(
            `${Endpoint()}api/notifications/${ContractData.id_notif}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify(ContractData),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to delete client with key ${key}`);
          }
        });

        await Promise.all(promises);

        const updatedData = data.filter(
          (client) => !selectedRowKeys.includes(client.key)
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setSelectedRowKeys([]);
        message.success(
          `${selectedRowKeys.length} Notification(s) supprimée(s) avec succès`
        );
      } catch (error) {
        console.error("Error deleting clients:", error);
        message.error("An error occurred while deleting clients");
      }
    }
  };

  const confirm = (e) => {
    handleDelete();
  };
  const cancel = (e) => {
    console.log(e);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: darkmode ? "#00b96b" : "#1677ff",
          colorBgBase: darkmode ? "#141414" : "#fff",
          colorTextBase: darkmode ? "#fff" : "#000",
          colorBorder: darkmode ? "#fff" : "#d9d9d9", // Set border to white in dark mode
        },
      }}
    >
      <div className="w-full p-2">
        <NotificationDetailsModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          notification={selectedNotification}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-7">
            <div className="w-52">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search Notification"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-6">
              {/* {selectedRowKeys.length === 1 ? "" : ""} */}
              {/* {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "secretaire")&&
              selectedRowKeys.length >= 1 ? ( */}
              {selectedRowKeys.length >= 1 ? (
                <Popconfirm
                  title="Supprimer la notification"
                  description="Êtes-vous sûr de supprimer  notification ?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined className="cursor-pointer" />{" "}
                </Popconfirm>
              ) : (
                ""
              )}
              {/* ) : (
            ""
          )} */}
              {/* {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "secretaire")&&
              selectedRowKeys.length >= 1 ? ( */}
              {selectedRowKeys.length === 1 ? (
                <EyeOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedNotification(
                      data.find((item) => item.key === selectedRowKeys[0])
                    );
                    setIsModalVisible(true);
                  }}
                />
              ) : (
                ""
              )}
              {/* // ) : (
            //   ""
            // )} */}
              {/* {(JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" ||
              JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "secretaire")&&
              selectedRowKeys.length >= 1 ? ( */}
              {selectedRowKeys.length === 1 ? (
                <Tooltip title="dupliquer cette notification">
                  <img
                    className="cursor-pointer"
                    width="20"
                    height="20"
                    src="https://img.icons8.com/material-rounded/48/duplicate.png"
                    alt="duplicate"
                    onClick={() => {
                      // Prefill the "Add New Notification" form with the selected notification data
                      setPaymentData(selectedNotification);
                      showDrawerR();
                    }}
                  />
                </Tooltip>
              ) : (
                ""
              )}
              {/* ) : (
              ""
            )} */}
            </div>
          </div>
          {/* add contract */}
          <div>
            <>
              <div className="flex items-center space-x-3">
                <Button
                  type="default"
                  onClick={showDrawerR}
                  icon={<FileAddOutlined />}
                >
                  Ajouter Notification
                </Button>
              </div>
              <Drawer
                title={
                  selectedNotification
                    ? "Duplication de la notification"
                    : "Saisir une nouvelle notification"
                }
                width={720}
                onClose={onCloseR}
                closeIcon={false}
                open={open1}
                bodyStyle={{
                  paddingBottom: 80,
                }}
              >
                <div>
                  <Box sx={{ maxWidth: "auto" }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel
                            optional={
                              index === 2 ? (
                                <Typography variant="caption">
                                  Dernière étape
                                </Typography>
                              ) : null
                            }
                          >
                            {step.label}
                          </StepLabel>
                          <StepContent>
                            <Typography>{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                              <div>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  {index === steps.length - 1
                                    ? "Terminer"
                                    : "Continuer"}
                                </Button>
                                <Button
                                  className="ml-3 mt-3"
                                  disabled={index === 0}
                                  onClick={handleBack}
                                  sx={{ mt: 1, mr: 1, ml: 2 }}
                                >
                                  Retour
                                </Button>
                              </div>
                            </Box>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                    {activeStep === steps.length && (
                      <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>
                          Toutes les étapes sont terminées - vous avez terminé
                        </Typography>
                        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                          Réinitialiser
                        </Button>
                      </Paper>
                    )}
                  </Box>
                </div>
              </Drawer>
            </>
          </div>
        </div>
        <Table
          pagination={{
            pageSize: 7,
            showQuickJumper: true,
          }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          size="small"
          className="w-full mt-5"
          columns={columns}
          dataSource={filteredData}
          loading={Loading}
        />
      </div>
    </ConfigProvider>
  );
};

export default TableNotification;
