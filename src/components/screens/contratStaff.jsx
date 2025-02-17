import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Button,
  Drawer,
  Space,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  DeleteOutlined,
  PrinterOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import moment from "moment";
import { handlePrintContractStaff } from "../../utils/printable/contraStaff";
// import { handlePrintContractStaff } from "../../../utils/printable/contraStaff";
import { addNewTrace, getCurrentDate } from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const TableContractStaff = ({ darkmode }) => {
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
  const [staffOptions, setStaffOptions] = useState([]);
  const [add, setAdd] = useState(false);
  const [contarctClient, setcontarctClient] = useState([]);
  const [contarctStaff, setcontarctStaff] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedContractDetails, setSelectedContractDetails] = useState(null);

  // State for room related data
  const [ClientData, setClientData] = useState({
    id_employe: null,
    date_debut: "",
    date_fin: null,
    type_contrat: "",
    salaire: 0,
    employe: "",
    image: "",
  });

  const showContractDetails = (record) => {
    setSelectedContractDetails(record);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedContractDetails(null);
  };

  const getDetailData = (contract) => {
    const orderMap = {
      "Full Name": 1,
      Image: 2,
      "Contract Type": 3,
      "Start Date": 4,
      "End Date": 5,
      Salary: 6,
      "Employee ID": 7,
      "Contract ID": 8,
    };

    const detailData = [
      { field: "Nom complet", value: contract.employe },
      // { field: "Photo", value: contract.image },
      { field: "Type de contrat", value: contract.type_contrat },
      { field: "Date de début", value: contract.date_debut },
      { field: "Date de fin", value: contract.date_fin || "Indéterminée" },
      { field: "Salaire", value: `${contract.salaire} MAD` },
    ];

    return detailData
      .sort((a, b) => orderMap[a.field] - orderMap[b.field])
      .map((item, index) => ({
        key: index,
        field: item.field,
        value: item.value,
      }));
  };

  const detailColumns = [
    {
      title: "Champ",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Valeur",
      dataIndex: "value",
      key: "value",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          Endpoint()+"/api/staff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        setcontarctClient(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          Endpoint()+"/api/contratstaff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        setcontarctStaff(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePrint = () => {
    selectedRowKeys.map(async (key) => {
      const ContractData = data.find((client) => client.key === key);
      const Client = contarctClient.find(
        (client) => client.id_employe === ContractData.id_employe
      );
      handlePrintContractStaff(Client, ContractData);
    });
  };

  // Validation function to check if all required fields are filled for the room form
  const isRoomFormValid = () => {
    const { id_employe, date_debut, date_fin, type_contrat, salaire } =
      ClientData;
    return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          Endpoint()+"/api/staff/"
        );
        const jsonData = await response.json();
        // Create options for the staff Select
        const staffOptionss = jsonData.data.map((staff) => ({
          value: staff.id_employe, // Assuming staff has an 'id' property
          label: staff.nom + " " + staff.prenom, // Assuming staff has a 'name' property
        }));
        setStaffOptions(staffOptionss);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to add a new chamber
  const addClient = async () => {
    const check = contarctStaff.filter(
      (staff) => staff.id_employe == ClientData.id_employe
    );
    console.log(check);
    if (check.length > 0) {
      message.warning("Ce membre du personnel a déjà un contrat.");
      return false;
    }
    // check in contra staf
    try {
      // Check if the form is valid before submitting
      if (!isRoomFormValid()) {
        message.error("Please fill in all required fields for the chamber.");
        return;
      }
      if (ClientData.date_fin == "") {
        ClientData.date_fin = null;
      }
      // ClientData.date_fin = null;

      const response = await fetch(
        Endpoint()+"/api/contratstaff/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
          body: JSON.stringify(ClientData),
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res.msg == "Added Successfully!!e") {
          message.success("Contarct added successfully");
          setAdd(Math.random() * 1000);
          setClientData({
            id_employe: null,
            date_debut: "",
            date_fin: null,
            type_contrat: "",
            salaire: 0,
            employe: "",
            image: "",
          });
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_admin,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(ClientData)}`,
            "contart staff"
          );
          onCloseR();
        } else {
          message.warning(res.msg);
          console.log(res);
        }
      } else {
        console.log(response);
        message.error("Error adding chamber");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred:", error);
    }
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    setClientData({
      id_employe: null,
      date_debut: "",
      date_fin: null,
      type_contrat: "",
      salaire: 0,
      employe: "",
      image: "",
    });
  };

  // Function to handle form submission in the room drawer
  const handleRoomSubmit = () => {
    addClient();
  };

  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          Endpoint()+"/api/contratstaff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();

        // Ensure each row has a unique key
        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_contratStaff || index, // Assuming each item has a unique id, otherwise use index
        }));

        setData(processedData);
        setFilteredData(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = [
          { key: "employe", title: "Employé" },
          { key: "type_contrat", title: "Type de contrat" },
          { key: "salaire", title: "Salaire" },
          { key: "date_debut", title: "Date de début" },
          { key: "date_fin", title: "Date de fin" },
          { key: "action", title: "Action" },
        ];

        const generatedColumns = desiredKeys.map(({ key, title }) => ({
          title: title,
          dataIndex: key,
          key: key,
          render: (text, record) => {
            if (key === "date_fin" && (text === "2060-01-01" || text == null)) {
              return <Tag>Indéterminée</Tag>;
            } else if (key === "date_debut" || key === "date_fin") {
              return <Tag>{text}</Tag>;
            } else if (key === "salaire") {
              return `${text} MAD`;
            } else if (key === "action") {
              return (
                <EyeOutlined
                  onClick={() => showContractDetails(record)}
                  style={{ cursor: "pointer" }}
                />
              );
            }
            return text;
          },
        }));

        setColumns(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, update, add]);

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.employe.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

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

      const response = await fetch(
        `${Endpoint()}/api/coach/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(values),
        }
      );

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
            `${Endpoint()}/api/contratstaff/${clientToDelete.id_contratStaff}`,
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
            throw new Error(`Failed to delete contart staff with key ${key}`);
          }
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_admin,
            "Supprimer",
            getCurrentDate(),
            `${JSON.stringify(clientToDelete)}`,
            "contart staff"
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
          `${selectedRowKeys.length} contact(s) supprimé(s) avec succès`
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
    <div className="w-full p-2">
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
        <Modal
          title="Détails du contrat"
          visible={isDetailModalVisible}
          onCancel={handleDetailModalCancel}
          footer={null}
          width={800}
        >
          {selectedContractDetails && (
            <Table
              columns={detailColumns}
              dataSource={getDetailData(selectedContractDetails)}
              pagination={false}
              size="small"
            />
          )}
        </Modal>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-7">
            <div className="w-52">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search Contrat Staff"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-6">
              {/* // we had disable this function cas security problem  */}
              {/* {(true) &&
                selectedRowKeys.length >= 1 ? (
                <Popconfirm
                  title="Supprimer le contact"
                  description="Etes-vous sûr de supprimer Contrat Staff"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  {selectedRowKeys.length} <DeleteOutlined className="cursor-pointer" />{" "}
                </Popconfirm>
              ) : (
                ""
              )} */}
              {true && selectedRowKeys.length == 1 ? (
                <PrinterOutlined onClick={handlePrint} disabled={true} />
              ) : (
                ""
              )}
            </div>
          </div>
          {/* add new client  */}
          <div>
            <div className="flex items-center space-x-3">
              {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "Administration" &&
                (true? (
                  <Button
                    onClick={showDrawerR}
                    icon={<UserAddOutlined />}
                  >
                    Ajoute Contrat Staff
                  </Button>
                ) : (
                  ""
                ))}
            </div>
            <Drawer
              title="Saisir un nouveau Contrat Staff"
              width={720}
              onClose={onCloseR}
              closeIcon={false}
              open={open1}
              bodyStyle={{
                paddingBottom: 80,
              }}
            >
              <div>
                <div className="p-3 md:pt-0 md:pl-0 md:pr-10">
                  <div className="">
                    <div className="grid grid-cols-2 gap-4 mt-5">
                      <div>
                        <label htmlFor="Année" className="block font-medium">
                          *Staff
                        </label>
                        <Select
                          id="Staff"
                          showSearch
                          placeholder="Staff"
                          value={ClientData.employe}
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value, option) => {
                            setClientData({
                              ...ClientData,
                              id_employe: value,
                              employe: option.label,
                            });
                            ClientData.id_employe = value;
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "").startsWith(input)
                          }
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toLowerCase()
                              .localeCompare(
                                (optionB?.label ?? "").toLowerCase()
                              )
                          }
                          options={staffOptions}
                        />{" "}
                      </div>
                      <div>
                        <label htmlFor="Mois" className="block font-medium">
                          {" "}
                          * Type contrat{" "}
                        </label>
                        <Select
                          id="mois"
                          showSearch
                          placeholder="Type contrat"
                          className="w-full"
                          value={ClientData.type_contrat}
                          optionFilterProp="children"
                          onChange={(value) => {
                            if (value == "Anapec") {
                              ClientData.date_fin = moment()
                                .add(2, "years")
                                .format("YYYY-MM-DD");
                              ClientData.date_debut =
                                moment().format("YYYY-MM-DD");
                            } else {
                              ClientData.date_fin = "";
                              ClientData.date_debut = "";
                            }
                            setClientData({
                              ...ClientData,
                              type_contrat: value,
                            });
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "").startsWith(input)
                          }
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toLowerCase()
                              .localeCompare(
                                (optionB?.label ?? "").toLowerCase()
                              )
                          }
                          options={[
                            { value: "CDD", label: "CDD" },
                            { value: "CDI", label: "CDI" },
                            { value: "Anapec", label: "Anapec" },
                            { value: "vacataire", label: "vacataire" },
                            { value: "Autre", label: "Autre" },
                          ]}
                        />
                      </div>
                      <div>
                        <div>*Montant</div>
                        <Input
                          value={ClientData.salaire}
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              salaire: value.target.value,
                            })
                          }
                          placeholder="Montant"
                        ></Input>
                      </div>
                      <div>
                        <div>*Date de debut</div>
                        <Input
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              date_debut: value.target.value,
                            })
                          }
                          value={ClientData.date_debut}
                          type="date"
                          placeholder="Montant"
                        ></Input>
                      </div>
                      {ClientData.type_contrat == "CDI" ? (
                        ""
                      ) : (
                        <div>
                          <div>*Date de fine</div>
                          <Input
                            value={ClientData.date_fin}
                            onChange={(value) =>
                              setClientData({
                                ...ClientData,
                                date_fin: value.target.value,
                              })
                            }
                            type="date"
                            placeholder="Montant"
                          ></Input>
                        </div>
                      )}
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
          className={`w-full mt-5 ${darkmode ? "ant-table-dark" : ""}`}
          columns={columns}
          dataSource={filteredData}
          rowSelection={rowSelection}
          rowHoverable={darkmode ? false : true}
        />
        <Modal
          title="Edit Coach"
          visible={isModalVisible}
          onOk={handleModalSubmit}
          onCancel={handleModalCancel}
        >
          <div className="h-96 overflow-y-auto">
            <Form form={form} layout="vertical">
              <Form.Item name="mois" label="mois">
                <Input
                  type="date"
                  disabled
                  rules={[{ required: true, message: "mois" }]}
                />
              </Form.Item>
              <Form.Item name="Année" label="Année">
                <Input
                  type="date"
                  disabled
                  rules={[{ required: true, message: "Année" }]}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default TableContractStaff;
