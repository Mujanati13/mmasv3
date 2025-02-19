import React, { useState, useEffect } from "react";
import {
  Table,
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
import { addNewTrace, getCurrentDate } from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const TableAffiliation = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAffiliation, setEditingAffiliation] = useState(null);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailAffiliation, setDetailAffiliation] = useState(null);
  const authToken = localStorage.getItem("jwtToken");

  const [affiliationData, setAffiliationData] = useState({
    id_etudiant: "",
    id_parent: "",
  });

  useEffect(() => {
    fetchData();
    fetchStudents();
    fetchParents();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(Endpoint() + "/api/affiliation/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const jsonData = await response.json();
      const processedData = jsonData.data.map((item) => ({
        ...item,
        key: item.id_affiliation,
        etudiant: item.etudiant ? item.etudiant.replace('/', ' ') : '',
        parent: item.parent ? item.parent.replace('/', ' ') : ''  
        
      }));
      setData(processedData);
      setFilteredData(processedData);
    } catch (error) {
      console.error("Error fetching affiliations:", error);
      message.error("Failed to fetch affiliations");
    }
    setLoading(false);
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(Endpoint() + "/api/etudiants/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const jsonData = await response.json();
      setStudents(jsonData.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error("Failed to fetch students");
    }
  };

  const fetchParents = async () => {
    try {
      const response = await fetch(Endpoint() + "/api/Parentt/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const jsonData = await response.json();
      setParents(jsonData.data);
    } catch (error) {
      console.error("Error fetching parents:", error);
      message.error("Failed to fetch parents");
    }
  };

  const columns = [
    {
      title: "Etudiant",
      dataIndex: "etudiant",
      key: "etudiant",
    },
    {
      title: "Parent",
      dataIndex: "parent",
      key: "parent",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleDetailView(record)}
          />
        </Space>
      ),
    },
  ];

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter(
      (item) =>
        item.etudiant.toLowerCase().includes(value) ||
        item.parent.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleEditClick = (record) => {
    setEditingAffiliation(record);
    form.setFieldsValue({
      id_etudiant: record.id_etudiant,
      id_parent: record.id_parent,
    });
    setIsModalVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.id_affiliation = editingAffiliation.id_affiliation;
      const response = await fetch(`${Endpoint()}/api/affiliation/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Affiliation mise à jour avec succès");
        setIsModalVisible(false);
        fetchData();
      } else {
        message.error("Error updating affiliation");
      }
    } catch (error) {
      console.error("Error updating affiliation:", error);
      message.error("An error occurred while updating the affiliation");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingAffiliation(null);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${Endpoint()}/api/affiliation/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        message.success("Affiliation supprimée avec succès");
        fetchData();
      } else {
        message.error("Error deleting affiliation");
      }
    } catch (error) {
      console.error("Error deleting affiliation:", error);
      message.error("An error occurred while deleting the affiliation");
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setAffiliationData({
      id_etudiant: "",
      id_parent: "",
    });
  };

  const handleAffiliationSubmit = async () => {
    try {
      const response = await fetch(Endpoint() + "/api/affiliation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(affiliationData),
      });

      if (response.ok) {
        message.success("Affiliation ajoutée avec succès");
        const id_staff = JSON.parse(localStorage.getItem("data"));
        const res = await addNewTrace(
          id_staff[0].id_admin,
          "ajoute",
          getCurrentDate(),
          `${JSON.stringify(affiliationData)}`,
          "Affiliation"
        );
        onClose();
        fetchData();
      } else {
        message.error("Error adding affiliation");
      }
    } catch (error) {
      console.error("Error adding affiliation:", error);
      message.error("An error occurred while adding the affiliation");
    }
  };

  const handleDetailView = (record) => {
    setDetailAffiliation(record);
    setDetailModalVisible(true);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleBulkDelete = async () => {
    try {
      for (const key of selectedRowKeys) {
        await fetch(`${Endpoint()}/api/affiliation/${key}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            id_affiliation: key,
          }),
        });
      }
      message.success("Selected affiliations deleted successfully");
      fetchData();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error deleting affiliations:", error);
      message.error("An error occurred while deleting the affiliations");
    }
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
        <div className="flex items-center justify-between mt-3 w-full">
          <div className="w-96 flex items-center space-x-5">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Rechercher une affiliation"
              value={searchText}
              onChange={handleSearch}
            />
            {selectedRowKeys.length > 0 && (
              <>
                <Popconfirm
                  title="Supprimer les affiliations sélectionnées ?"
                  onConfirm={handleBulkDelete}
                  okText="Oui"
                  cancelText="Non"
                >
                  {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                    "Administration" &&
                    (true ? (
                      <Button icon={<DeleteOutlined />} danger>
                        ({selectedRowKeys.length})
                      </Button>
                    ) : (
                      ""
                    ))}
                </Popconfirm>

                {selectedRowKeys.length === 1 && (
                  <>
                    {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                      "Administration" &&
                      (true ? (
                        <Button
                          icon={<EditOutlined />}
                          onClick={() =>
                            handleEditClick(
                              data.find(
                                (item) =>
                                  item.id_affiliation === selectedRowKeys[0]
                              )
                            )
                          }
                        ></Button>
                      ) : (
                        ""
                      ))}
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" &&
              (true ? (
                <Button onClick={showDrawer} icon={<UserAddOutlined />}>
                  Ajouter une affiliation
                </Button>
              ) : (
                ""
              ))}
          </div>
        </div>
        <Table
          rowSelection={rowSelection}
          loading={loading}
          pagination={{
            pageSize: 6,
            showQuickJumper: true,
          }}
          size="small"
          className="w-full mt-5"
          columns={columns}
          dataSource={filteredData}
        />
        <Modal
          title="Modifier l'affiliation"
          visible={isModalVisible}
          onOk={handleModalSubmit}
          onCancel={handleModalCancel}
          okText="Confirmer"
          cancelText="Annuler"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="id_etudiant"
              label="Étudiant"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner un étudiant",
                },
              ]}
            >
              <Select>
                {students.map((student) => (
                  <Select.Option
                    key={student.id_etudiant}
                    value={student.id_etudiant}
                  >
                    {student.nom} {student.prenom}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="id_parent"
              label="Parent"
              rules={[
                { required: true, message: "Veuillez sélectionner un parent" },
              ]}
            >
              <Select>
                {parents.map((parent) => (
                  <Select.Option
                    key={parent.id_parent}
                    value={parent.id_parent}
                  >
                    {parent.nom} {parent.prenom}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Drawer
          title="Ajouter une nouvelle affiliation"
          width={720}
          onClose={onClose}
          open={open}
          bodyStyle={{
            paddingBottom: 80,
          }}
        >
          <Form layout="vertical">
            <Form.Item
              name="id_etudiant"
              label="Étudiant"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner un étudiant",
                },
              ]}
            >
              <Select
                value={affiliationData.id_etudiant}
                onChange={(value) =>
                  setAffiliationData({ ...affiliationData, id_etudiant: value })
                }
              >
                {students.map((student) => (
                  <Select.Option
                    key={student.id_etudiant}
                    value={student.id_etudiant}
                  >
                    {student.nom} {student.prenom}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="id_parent"
              label="Parent"
              rules={[
                { required: true, message: "Veuillez sélectionner un parent" },
              ]}
            >
              <Select
                value={affiliationData.id_parent}
                onChange={(value) =>
                  setAffiliationData({ ...affiliationData, id_parent: value })
                }
              >
                {parents.map((parent) => (
                  <Select.Option
                    key={parent.id_parent}
                    value={parent.id_parent}
                  >
                    {parent.nom} {parent.prenom}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <Space>
            <Button onClick={onClose}>Annuler</Button>
            <Button onClick={handleAffiliationSubmit} type="primary">
              Enregistrer
            </Button>
          </Space>
        </Drawer>
        <Modal
          title="Détails de l'affiliation"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
        >
          {detailAffiliation && (
            <div>
              <p>
                <strong>ID Affiliation:</strong>{" "}
                {detailAffiliation.id_affiliation}
              </p>
              <p>
                <strong>Étudiant:</strong> {detailAffiliation.etudiant}
              </p>
              <p>
                <strong>Parent:</strong> {detailAffiliation.parent}
              </p>
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default TableAffiliation;
