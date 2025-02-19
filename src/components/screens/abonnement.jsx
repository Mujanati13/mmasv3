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
  Tooltip,
  Divider,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  DeleteOutlined,
  EditOutlined,
  BorderOuterOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { addNewTrace, getCurrentDate } from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const TableAbonnement = ({ darkmode }) => {
  const [data1, setData1] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKeys1, setSelectedRowKeys1] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchText1, setSearchText1] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [update, setUpdate] = useState(null);
  const [update1, setUpdate1] = useState(null);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [add, setAdd] = useState(false);
  const [add1, setAdd1] = useState(false);
  const [categories, setcategories] = useState([]);
  const [contarctValue, setcontarctValue] = useState([]);
  const [showAbonnementModal, setShowAbonnementModal] = useState(false);
  const [showCategorieModal, setShowCategorieModal] = useState(false);
  const [selectedAbonnement, setSelectedAbonnement] = useState(null);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);

  // State for room related data
  const [ClientData, setClientData] = useState({
    type_abonnement: "",
    tarif: null,
    Niveau_age: null,
    Systeme: null,
    description: null,
    id_cat_cont: null,
    namecat_conrat: "",
    duree_mois: null,
  });

  const [CategoireData, setCategoireData] = useState({
    type_contrat: "",
    duree_mois: null,
  });

  const AbonnementDetailsModal = ({ visible, onClose, abonnement }) => {
    return (
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        title=" Details Abonnement"
      >
        <div className="notification-detail border border-blue-300 rounded-lg p-4 bg-white shadow-md mb-3">
          <div className="subscription-detail mb-3">
            <strong className="text-blue-600">Type d'abonnement :</strong>
            <span className="text-gray-800 ml-2">
              {abonnement?.type_abonnement}
            </span>
          </div>

          <div className="subscription-detail mb-3">
            <strong className="text-blue-600">Tarif :</strong>
            <span className="text-gray-800 ml-2">{abonnement?.tarif}</span>
          </div>

          <div className="subscription-detail mb-3">
            <strong className="text-blue-600">Catégorie contrat :</strong>
            <span className="text-gray-800 ml-2">
              {abonnement?.namecat_conrat}
            </span>
          </div>

          <div className="subscription-detail mb-3">
            <strong className="text-blue-600">Durée :</strong>
            <span className="text-gray-800 ml-2">
              {abonnement?.duree_mois} mois
            </span>
          </div>
        </div>
      </Modal>
    );
  };

  const CategorieDetailsModal = ({ visible, onClose, categorie }) => {
    return (
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        title="Catégorie Details"
      >
        <div className="notification-detail border border-blue-300 rounded-lg p-4 bg-white shadow-md mb-3">
          <div className="contract-detail mb-3">
            <strong className="text-blue-600">Type de contrat :</strong>
            <span className="text-gray-800 ml-2">
              {categorie?.type_contrat}
            </span>
          </div>

          <div className="contract-detail mb-3">
            <strong className="text-blue-600">Durée :</strong>
            <span className="text-gray-800 ml-2">
              {categorie?.duree_mois} mois
            </span>
          </div>
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(Endpoint() + "/api/category_contrat/", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        });
        const jsonData = await response.json();
        const options = jsonData.data.map((cat) => {
          return {
            label: cat.type_contrat,
            value: cat.id_cat_cont,
          };
        });
        setcategories(options);
        setcontarctValue(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [add1]);

  // Validation function to check if all required fields are filled for the room form
  const isRoomFormValid = () => {
    const { type_abonnement, tarif, id_cat_cont, namecat_conrat, duree_mois } =
      ClientData;
    if ((type_abonnement, tarif, id_cat_cont, namecat_conrat, duree_mois))
      return true;
    else false;
  };

  // Function to add a new chamber
  const addClient = async () => {
    if (isRoomFormValid()) {
      try {
        const response = await fetch(Endpoint() + "/api/abonnement/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
          body: JSON.stringify(ClientData),
        });
        if (response.ok) {
          const res = await response.json();
          if (res == "Added Successfully!!") {
            message.success("abonnement ajouté avec succès");
            setAdd(Math.random() * 1000);
            setClientData({
              type_abonnement: "",
              tarif: null,
              Niveau_age: null,
              Systeme: null,
              description: null,
              id_cat_cont: null,
              namecat_conrat: "",
              duree_mois: null,
            });

            const id_staff = JSON.parse(localStorage.getItem("data"));
            const res = await addNewTrace(
              22,
              "Ajout",
              getCurrentDate(),
              `${JSON.stringify(ClientData)}`,
              "abonnements"
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
    } else {
      message.warning("Tous les champs sont obligatoires");
    }
  };

  const addCtegeries = async () => {
    if (CategoireData.duree_mois > 12) {
      message.warning(
        "La durée doit être saisie comme étant de 12 mois ou moins"
      );
    }
    try {
      const response = await fetch(Endpoint() + "/api/category_contrat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
        },
        body: JSON.stringify(CategoireData),
      });
      if (response.ok) {
        const res = await response.json();
        if (res.msg == "Added Successfully!!") {
          message.success("Type d'abonnement ajouté avec succès");
          setAdd1(Math.random() * 1000);
          setCategoireData({});
          //   onCloseC();
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

  const showDrawerC = () => {
    setOpen2(true);
  };

  const onCloseC = () => {
    setOpen2(false);
    setCategoireData({
      nom_category: "",
    });
  };

  const onCloseR = () => {
    setOpen1(false);
    setClientData({
      id_etablissement: 19,
      id_category: null,
      capacity: null,
      image: "salles/avatar.jpg",
      nom_salle: "",
      etablissemnt: "FitHouse Complexe",
      category: "",
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
        const response = await fetch(Endpoint() + "/api/abonnement/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();

        // Ensure each row has a unique key
        const processedData = jsonData.data.map((item) => ({
          ...item,
          key: item.id_abn, // Use id_abn as the key
        }));

        setData(processedData);
        setFilteredData(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = [
          "type_abonnement",
          "tarif",
          "namecat_conrat",
          "duree_mois",
        ];

        const generatedColumns = desiredKeys.map((key) => ({
          title: getColumnTitle(key),
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "tarif") {
              return `${text} MAD`;
            } else if (key === "duree_mois") {
              return `${text} mois`;
            } else if (key === "actions") {
              return <Space size="middle"></Space>;
            }
            return text;
          },
        }));

        setColumns(generatedColumns);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Erreur lors de la récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, update, add]);

  // Helper function to get column titles
  const getColumnTitle = (key) => {
    const titles = {
      type_abonnement: "Offert d'abonnement",
      tarif: "Tarif",
      namecat_conrat: "Catégorie de contrat",
      duree_mois: "Durée",
      actions: "Actions",
    };
    return (
      titles[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(Endpoint() + "/api/category_contrat/", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        });
        const jsonData = await response.json();

        // Ensure each row has a unique key
        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_cat_cont || index, // Assuming each item has a unique id, otherwise use index
        }));

        setData1(processedData);
        setFilteredData1(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = ["type_contrat", "duree_mois"];
        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(key.replace(/\_/g, " ")), // Capitalize the first letter
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "description") {
              return <div>{text}</div>;
            } else if (key === "date_inscription") {
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
  }, [authToken, update1, add1]);

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.type_abonnement.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleSearch2 = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText1(value);
    const filtered = data1.filter((item) =>
      item.type_contrat.toLowerCase().startsWith(value)
    );
    setFilteredData1(filtered);
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

  const rowSelection2 = {
    selectedRowKeys1,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys1(selectedRowKeys);
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
      setChangedFields([]);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`${Endpoint()}api/abonnement/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...values,
          id_abn: editingClient.id_abn,
          namecat_conrat: editingClient.namecat_conrat,
          duree_mois: editingClient.duree_mois,
          id_cat_cont: editingClient.id_cat_cont,
        }),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        if (updatedClient == "Upadated Successfully!!") {
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            22,
            "Modification",
            getCurrentDate(),
            `${JSON.stringify(changedFields)}`,
            "abonnements"
          );
          console.log("====================================");
          console.log(res);
          console.log("====================================");
          setChangedFields([]);
          setIsFormChanged(false);

          const updatedData = data.map((client) =>
            client.key === editingClient.key ? updatedClient : client
          );
          setUpdate(updatedData);
          setData(updatedData);
          setFilteredData(updatedData);
          message.success("Abonnement mis à jour avec succès");
          setIsModalVisible(false);
          setEditingClient(null);
          setSelectedRowKeys([]);
          // Reset the form fields
          form.resetFields();
        } else {
          message.warning(updatedClient.msg);
        }
      } else {
        message.error("Erreur lors de la mise à jour du client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  // Handle edit button click
  const handleEditClick1 = () => {
    if (selectedRowKeys1.length === 1) {
      const clientToEdit = data1.find(
        (client) => client.key === selectedRowKeys1[0]
      );
      setEditingClient(clientToEdit);
      form1.setFieldsValue(clientToEdit);
      setIsModalVisible1(true);
    }
  };

  const handleModalSubmit1 = async () => {
    try {
      const values = await form1.validateFields();
      console.log(values);
      const response = await fetch(`${Endpoint()}api/category_contrat/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...values,
          id_categoryContrat: editingClient.id_cat_cont,
        }),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        if (updatedClient.msg == "updated Successfully!!") {
          const updatedData = data.map((client) =>
            client.key === editingClient.key ? updatedClient : client
          );
          setUpdate1(updatedData);
          setData1(updatedData);
          setFilteredData1(updatedData);
          message.success("Type D'abonnement mis à jour avec succès");
          setIsModalVisible1(false);
          setEditingClient(null);
          setSelectedRowKeys1([]);
          // Reset the form fields
          form1.resetFields();
        } else {
          message.warning(updatedClient.msg);
        }
      } else {
        message.error("Erreur lors de la mise à jour du Abonnement");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      message.error("An error occurred while updating the client");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingClient(null);
    setChangedFields([]);
    setIsFormChanged(false);
  };
  const handleModalCancel1 = () => {
    setIsModalVisible1(false);
    setEditingClient(null);
    setChangedFields([]);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const clientToDelete = data.find((client) => client.key === key);
          console.log(clientToDelete);
          const response = await fetch(
            `${Endpoint()}api/abonnement/${clientToDelete.id_abn}`,
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
          const res = await addNewTrace(
            22,
            "Supprimer",
            getCurrentDate(),
            `${JSON.stringify(ClientData)}`,
            "abonnements"
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
          `${selectedRowKeys.length} abonnement(s) supprimé(s) avec succès`
        );
      } catch (error) {
        console.error("Error deleting clients:", error);
        message.error("An error occurred while deleting abonnements");
      }
    }
  };

  const confirm = (e) => {
    handleDelete();
  };

  const handleDelete1 = async () => {
    if (selectedRowKeys1.length >= 1) {
      try {
        const promises = selectedRowKeys1.map(async (key) => {
          const clientToDelete = data1.find((client) => client.key === key);
          console.log(clientToDelete);
          const response = await fetch(
            `${Endpoint()}api/category_contrat/${clientToDelete.id_cat_cont}`,
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
            throw new Error(`Failed to delete categorie with key ${key}`);
          }
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            22,
            "Suppression",
            getCurrentDate(),
            `${JSON.stringify(ClientData)}`,
            "abonnements"
          );
        });

        await Promise.all(promises);

        const updatedData = data1.filter(
          (client) => !selectedRowKeys1.includes(client.key)
        );
        setData1(updatedData);
        setFilteredData1(updatedData);
        setSelectedRowKeys1([]);
        message.success(
          `${selectedRowKeys1.length} Type d'bonnement(s) supprimé(s) avec succès`
        );
      } catch (error) {
        console.error("Error deleting clients:", error);
        message.error("An error occurred while deleting clients");
      }
    }
  };

  const confirm1 = (e) => {
    handleDelete1();
  };

  const cancel = (e) => {
    console.log(e);
  };

  const handleFormChange = (changedValues, allValues) => {
    const formatFieldName = (name) => {
      return name.replace("_", " ");
    };

    setChangedFields((prevFields) => {
      const updatedFields = [...prevFields];
      Object.keys(changedValues).forEach((key) => {
        const newField = {
          name: formatFieldName(key),
          oldValue: editingClient[key], // Use editingClient instead of selectedRecord
          newValue: changedValues[key],
        };
        const existingIndex = updatedFields.findIndex(
          (field) => field.name === newField.name
        );
        if (existingIndex !== -1) {
          // Update existing field
          updatedFields[existingIndex] = newField;
        } else {
          // Add new field
          updatedFields.push(newField);
        }
      });
      return updatedFields;
    });

    setIsFormChanged(true);
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
        <AbonnementDetailsModal
          visible={showAbonnementModal}
          onClose={() => {
            setShowAbonnementModal(false);
            setSelectedAbonnement(null);
          }}
          abonnement={selectedAbonnement}
        />

        <CategorieDetailsModal
          visible={showCategorieModal}
          onClose={() => {
            setShowCategorieModal(false);
            setSelectedCategorie(null);
          }}
          categorie={selectedCategorie}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-7">
            <div className="w-52">
              <Input
                prefix={<SearchOutlined />}
                placeholder="recherche abonnements"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-6">
              {!JSON.parse(localStorage.getItem(`data`))[0].id_coach &&
              selectedRowKeys.length === 1 ? (
                <EditOutlined
                  className="cursor-pointer"
                  onClick={handleEditClick}
                />
              ) : (
                ""
              )}
              {!JSON.parse(localStorage.getItem(`data`))[0].id_coach &&
              selectedRowKeys.length >= 1 ? (
                <Popconfirm
                  title="Supprimer l'abonnement"
                  description="Êtes-vous sûr de supprimer cet abonnement"
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
              {!JSON.parse(localStorage.getItem(`data`))[0].id_coach &&
              selectedRowKeys.length === 1 ? (
                <div className="flex items-center space-x-4">
                  <EyeOutlined
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedAbonnement(
                        data.find((item) => item.key === selectedRowKeys[0])
                      );
                      setShowAbonnementModal(true);
                    }}
                  />
                  {/* ... */}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          {/* add new client  */}
          <div>
            <div className="flex items-center space-x-3">
              {!JSON.parse(localStorage.getItem(`data`))[0].id_coach && (
                <Button
                  type="default"
                  onClick={showDrawerR}
                  icon={<UserAddOutlined />}
                >
                  Ajout abonnement
                </Button>
              )}
              {!JSON.parse(localStorage.getItem(`data`))[0].id_coach && (
                <Button
                  type="default"
                  onClick={showDrawerC}
                  icon={<BorderOuterOutlined />}
                >
                  Type d'abonnement
                </Button>
              )}
            </div>
            <Drawer
              title="Saisir un nouveau abonnement"
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
                        <div>*Type de l’offre </div>
                        <Input
                          value={ClientData.type_abonnement}
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              type_abonnement: value.target.value,
                            })
                          }
                          placeholder="offre "
                        ></Input>
                      </div>
                      <div>
                        <div>*Niveau age</div>
                        <Input
                          value={ClientData.Niveau_age}
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              Niveau_age: value.target.value,
                            })
                          }
                          placeholder="Niveau age "
                        ></Input>
                      </div>

                      <div>
                        <label htmlFor="Année" className="block font-medium">
                          *Categorie contrat
                        </label>
                        <Select
                          id="categorie"
                          showSearch
                          placeholder="categorie"
                          value={ClientData.namecat_conrat}
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value, option) => {
                            const data = contarctValue.filter(
                              (val) => val.id_cat_cont == value
                            );
                            ClientData.duree_mois = data[0].duree_mois;
                            setClientData({
                              ...ClientData,
                              id_cat_cont: value,
                              namecat_conrat: option.label,
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
                          options={categories}
                        />
                      </div>
                      <div>
                        <div>*Système académique</div>
                        <Input
                          value={ClientData.Systeme}
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              Systeme: value.target.value,
                            })
                          }
                          placeholder="Système académique"
                        ></Input>
                      </div>
                      <div>
                        <div>Description</div>
                        <Input
                          value={ClientData.description}
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              description: value.target.value,
                            })
                          }
                          placeholder="Description "
                        ></Input>
                      </div>
                      <div>
                        <div>*Tarif</div>
                        <Input
                          value={ClientData.tarif}
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              tarif: value.target.value,
                            })
                          }
                          placeholder="Tarif en DH"
                        ></Input>
                      </div>
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
            <Drawer
              title="Saisir un nouveau type d'abonnement"
              width={720}
              onClose={onCloseC}
              closeIcon={false}
              open={open2}
              bodyStyle={{
                paddingBottom: 80,
              }}
            >
              <div>
                <div className="p-3 md:pt-0 md:pl-0 md:pr-10">
                  <div className="">
                    <div className="flex items-center space-x-5">
                      <div>
                        <Input
                          value={CategoireData.type_contrat}
                          onChange={(value) =>
                            setCategoireData({
                              ...CategoireData,
                              type_contrat: value.target.value,
                            })
                          }
                          placeholder="Type abonnement "
                        ></Input>
                      </div>
                      <div>
                        {/* <Input
                        value={CategoireData.duree_mois}
                        type="number"
                        count={{
                          show: true,
                          max: 10,
                        }}
                        placeholder="Duree mois"
                        onChange={(value) =>
                          setCategoireData({
                            ...CategoireData,
                            duree_mois: value.target.value,
                          })
                        }
                      /> */}
                        <Input
                          value={CategoireData.duree_mois}
                          type="number"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value <= 12) {
                              setCategoireData({
                                ...CategoireData,
                                duree_mois: value,
                              });
                            } else {
                              message.warning(
                                "La durée ne peut pas dépasser 12 mois"
                              );
                            }
                          }}
                          placeholder="Durée mois"
                        />
                      </div>
                      <Tooltip title="Ajoute un nouveau abonnement">
                        <Button
                          icon={<PlusOutlined />}
                          className="cursor-pointer"
                          onClick={addCtegeries}
                        >
                          Ajoute
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="mt-5">
                  <div className="flex items-center space-x-6">
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="recherche type"
                      className="w-48"
                      value={searchText1}
                      onChange={handleSearch2}
                    />
                    {selectedRowKeys1.length === 1 ? (
                      <EditOutlined
                        className="cursor-pointer"
                        onClick={handleEditClick1}
                      />
                    ) : (
                      ""
                    )}
                    {selectedRowKeys1.length >= 1 ? (
                      <Popconfirm
                        title="Supprimer le type d'abonnement"
                        description="Êtes-vous sûr de supprimer ce type d'abonnement"
                        onConfirm={confirm1}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined className="cursor-pointer" />{" "}
                      </Popconfirm>
                    ) : (
                      ""
                    )}
                    {selectedRowKeys1.length === 1 ? (
                      <div className="flex items-center space-x-4">
                        <EyeOutlined
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedCategorie(
                              data1.find(
                                (item) => item.key === selectedRowKeys1[0]
                              )
                            );
                            setShowCategorieModal(true);
                          }}
                        />
                        {/* ... */}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <Table
                    loading={loading}
                    pagination={{
                      pageSize: 5,
                      showQuickJumper: true,
                    }}
                    size="small"
                    className="w-full mt-5"
                    columns={columns1}
                    dataSource={filteredData1}
                    rowSelection={rowSelection2}
                  />
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
          className="w-full mt-5"
          columns={columns}
          dataSource={filteredData}
          rowSelection={rowSelection}
        />
        <Modal
          title="Modifier Abonnement"
          visible={isModalVisible}
          onOk={handleModalSubmit}
          onCancel={handleModalCancel}
          okButtonProps={{ disabled: !isFormChanged }}
          okText="Enregistrer"
          cancelText="Annuler"
        >
          <div className="h-96 overflow-y-auto">
            <Form
              form={form}
              onValuesChange={handleFormChange}
              layout="vertical"
            >
              <Form.Item name="type_abonnement" label="offre">
                <Input
                  rules={[{ required: true, message: "type_abonnement" }]}
                />
              </Form.Item>
              <Form.Item name="Niveau_age" label="Niveau_age">
                <Input rules={[{ required: true, message: "Niveau_age" }]} />
              </Form.Item>
              <Form.Item name="Systeme" label="Systeme">
                <Input rules={[{ required: true, message: "Systeme" }]} />
              </Form.Item>
              <Form.Item
                name="namecat_conrat"
                label="Categorie"
                rules={[
                  {
                    required: true,
                    message: "Categorie selection is required",
                  },
                ]}
              >
                <Select
                  id="categorie"
                  showSearch
                  placeholder="categorie"
                  className="w-full"
                  optionFilterProp="children"
                  onChange={(value, option) => {
                    {
                      const data = contarctValue.filter(
                        (val) => val.id_cat_cont == value
                      );
                      editingClient.duree_mois = data[0].duree_mois;
                      setEditingClient({
                        ...editingClient,
                        id_cat_cont: value,
                        namecat_conrat: option.label,
                      });
                    }
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? "").startsWith(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={categories}
                />
              </Form.Item>
              <Form.Item name="description" label="description">
                <Input rules={[{ required: true, message: "description" }]} />
              </Form.Item>
              <Form.Item name="tarif" label="Tarif">
                <Input
                  type="number"
                  rules={[{ required: true, message: "tarif" }]}
                />
              </Form.Item>
              <Form.Item
                name="namecat_conrat"
                label="Categorie"
                rules={[
                  {
                    required: true,
                    message: "Categorie selection is required",
                  },
                ]}
              >
                <Select
                  id="categorie"
                  showSearch
                  placeholder="categorie"
                  className="w-full"
                  optionFilterProp="children"
                  onChange={(value, option) => {
                    {
                      const data = contarctValue.filter(
                        (val) => val.id_cat_cont == value
                      );
                      editingClient.duree_mois = data[0].duree_mois;
                      setEditingClient({
                        ...editingClient,
                        id_cat_cont: value,
                        namecat_conrat: option.label,
                      });
                    }
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? "").startsWith(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={categories}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>

        <Modal
          title="Modifier Catégorie"
          visible={isModalVisible1}
          onOk={handleModalSubmit1}
          onCancel={handleModalCancel1}
          footer={[
            <Button key="back" onClick={handleModalCancel1}>
              Annuler
            </Button>,
            <Button key="submit" type="primary" onClick={handleModalSubmit1}>
              Valider
            </Button>,
          ]}
        >
          <div className="h-96 overflow-y-auto mt-10">
            <Form form={form1} layout="vertical">
              <Form.Item name="type_contrat" label="Type de contrat">
                <Input
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer le type de contrat",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name="duree_mois" label="Durée en mois">
                <Input
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer la durée en mois",
                    },
                  ]}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default TableAbonnement;
