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
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { addNewTrace, getCurrentDate } from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const TablePeriod = () => {
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
  const [attribut, Setattribut] = useState({
    years: "",
    month: "",
  });

  // State for room related data
  const [ClientData, setClientData] = useState({
    PeriodeSalaire: attribut.years + " " + attribut.month,
    password: "",
  });

  // Validation function to check if all required fields are filled for the room form
  const isRoomFormValid = () => {
    if (attribut.month == "" && attribut.years == "") {
      return false;
    }
    return true;
  };

  // Function to add a new chamber
  const addClient = async () => {
    try {
      // Check if the form is valid before submitting
      if (!isRoomFormValid()) {
        message.warning("Veuillez remplir tous les champs requis");
        return;
      }
      ClientData.PeriodeSalaire = attribut.years + " " + attribut.month;
      const response = await fetch(
        Endpoint()+"/api/periode/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ClientData),
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res.msg == "Added Successfully!!e") {
          message.success("Période ajoutée avec succès");
          setAdd(Math.random() * 1000);
          setClientData({
            PeriodeSalaire: "",
          });
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_admin,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(ClientData)}`,
            "Period"
          );

          onCloseR();
        } else {
          message.warning("Deja un Période créer avec cette attribut");
          console.log(res);
        }
      } else {
        console.log(response);
        message.error("Error adding periode");
      }
    } catch (error) {
      console.log(error);
      message.warning("An error occurred:", error);
    }
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    Setattribut({
      years: "",
      month: "",
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
          Endpoint()+"/api/periode/",
          {
            // headers: {
            //   "Authorization": `Bearer ${authToken}`, // Include the auth token in the headers
            // },
          }
        );
        const jsonData = await response.json();

        // Ensure each row has a unique key
        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_periode || index, // Assuming each item has a unique id, otherwise use index
        }));

        setData(processedData);
        setFilteredData(processedData);

        // Generate columns based on the desired keys
        const desiredKeys = ["PeriodeSalaire"];
        const generatedColumns = desiredKeys.map((key) => ({
          title:
            key === "PeriodeSalaire"
              ? "Période de Salaire"
              : capitalizeFirstLetter(key.replace(/\_/g, " ")), // Change the title to French
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === "sitewebetablissement") {
              return (
                <a href={text} target="_blank" rel="noopener noreferrer">
                  {text}
                </a>
              );
            } else if (key === "date_inscription") {
              return <Tag>{text}</Tag>;
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
      item.PeriodeSalaire.toLowerCase().includes(value)
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
        `${Endpoint()}/api/periode/`,
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
        message.success("Periode mis à jour avec succès");
        setIsModalVisible(false);
        setEditingClient(null);
        setSelectedRowKeys([]);
        // Reset the form fields
        form.resetFields();
      } else {
        message.error("Erreur lors de la mise à jour du Periode");
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
            `${Endpoint()}/api/periode/${clientToDelete.id_periode}`,
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
            throw new Error(`Failed to delete periode lient with key ${key}`);
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
          `${selectedRowKeys.length} periode(s) supprimé(s) avec succès`
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
    Setattribut({
      years: "",
      month: "",
    });
  };

  return (
    <div className="w-full p-2">
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-7">
          <div className="w-52">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Period"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <Popconfirm
            title="Supprimer la période"
            description="Êtes-vous sûr de supprimer cette période ?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined onClick={handleDelete} className="cursor-pointer" />{" "}
          </Popconfirm>
          <div className="flex items-center space-x-6"></div>
        </div>
        <div>
          <div className="flex items-center space-x-3">
            {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" &&
              (true  ? (
                <Button
                  type="default"
                  onClick={showDrawerR}
                  icon={<UserAddOutlined />}
                >
                  Ajoute Priod
                </Button>
              ) : (
                ""
              ))}
          </div>

          <Drawer
            title="Saisir une période"
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
                      <div>
                        <label htmlFor="Année" className="block font-medium">
                          *Année
                        </label>
                        <Select
                          id="ville"
                          value={attribut.years}
                          showSearch
                          placeholder="Année"
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value) =>
                            Setattribut({ ...attribut, years: value })
                          }
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
                            {
                              value: "2024",
                              label: "2024",
                            },
                            {
                              value: "2025",
                              label: "2025",
                            },
                            {
                              value: "2026",
                              label: "2026",
                            },
                            {
                              value: "2027",
                              label: "2027",
                            },
                          ]}
                        />
                      </div>
                      <div>
                        <label htmlFor="Mois" className="block font-medium">
                          {" "}
                          * Mois{" "}
                        </label>
                        <Select
                          value={attribut.month}
                          id="mois"
                          showSearch
                          placeholder="Mois"
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value) =>
                            Setattribut({ ...attribut, month: value })
                          }
                          filterOption={(input, option) =>
                            (option?.label ?? "").startsWith(input)
                          }
                          options={[
                            { value: "Janvier", label: "Janvier" },
                            { value: "Février", label: "Février" },
                            { value: "Mars", label: "Mars" },
                            { value: "Avril", label: "Avril" },
                            { value: "Mai", label: "Mai" },
                            { value: "Juin", label: "Juin" },
                            { value: "Juillet", label: "Juillet" },
                            { value: "Août", label: "Août" },
                            { value: "Septembre", label: "Septembre" },
                            { value: "Octobre", label: "Octobre" },
                            { value: "Novembre", label: "Novembre" },
                            { value: "Décembre", label: "Décembre" },
                          ]}
                        />
                      </div>
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
    </div>
  );
};

export default TablePeriod;
