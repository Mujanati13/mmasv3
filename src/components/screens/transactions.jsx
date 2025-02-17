import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Modal,
  Form,
  Select,
  message,
  Button,
  Drawer,
  Space,
  Switch,
  Descriptions,
  Segmented,
  Checkbox,
  DatePicker,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EyeOutlined,
  ExportOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  addNewTrace,
  formatDateToYearMonthDay,
  getCurrentDate,
} from "../../utils/helper";
import * as XLSX from "xlsx";
import { handlePrintContract } from "../../utils/printable/contract";
import { printFacteur } from "../../utils/printable/facteur";
import { handlePrintPayment } from "../../utils/printable/payment";
import { Endpoint } from "../../utils/endpoint";

const TableTransication = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [update, setUpdate] = useState(null);
  const [form] = Form.useForm();
  const [open1, setOpen1] = useState(false);
  const [add, setAdd] = useState(false);
  const [clients, setClients] = useState([]);
  const [clients2, setClients2] = useState([]);
  const [idClient, setIdClient] = useState([]);
  const [ContractClient, setContractClient] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isTransactionService, setIsTransactionService] = useState(false);
  const [services, setServices] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransactionDetails, setSelectedTransactionDetails] =
    useState(null);
  const [isTransactionDepense, setIsTransactionDepense] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [transactionType, setTransactionType] = useState("regular");
  const [reservations, setReservations] = useState([]);
  const [contractClients, setContractClients] = useState([]);

  const showTransactionDetails = (record) => {
    setSelectedTransactionDetails(record);
    setDetailModalVisible(true);
  };
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    services: true,
    abonnements: true,
    depenses: true,
    dateStart: null,
    dateEnd: null,
  });

  const showExportModal = () => {
    setIsExportModalVisible(true);
  };

  const handleExportModalCancel = () => {
    setIsExportModalVisible(false);
  };

  const handleExportModalOk = () => {
    exportData();
    setIsExportModalVisible(false);
  };

  const exportData = async () => {
    try {
      let allData = [];

      // if (exportFilters.services) {
      //   const serviceData = await fetchDataFromAPI(
      //     "https://JyssrMMAS.pythonanywhere.com/api/transaction_service/"
      //   );
      //   allData = [...allData, ...serviceData];
      // }

      if (exportFilters.abonnements) {
        const abonnementData = await fetchDataFromAPI(
          Endpoint()+"api/transactions/"
        );
        allData = [...allData, ...abonnementData];
      }

      // if (exportFilters.depenses) {
      //   const depenseData = await fetchDataFromAPI(
      //     "https://JyssrMMAS.pythonanywhere.com/api/transaction_depense/"
      //   );
      //   allData = [...allData, ...depenseData];
      // }

      // Filter data based on date range
      const filteredData = allData.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          (!exportFilters.dateStart || itemDate >= exportFilters.dateStart) &&
          (!exportFilters.dateEnd || itemDate <= exportFilters.dateEnd)
        );
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(filteredData);

      // Create workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");

      // Generate Excel file
      XLSX.writeFile(wb, "transactions_export.xlsx");

      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      message.error("An error occurred while exporting data");
    }
  };

  const fetchDataFromAPI = async (url) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData.data || [];
  };

  const TransactionDetailsModal = ({ visible, onClose, transaction }) => {
    if (!transaction) return null;

    return (
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={[
          <Button
            onClick={handlePrint}
            icon={<PrinterOutlined />}
            type="primary"
          >
            imprimer Transaction
          </Button>,
        ]}
        title={
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontWeight: "bold", color: "#1890ff", margin: 0 }}>
              Détails de{" "}
              {isTransactionService
                ? "la Transaction de Service"
                : "la Transaction"}
            </h2>
          </div>
        }
        width={700}
      >
        <div></div>
        <Descriptions
          bordered
          column={1}
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {transactionType == "depense" ? (
            <>
              <Descriptions.Item label="Date" style={{ fontWeight: "bold" }}>
                {formatDateToYearMonthDay(transaction.date)}
              </Descriptions.Item>

              <Descriptions.Item label="Montant" style={{ fontWeight: "bold" }}>
                {transaction.montant}
              </Descriptions.Item>
              <Descriptions.Item
                label="Mode de règlement"
                style={{ fontWeight: "bold" }}
              >
                {transaction.mode_reglement}
              </Descriptions.Item>
              <Descriptions.Item
                label="Description"
                style={{ fontWeight: "bold" }}
              >
                {transaction.description}
              </Descriptions.Item>
            </>
          ) : transactionType == "service" ? (
            <>
              <Descriptions.Item label="Date" style={{ fontWeight: "bold" }}>
                {formatDateToYearMonthDay(transaction.date)}
              </Descriptions.Item>

              <Descriptions.Item label="Montant" style={{ fontWeight: "bold" }}>
                {transaction.montant}
              </Descriptions.Item>
              <Descriptions.Item
                label="Mode de règlement"
                style={{ fontWeight: "bold" }}
              >
                {transaction.mode_reglement}
              </Descriptions.Item>
              <Descriptions.Item
                label="Description"
                style={{ fontWeight: "bold" }}
              >
                {transaction.description}
              </Descriptions.Item>
              <Descriptions.Item
                label="Réduction"
                style={{ fontWeight: "bold" }}
              >
                {transaction.reduction}
              </Descriptions.Item>
            </>
          ) : (
            <>
              <Descriptions.Item label="Date" style={{ fontWeight: "bold" }}>
                {formatDateToYearMonthDay(transaction.date)}
              </Descriptions.Item>

              <Descriptions.Item label="Montant" style={{ fontWeight: "bold" }}>
                {transaction.montant}
              </Descriptions.Item>
              <Descriptions.Item
                label="Mode de règlement"
                style={{ fontWeight: "bold" }}
              >
                {transaction.Mode_reglement}
              </Descriptions.Item>
              <Descriptions.Item
                label="Description"
                style={{ fontWeight: "bold" }}
              >
                {transaction.description}
              </Descriptions.Item>
              <Descriptions.Item label="Client" style={{ fontWeight: "bold" }}>
                {transaction.client}
              </Descriptions.Item>
              <Descriptions.Item label="Admin" style={{ fontWeight: "bold" }}>
                {transaction.admin}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Modal>
    );
  };

  const fetchFournisseurs = async () => {
    try {
      const response = await fetch(Endpoint()+"api/fournisseur/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setFournisseurs(data.data);
    } catch (error) {
      console.error("Error fetching fournisseurs:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        Endpoint()+"api/reservationService/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }
      const data = await response.json();
      setReservations(data.data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      // message.error("Failed to load reservations");
    }
  };

  const [transactionData, setTransactionData] = useState({
    date: getCurrentDate(),
    Type: transactionType == "depense" ? false : true,
    montant: null,
    Mode_reglement: "",
    description: "",
    id_contrat: null,
    id_admin: localStorage.getItem("data")[0].id_employe,
    client: "",
    image: "",
    admin: localStorage.getItem("data")[0].login,
    Reste: null,
    rest_pre: null,
    // Additional fields for transaction service
    type: "",
    reduction: null,
    id_reserv: null,
    id_service: null,
    mode_reservation: "admin",
  });

  useEffect(() => {
    const fecthConn = async () => {
      try {
        const response = await fetch(
          Endpoint()+"api/contrat/?client_id=" + idClient,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const data = await response.json();
        if (data.data.length == 0) {
          message.warning(
            "Ce client n'a pas de contrat, veuillez en créer un pour lui"
          );
        }
        setContractClient(data.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fecthConn();
  }, [idClient]);

  // Validation function to check if all required fields are filled for the room form
  const isRoomFormValid = () => {
    return true;
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url;

        switch (transactionType) {
          // case "service":
          //   url =
          //     "https://JyssrMMAS.pythonanywhere.com/api/transaction_service/";
          //   break;
          // case "depense":
          //   url =
          //     "https://JyssrMMAS.pythonanywhere.com/api/transaction_depense/";
          //   break;
          default:
            url = Endpoint()+"api/transactions/";
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const jsonData = await response.json();

        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key:
            item.id_tran ||
            item.id_tran_service ||
            item.id_tran_depense ||
            index,
        }));

        setData(processedData);
        setFilteredData(processedData);

        let desiredKeys;
        console.log(transactionType);

        switch (transactionType) {
          case "service":
            desiredKeys = ["date", "montant", "mode_reglement", "description"];
            break;
          case "depense":
            // desiredKeys = ["date", "type", "montant", "mode_reglement", "description", "societe"];
            break;
          default:
          // desiredKeys = ["client", "date", "Type", "montant"];
        }

        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(key.replace(/\_/g, " ")),
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "Type" || key === "type") {
            } else if (key === "date") {
              return formatDateToYearMonthDay(text);
            }
            return text;
          },
        }));

        generatedColumns.push({
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <EyeOutlined
              style={{ cursor: "pointer" }}
              onClick={() => showTransactionDetails(record)}
            />
          ),
        });

        setColumns(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, update, add, transactionType]);
  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Handle search input change
  // const handleSearch = (e) => {
  //   const value = e.target.value.toLowerCase();
  //   setSearchText(value);
  //   const filtered = data.filter((item) =>
  //     item.client.toLowerCase().startsWith(value)
  //   );
  //   setFilteredData(filtered);
  // };

  // Row selection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log("selectedRowKeys changed: ", selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Disable checkbox for specific rows
    }),
  };

  // Handle edit button click
  const handleEditClick = () => {
    if (selectedRowKeys.length === 1) {
      const clientToEdit = data.find(
        (client) => client.key === selectedRowKeys[0]
      );
      setEditingClient(clientToEdit);
      form.setFieldsValue(clientToEdit);
      setIsModalVisible(true);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { PeriodeSalaire } = values;

      // Check if date_naissance is not empty
      if (!PeriodeSalaire) {
        message.error("Veuillez entrer la date de naissance");
        return;
      }

      // Add id_client to the values object

      const response = await fetch(`${Endpoint()}api/coach/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        const updatedData = data.map((client) =>
          client.key === editingClient.key ? updatedClient : client
        );
        setUpdate(updatedData);
        setData(updatedData);
        setFilteredData(updatedData);
        message.success("Client mis à jour avec succès");
        setIsModalVisible(false);
        setEditingClient(null);
        setSelectedRowKeys([]);
        // Reset the form fields
        form.resetFields();
      } else {
        message.error("Erreur lors de la mise à jour du client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      message.error("An error occurred while updating the client");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingClient(null);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const clientToDelete = data.find((client) => client.key === key);
          console.log(clientToDelete);
          const response = await fetch(
            `${Endpoint()}api/periode/${clientToDelete.id_periode}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify(clientToDelete),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to delete client with key ${key}`);
          }
          const id_staff = JSON.parse(localStorage.getItem("data"));
          await addNewTrace(
            22,
            "Suppression",
            getCurrentDate(),
            `${JSON.stringify(transactionData)}`,
            isTransactionService
              ? "transaction_services"
              : isTransactionDepense
              ? "transaction_depenses"
              : "transactions"
          );
        });

        await Promise.all(promises);

        const updatedData = data.filter(
          (client) => !selectedRowKeys.includes(client.key)
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setSelectedRowKeys([]);
        message.success(
          `${selectedRowKeys.length} client(s) supprimé(s) avec succès`
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

  useEffect(() => {
    fetchData();
    fetchClients();
    fetchServices();
    fetchFournisseurs();
    fetchClients2();
  }, [authToken, update, add, transactionType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url;
      switch (transactionType) {
        // case "service":
        //   url = "https://JyssrMMAS.pythonanywhere.com/api/transaction_service/";
        //   break;
        // case "depense":
        //   url = "https://JyssrMMAS.pythonanywhere.com/api/transaction_depense/";
        //   break;
        default:
          url = Endpoint()+"api/transactions/";
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const jsonData = await response.json();

      const processedData = jsonData.data.map((item, index) => ({
        ...item,
        key:
          item.id_tran || item.id_tran_service || item.id_tran_depense || index,
      }));

      setData(processedData);
      setFilteredData(processedData);

      let desiredKeys;
      switch (transactionType) {
        case "service":
          desiredKeys = ["date", "montant", "mode_reglement", "description"];
          break;
        case "depense":
          desiredKeys = [
            "date",
            "montant",
            "mode_reglement",
            "description",
            "societe",
          ];
          break;
        default:
          desiredKeys = ["client", "date", "Type", "montant"];
      }

      const generatedColumns = desiredKeys.map((key) => ({
        title: capitalizeFirstLetter(key.replace(/\_/g, " ")),
        dataIndex: key,
        key,
        render: (text, record) => {
          if (key === "Type" || key === "type") {
            return transactionType === "service"
              ? text
              : text
              ? "Entrée"
              : "Sortie";
          } else if (key === "date") {
            return formatDateToYearMonthDay(text);
          }
          return text;
        },
      }));

      generatedColumns.push({
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => showTransactionDetails(record)}
          />
        ),
      });

      setColumns(generatedColumns);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(
        Endpoint()+"api/client_contrat/"
      );
      const data = await response.json();
      setContractClients(data.data);
      const seenClients = new Set();
      const uniqueData = [];

      data.data.forEach((item) => {
        if (!seenClients.has(item.id_etd)) {
          seenClients.add(item.id_etd);
          uniqueData.push(item);
        }
      });
      setClients(uniqueData);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchClients2 = async () => {
    try {
      const response = await fetch(Endpoint()+"api/etudiants/");
      const data = await response.json();

      setClients2(data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(Endpoint()+"api/service/");
      const data = await response.json();
      console.log("services:" + data.data);

      setServices(data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      isTransactionService
        ? item.type.toLowerCase().includes(value)
        : item.client.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleAdd = async () => {
    transactionData.mode_reglement = transactionData.Mode_reglement;

    const idadmin = await JSON.parse(localStorage.getItem("data"))[0].id_admin;

    try {
      let url;

      url = Endpoint()+"api/transactions/";

      const discountedAmount =
        transactionData.montant -
        transactionData.montant * (parseFloat(transactionData.reduction) / 100);

      if (transactionType == "regular") {
        transactionData.Reste = transactionData.Reste - transactionData.montant;
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...transactionData,
          id_admin: idadmin,
          montant: discountedAmount
            ? discountedAmount
            : transactionData.montant, // Use the discounted amount
        }),
      });

      if (response.ok) {
        const res = await response.json();
        if (
          res.msg === "Added Successfully!!" ||
          res.msg == "Added Successfully!!e" ||
          res == "Added Successfully!!"
        ) {
          message.success(`ajoutée avec succès`);
          setAdd(Math.random() * 1000);
          resetTransactionData();
          const id_staff = JSON.parse(localStorage.getItem("data"));
          await addNewTrace(
            22,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(transactionData)}`,
            isTransactionService
              ? "transaction_services"
              : isTransactionDepense
              ? "transaction_depenses"
              : "transactions"
          );
          onCloseR();
        } else {
          message.warning(res.msg);
        }
      } else {
        message.error("Error adding transaction");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      message.error("An error occurred while adding the transaction");
    }
  };

  const resetTransactionData = () => {
    setTransactionData({
      date: getCurrentDate(),
      Type: true,
      montant: null,
      Mode_reglement: "",
      description: "",
      id_contrat: null,
      id_admin: localStorage.getItem("data")[0].id_admin,
      client: "",
      image: "",
      admin: localStorage.getItem("data")[0].login,
      Reste: null,
      rest_pre: null,
      type: "",
      reduction: 0,
      id_reserv: null,
      id_service: null,
    });
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    resetTransactionData();
  };

  const handleRoomSubmit = () => {
    handleAdd();
  };

  const findServiceTarif = (serviceId) => {
    const service = services.find((s) => s.ID_service === serviceId);
    return service ? service.Tarif : 0;
  };

  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value);
    if (isNaN(newAmount) || newAmount < 0) {
      message.warning("Veuillez entrer un montant valide.");
      return;
    }

    if (newAmount > transactionData.initialReste) {
      message.warning("Le montant ne peut pas dépasser le reste initial.");
      return;
    }

    const newReste = transactionData.initialReste - newAmount;
    setTransactionData({
      ...transactionData,
      montant: newAmount,
      currentReste: newReste,
    });
  };

  const handlePrint = () => {
    console.log("====================================");
    console.log(contractClients, selectedTransactionDetails);
    console.log("====================================");
    const client = contractClients.find(
      (c) => c.id_contrat === selectedTransactionDetails.id_contrat
    );
    console.log(client);

    if (selectedTransactionDetails) {
      printFacteur(client, selectedTransactionDetails);
    } else {
      message.warning("Please select a transaction to print");
    }
  };

  const handlePrintRecu = () => {
    const contart = contractClients.find(
      (c) => c.id_contrat === selectedTransactionDetails.id_contrat
    );
    const client = clients2.find((c) => c.id_etudiant === contart.id_etd);
    console.log(selectedTransactionDetails);

    if (selectedTransactionDetails && client) {
      handlePrintPayment(
        client.Prenom_client,
        client.nom,
        client.cin,
        client.cin,
        "",
        selectedTransactionDetails.montant
      );
    } else {
      message.warning("Please select a transaction to print");
    }
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
        <Modal
          title="Export Transactions"
          visible={isExportModalVisible}
          onOk={handleExportModalOk}
          onCancel={handleExportModalCancel}
        >
          <Form layout="vertical">
            <Form.Item label="Date Range">
              <DatePicker.RangePicker
                onChange={(dates) => {
                  setExportFilters({
                    ...exportFilters,
                    dateStart: dates ? dates[0].toDate() : null,
                    dateEnd: dates ? dates[1].toDate() : null,
                  });
                }}
              />
            </Form.Item>
          </Form>
        </Modal>

        <TransactionDetailsModal
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          transaction={selectedTransactionDetails}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-7">
            <div className="w-52">
              <Input
                prefix={<SearchOutlined />}
                placeholder={`Search ${
                  isTransactionService ? "transaction service" : "transaction"
                }`}
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-6">
              <Button
                type="default"
                onClick={showExportModal}
                icon={<ExportOutlined />}
              >
                Export
              </Button>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              {(JSON.parse(localStorage.getItem(`data`))[0].fonction ===
                "Administration" ||
                JSON.parse(localStorage.getItem(`data`))[0].fonction ===
                  "secretaire") && (
                <Button
                  type="default"
                  onClick={showDrawerR}
                  icon={<UserAddOutlined />}
                >
                  Ajouter{" "}
                  {isTransactionService ? "transaction service" : "transaction"}
                </Button>
              )}
            </div>
            <Drawer
              title={`Saisir une nouvelle `}
              width={720}
              onClose={onCloseR}
              closeIcon={false}
              open={open1}
              bodyStyle={{
                paddingBottom: 80,
              }}
            >
              <div className="p-3 md:pt-0 md:pl-0 md:pr-10">
                <div className="grid grid-cols-2 gap-4 mt-5">
                  {transactionType === "regular" && (
                    <>
                      {/* Client Selection */}
                      <div>
                        <label htmlFor="client" className="block font-medium">
                          *Etudiant
                        </label>
                        <Select
                          id="client"
                          value={transactionData.client}
                          showSearch
                          placeholder="Client"
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value, option) => {
                            setTransactionData({
                              ...transactionData,
                              client: option.label,
                            });
                            setIdClient(value);
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={clients.map((cli) => ({
                            label: `${cli.client} ${cli.Prenom_client}`,
                            value: cli.id_etd,
                          }))}
                        />
                      </div>

                      {/* Contract Selection */}
                      <div>
                        <label htmlFor="contrat" className="block font-medium">
                          *Contrat
                        </label>
                        <Select
                          id="contrat"
                          disabled={ContractClient.length === 0}
                          showSearch
                          placeholder="Contrat"
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value) => {
                            const con = ContractClient.find(
                              (f) => f.id_contrat === value
                            );
                            setTransactionData({
                              ...transactionData,
                              id_contrat: value,
                              Reste: con ? con.reste : 0,
                            });
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={ContractClient.map((cli) => ({
                            label: `${cli.abonnement}-${cli.cat_abn}`,
                            value: cli.id_contrat,
                          }))}
                        />
                      </div>

                      {/* Previous Amount Input */}
                      <div>
                        <label
                          htmlFor="restPrecedant"
                          className="block font-medium"
                        >
                          Le Montant
                        </label>
                        <Input
                          disabled={transactionData.Reste === 0}
                          id="montant"
                          value={transactionData.montant}
                          onChange={(e) => {
                            const newRestPre = e.target.value;
                            if (
                              parseFloat(newRestPre) > transactionData.Reste
                            ) {
                              message.warning(
                                "Le montant précédent dépasse le montant disponible."
                              );
                            } else {
                              setTransactionData({
                                ...transactionData,
                                montant: newRestPre,
                              });
                            }
                          }}
                          placeholder="Le montant"
                          type="number"
                        />
                      </div>

                      {/* Current Amount Display */}
                      <div>
                        <label
                          htmlFor="restActuel"
                          className="block font-medium"
                        >
                          Le reste actuel
                        </label>
                        <Input
                          id="restActuel"
                          disabled={true}
                          value={transactionData.Reste}
                          readOnly
                          placeholder="Le reste actuel"
                          type="number"
                        />
                      </div>

                      {/* Type Selection */}
                      <div>
                        <label htmlFor="type" className="block font-medium">
                          *Type
                        </label>
                        <Select
                          id="type"
                          value={transactionData.Type ? "Entrée" : "Sortie"}
                          showSearch
                          placeholder="Type"
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value) =>
                            setTransactionData({
                              ...transactionData,
                              Type: value === "Entrée",
                            })
                          }
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[
                            { label: "Entrée", value: "Entrée" },
                            { label: "Sortie", value: "Sortie" },
                          ]}
                        />
                      </div>
                    </>
                  )}
                  {transactionType === "service" && (
                    <>
                      <div>
                        <label htmlFor="service" className="block font-medium">
                          *Service
                        </label>
                        <Select
                          id="service"
                          showSearch
                          placeholder="Service"
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value, options) => {
                            const serviceTarif = findServiceTarif(value);
                            console.log(serviceTarif + " hlll");
                            setTransactionData({
                              ...transactionData,
                              id_service: value,
                              montant: serviceTarif, // Set the montant to the service's tarif
                            });
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={services.map((service) => ({
                            label: service.service,
                            value: service.ID_service,
                          }))}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="reservation"
                          className="block font-medium"
                        >
                          Réservation
                        </label>
                        <Select
                          id="reservation"
                          showSearch
                          placeholder="Sélectionnez une réservation"
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value, option) => {
                            setTransactionData({
                              ...transactionData,
                              id_reserv: value,
                              id_service: option.service_id,
                              id_client: option.client_id,
                            });
                          }}
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {reservations.map((reservation) => (
                            <Select.Option
                              key={reservation.id_rsv_srvc}
                              value={reservation.id_rsv_srvc}
                              service_id={reservation.id_service}
                              client_id={reservation.id_client}
                            >
                              {reservation.service} - {reservation.client} -{" "}
                              {reservation.date_presence}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                      {/* <div>
                      <label htmlFor="contrat" className="block font-medium">
                        *Client
                      </label>
                      <Select
                        id="contrat"
                        showSearch
                        placeholder="Contrat"
                        className="w-full"
                        optionFilterProp="children"
                        onChange={(value) => {
                          const con = contractClients.find(
                            (f) => f.id_contrat === value
                          );
                          setTransactionData({
                            ...transactionData,
                            id_contrat: value,
                          });
                        }}
                        filterOption={(input, option) =>
                          (option?.label ?? "").startsWith(input)
                        }
                        options={contractClients.map((cli) => ({
                          label: `${cli.client} ${cli.Prenom_client}`,
                          value: cli.id_contrat,
                        }))}
                      />
                    </div> */}
                      <div>
                        <label htmlFor="montant" className="block font-medium">
                          Montant
                        </label>
                        <Input
                          id="montant"
                          disabled={true}
                          value={transactionData.montant}
                          onChange={(e) => {
                            const newMontant = parseFloat(e.target.value);
                            if (
                              transactionType === "regular" &&
                              newMontant > parseFloat(transactionData.Reste)
                            ) {
                              message.warning(
                                "Le montant ne peut pas dépasser le reste à payer."
                              );
                              return;
                            }
                            setTransactionData({
                              ...transactionData,
                              montant: e.target.value,
                            });
                          }}
                          placeholder="Montant"
                          type="number"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="reduction"
                          className="block font-medium"
                        >
                          Réduction (%)
                        </label>
                        <Input
                          id="reduction"
                          value={transactionData.reduction}
                          onChange={(e) => {
                            const newReduction = parseFloat(e.target.value);
                            if (
                              isNaN(newReduction) ||
                              newReduction < 0 ||
                              newReduction > 100
                            ) {
                              message.error(
                                "La réduction doit être un pourcentage entre 0 et 100."
                              );
                              return;
                            }
                            setTransactionData({
                              ...transactionData,
                              reduction: e.target.value,
                            });
                          }}
                          placeholder="Réduction (%)"
                          type="number"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="montantApresReduction"
                          className="block font-medium"
                        >
                          Montant après réduction
                        </label>
                        <Input
                          id="montantApresReduction"
                          value={
                            transactionData.montant -
                            transactionData.montant *
                              (parseFloat(transactionData.reduction) / 100)
                          }
                          disabled={true}
                          readOnly
                          placeholder="Montant après réduction"
                          type="number"
                        />
                      </div>

                      <div className="w-full">
                        <label
                          htmlFor="typeService"
                          className="block font-medium"
                        >
                          *Type de Service
                        </label>
                        {/* <Input
                        id="typeService"
                        value={transactionData.type}
                        onChange={(e) =>
                          setTransactionData({
                            ...transactionData,
                            type: e.target.value,
                          })
                        }
                        placeholder="Type de service"
                      /> */}
                        {JSON.parse(localStorage.getItem(`data`))[0]
                          .fonction === "Administration" ? (
                          <Select
                            id="selectEntree"
                            placeholder="Type de Transaction"
                            value={transactionData.type}
                            defaultValue={"Entrée"}
                            className="w-full"
                            onChange={(value, option) => {
                              setTransactionData({
                                ...transactionData,
                                type: value,
                              });
                            }}
                            style={{ width: 200, marginBottom: 10 }}
                          >
                            <Option value="Entrée">Entrée</Option>
                          </Select>
                        ) : (
                          <Select
                            id="selectEntree"
                            placeholder="Type de service"
                            value={transactionData.type}
                            className="w-full"
                            onChange={(value, option) => {
                              setTransactionData({
                                ...transactionData,
                                type: value,
                              });
                            }}
                            style={{ width: 200, marginBottom: 10 }}
                          >
                            <Option value="Entrée">Entrée</Option>
                          </Select>
                        )}
                      </div>
                    </>
                  )}
                  {transactionType === "depense" && (
                    <>
                      <div>
                        <label
                          htmlFor="fournisseur"
                          className="block font-medium"
                        >
                          *Fournisseur
                        </label>
                        <Select
                          id="fournisseur"
                          showSearch
                          placeholder="Fournisseur"
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value) => {
                            setTransactionData({
                              ...transactionData,
                              id_fournisseur: value,
                            });
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={fournisseurs.map((fournisseur) => ({
                            label: fournisseur.societe,
                            value: fournisseur.id_frs,
                          }))}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="typeDepense"
                          className="block font-medium"
                        >
                          *Type de Transaction
                        </label>
                        <Select
                          id="typeDepense"
                          value={transactionData.type}
                          defaultValue={"Sortie"}
                          onChange={(value) =>
                            setTransactionData({
                              ...transactionData,
                              type: value,
                            })
                          }
                          placeholder="Type de dépense"
                          className="w-full"
                        >
                          <Select.Option value="Sortie">Sortie</Select.Option>
                        </Select>
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block font-medium"
                        >
                          Montant
                        </label>
                        <Input
                          type="number"
                          id="description"
                          value={transactionData.montant}
                          onChange={(e) => {
                            setTransactionData({
                              ...transactionData,
                              montant: e.target.value,
                            });
                          }}
                          placeholder="montant"
                        />
                      </div>
                    </>
                  )}
                  {/* Common fields for all transaction types */}

                  <div>
                    <label htmlFor="description" className="block font-medium">
                      Description
                    </label>
                    <Input.TextArea
                      id="description"
                      value={transactionData.description}
                      onChange={(e) => {
                        setTransactionData({
                          ...transactionData,
                          description: e.target.value,
                        });
                      }}
                      placeholder="Description"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modeReglement"
                      className="block font-medium"
                    >
                      *Mode de Règlement
                    </label>
                    <Select
                      id="modeReglement"
                      value={transactionData.Mode_reglement}
                      showSearch
                      placeholder="Mode de règlement"
                      className="w-full"
                      optionFilterProp="children"
                      onChange={(value) =>
                        setTransactionData({
                          ...transactionData,
                          Mode_reglement: value,
                        })
                      }
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        { label: "Chèques", value: "chèques" },
                        { label: "Espèces", value: "Espèces" },
                        { label: "Prélèvements", value: "prélèvements" },
                        { label: "Autres", value: "autres" },
                      ]}
                    />
                  </div>
                </div>
                <Space className="mt-10">
                  <Button danger onClick={onCloseR}>
                    Annuler
                  </Button>
                  <Button onClick={handleRoomSubmit} type="default">
                    Enregistrer
                  </Button>
                </Space>
              </div>
            </Drawer>
          </div>
        </div>
        <Table
          loading={loading}
          pagination={{
            pageSize: 7,
            showQuickJumper: true,
          }}
          size="small"
          className="w-full mt-5"
          columns={columns}
          dataSource={filteredData}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default TableTransication;
