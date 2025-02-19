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
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { addNewTrace, getCurrentDate } from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const TableCours = ({ darkmode }) => {
  // Niveau mapping
  const niveauMapping = {
    CM2: 1,
    CM1: 5,
    CE2: 6,
    CE1: 9,
    "aide aux devoirs": 20,
    CP: 21,
    "6ème": 22,
    "5ème": 23,
    "4ème": 24,
    "3ème": 25,
    Seconde: 26,
    Première: 27,
    Terminale: 28,
    Kindgarten: 29,
    "1st grade": 30,
    "2nd grade": 31,
    "3rd grade": 32,
    "4th grade": 33,
    "5th grade": 34,
    "6th grade": 35,
    "7th grade": 36,
    "8th grade": 37,
    "9th grade": 38,
    "10th grade": 39,
    "11th grade": 40,
    "12th grade": 41,
  };

  const niveauOptions = Object.keys(niveauMapping).map((grade) => ({
    value: grade,
    label: grade,
  }));

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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const [ClientData, setClientData] = useState({
    nom_cour: "",
    description: "",
    Programme: "",
    niveau: "",
    id_niveau: null,
    image: "cours/avatar.jpg",
    code_couleur: "Color(0xff42a5f5)",
    is_published: "true",
  });

  useEffect(() => {
    // Update id_niveau whenever niveau changes
    if (ClientData.niveau) {
      setClientData((prev) => ({
        ...prev,
        id_niveau: niveauMapping[prev.niveau],
      }));
    }
  }, [ClientData.niveau]);

  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(Endpoint() + "api/cours/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const jsonData = await response.json();

        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_cour || index,
          nom_cours: item.nom_cour,
        }));

        setData(processedData);
        setFilteredData(processedData);

        const desiredKeys = ["nom_cours", "description", "niveau", ""];
        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(key.replace(/\_/g, " ")),
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "description") {
              return <div>{text}</div>;
            } else if (key === "date_inscription") {
              return <Tag>{text}</Tag>;
            } else if (key === "") {
              return (
                <EyeOutlined
                  onClick={() => handleViewDetails(record)}
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

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.nom_cour.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const addClient = async () => {
    try {
      if (!ClientData.niveau) {
        message.error("Please select a niveau");
        return;
      }

      const response = await fetch(Endpoint() + "api/cours/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(ClientData),
      });

      if (response.ok) {
        const res = await response.json();
        if (res.msg === "Added Successfully!!") {
          message.success("Cour ajoutée avec succès");
          setAdd(Math.random() * 1000);
          await addNewTrace(
            22,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(ClientData)}`,
            "cours"
          );
          onCloseR();
        } else {
          message.warning("Cour non ajoutée");
        }
      } else {
        message.error("Error adding course");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred");
    }
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    setClientData({
      nom_cour: "",
      description: "",
      Programme: "",
      niveau: "",
      id_niveau: null,
      image: "cours/avatar.jpg",
      code_couleur: "Color(0xff42a5f5)",
      is_published: "true",
    });
  };

  const handleRoomSubmit = () => {
    addClient();
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setIsViewModalVisible(true);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const handleEditClick = () => {
    if (selectedRowKeys.length === 1) {
      const clientToEdit = data.find(
        (client) => client.key === selectedRowKeys[0]
      );
      setEditingClient(clientToEdit);
      form.setFieldsValue(clientToEdit);
      setChangedFields([]);
      setIsModalVisible(true);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Update id_niveau based on selected niveau if it exists in the form values
      if (values.niveau) {
        values.id_niveau = niveauMapping[values.niveau];
      }

      const response = await fetch(`${Endpoint()}api/cours/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...values, id_cour: editingClient.id_cour }),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        const updatedData = data.map((client) =>
          client.key === editingClient.key ? updatedClient : client
        );
        setUpdate(updatedData);
        setData(updatedData);
        setFilteredData(updatedData);
        message.success("Cour mis à jour avec succès");

        setChangedFields([]);
        setIsFormChanged(false);
        setIsModalVisible(false);
        setEditingClient(null);
        setSelectedRowKeys([]);
        form.resetFields();
      } else {
        message.error("Erreur lors de la mise à jour du client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      message.error("An error occurred while updating the cours");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingClient(null);
    setChangedFields([]);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const clientToDelete = data.find((client) => client.key === key);
          const response = await fetch(
            `${Endpoint()}api/cours/${clientToDelete.id_cour}`,
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
          await addNewTrace(
            22,
            "Suppression",
            getCurrentDate(),
            `${JSON.stringify(clientToDelete)}`,
            "cours"
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
          `${selectedRowKeys.length} cours supprimé(s) avec succès`
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

  const handleFormChange = (changedValues, allValues) => {
    const formatFieldName = (name) => {
      return name.replace("_", " ");
    };

    setChangedFields((prevFields) => {
      const updatedFields = [...prevFields];
      Object.keys(changedValues).forEach((key) => {
        const newField = {
          name: formatFieldName(key),
          oldValue: editingClient[key],
          newValue: changedValues[key],
        };
        const existingIndex = updatedFields.findIndex(
          (field) => field.name === newField.name
        );
        if (existingIndex !== -1) {
          updatedFields[existingIndex] = newField;
        } else {
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
          colorBorder: darkmode ? "#fff" : "#d9d9d9",
        },
      }}
    >
      <div className="w-full p-2">
        <Modal
          title={`Détails de ${selectedCourse?.nom_cour}`}
          visible={isViewModalVisible}
          onCancel={() => {
            setIsViewModalVisible(false);
            setSelectedCourse(null);
          }}
          footer={null}
        >
          <Table
            columns={[
              {
                title: "Nom du Cours",
                dataIndex: "nom_cour",
                key: "nom_cour",
              },
              {
                title: "Description",
                dataIndex: "description",
                key: "description",
              },
              {
                title: "Programme",
                dataIndex: "Programme",
                key: "Programme",
              },
              {
                title: "Niveau",
                dataIndex: "niveau",
                key: "niveau",
              },
            ]}
            dataSource={selectedCourse ? [selectedCourse] : []}
            pagination={false}
            rowKey="id_cour"
          />
        </Modal>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-7">
            <div className="w-52">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search Cours"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-6">
              {selectedRowKeys.length === 1 && (
                <EditOutlined
                  className="cursor-pointer"
                  onClick={handleEditClick}
                />
              )}
              {(JSON.parse(localStorage.getItem(`data`))[0].fonction ===
                "Administration" ||
                JSON.parse(localStorage.getItem(`data`))[0].fonction ===
                  "secretaire") &&
              selectedRowKeys.length >= 1 ? (
                <Popconfirm
                  title="Supprimer le cours"
                  description="Êtes-vous sûr de supprimer ce cours"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="oui"
                  cancelText="Non"
                >
                  <DeleteOutlined className="cursor-pointer" />
                </Popconfirm>
              ) : null}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <Button
                type="default"
                onClick={showDrawerR}
                icon={<UserAddOutlined />}
              >
                Ajoute Cours
              </Button>
            </div>
            <Drawer
              title="Saisir un nouveau Cours"
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
                        <div>*Nom cours</div>
                        <Input
                          value={ClientData.nom_cour}
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              nom_cour: value.target.value,
                            })
                          }
                          placeholder="Nom cours"
                        />
                      </div>
                      <div>
                        <div>*Description</div>
                        <Input
                          value={ClientData.description}
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              description: value.target.value,
                            })
                          }
                          placeholder="Description"
                        />
                      </div>
                      <div>
                        <div>*Programme</div>
                        <Input
                          value={ClientData.Programme}
                          onChange={(value) =>
                            setClientData({
                              ...ClientData,
                              Programme: value.target.value,
                            })
                          }
                          placeholder="Programme"
                        />
                      </div>
                      <div>
                        <label htmlFor="Niveau" className="block font-medium">
                          *Niveau
                        </label>
                        <Select
                          id="Niveau"
                          showSearch
                          placeholder="Niveau"
                          value={ClientData.niveau}
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value) => {
                            setClientData({
                              ...ClientData,
                              niveau: value,
                              id_niveau: niveauMapping[value],
                            });
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={niveauOptions}
                        />
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
          title="Modifier Cours"
          visible={isModalVisible}
          onOk={handleModalSubmit}
          onCancel={handleModalCancel}
          okButtonProps={{ disabled: !isFormChanged }}
          okText="Enregistrer"
          cancelText="Annuler"
        >
          <div className="h-96 overflow-y-auto">
            <Form
              onValuesChange={handleFormChange}
              form={form}
              layout="vertical"
            >
              <Form.Item
                name="nom_cour"
                label="Nom cours"
                rules={[
                  { required: true, message: "Le nom du cours est requis" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "La description est requise" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="Programme"
                label="Programme"
                rules={[{ required: true, message: "Le programme est requis" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="niveau"
                label="Niveau"
                rules={[{ required: true, message: "Le niveau est requis" }]}
              >
                <Select
                  showSearch
                  placeholder="Sélectionner un niveau"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={niveauOptions}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default TableCours;
