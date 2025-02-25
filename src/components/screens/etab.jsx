import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Select,
  Modal,
  Form,
  Input,
  Button,
  ConfigProvider,
  Card,
  Row,
  Col,
  Typography,
  Tooltip,
  Switch,
  Empty,
  Spin,
  Avatar,
  Badge,
  Divider,
  Tabs,
  Tag,
  Statistic,
  List,
  message
} from "antd";
import { 
  EyeOutlined, 
  EditOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  GlobalOutlined, 
  EnvironmentOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  UserOutlined,
  FacebookOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  BankOutlined,
  ClockCircleOutlined,
  StarOutlined
} from "@ant-design/icons";
import {
  addNewTrace,
  addNewTraceDetail,
  getCurrentDate,
} from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const TableEtablissement = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [add, setAdd] = useState();
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const authToken = localStorage.getItem("jwtToken");
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [villes, setVilles] = useState([]);
  const [displayMode, setDisplayMode] = useState("table"); // "table" or "profile"
  const userData = JSON.parse(localStorage.getItem("data") || "[]");
  const isCoach = userData.length > 0 && userData[0].id_coach;
  const [activeEtab, setActiveEtab] = useState(null);

  useEffect(() => {
    fetchData();
  }, [authToken, add]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(Endpoint() + "/api/etablissements", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const jsonData = await response.json();
      setData(jsonData.data);
      
      if (jsonData.data.length > 0 && !activeEtab) {
        setActiveEtab(jsonData.data[0]);
      }

      // Fetch villes data
      const villesResponse = await fetch(Endpoint() + "/api/villes/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const villesData = await villesResponse.json();
      setVilles(villesData.data);

      // Generate columns for table view
      const desiredKeys = [
        "nom_etablissement",
        "adresse_etablissement",
        "teletablissement",
        "mailetablissement",
        "sitewebetablissement",
        "nb_clients",
        "",
      ];
      const generatedColumns = desiredKeys.map((key) => ({
        title: capitalizeFirstLetter(key.replace(/\_/g, " ")), // Capitalize the first letter
        dataIndex: key,
        key,
        render: (text, record) => {
          if (key === "") {
            return (
              <Space size="middle">
                {/* <Tooltip title="Voir détails">
                  <EyeOutlined
                    style={{ cursor: "pointer", fontSize: "18px" }}
                    onClick={() => handleViewDetails(record)}
                  />
                </Tooltip> */}
                {!isCoach && (
                  <Tooltip title="Modifier">
                    <EditOutlined
                      style={{ cursor: "pointer", fontSize: "18px" }}
                      onClick={() => handleEditFromTable(record)}
                    />
                  </Tooltip>
                )}
              </Space>
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
      message.error("Erreur lors du chargement des données");
    }
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleModalCancel = () => {
    setVisibleModal(false);
    setSelectedRecord(null);
    setChangedFields([]);
    setIsFormChanged(false);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setVisibleModal(true);
    setEditMode(false);
  };

  const handleEditFromTable = (record) => {
    setSelectedRecord(record);
    setVisibleModal(true);
    setEditMode(true);
    form.setFieldsValue(record);
    setChangedFields([]);
    setIsFormChanged(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    form.setFieldsValue(selectedRecord);
    setChangedFields([]);
    setIsFormChanged(false);
  };

  const handleProfileEdit = () => {
    setSelectedRecord(activeEtab);
    setVisibleModal(true);
    setEditMode(true);
    form.setFieldsValue(activeEtab);
    setChangedFields([]);
    setIsFormChanged(false);
  };

  const handleFormSubmit = async (values) => {
    try {
      const response = await fetch(
        `${Endpoint()}/api/etablissements/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            ...values,
            id_etablissement: selectedRecord.id_etablissement,
            changedFields: changedFields,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }
      
      const updatedRecord = await response.json();
      
      // Update data state
      setData((prevData) =>
        prevData.map((item) =>
          item.id_etablissement === updatedRecord.id_etablissement
            ? updatedRecord
            : item
        )
      );
      
      // Update activeEtab if needed
      if (activeEtab && activeEtab.id_etablissement === updatedRecord.id_etablissement) {
        setActiveEtab(updatedRecord);
      }
      
      setVisibleModal(false);
      setSelectedRecord(null);
      
      const id_staff = JSON.parse(localStorage.getItem("data"));
      await addNewTrace(
        id_staff[0].id_employe,
        "Modification",
        getCurrentDate(),
        `${JSON.stringify(changedFields)}`,
        "établissement"
      );
      
      setChangedFields([]);
      setIsFormChanged(false);
      setAdd(Math.random() * 10000);
      message.success("Établissement mis à jour avec succès");
    } catch (error) {
      console.error("Error updating data:", error);
      message.error("Erreur lors de la mise à jour de l'établissement");
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    const formatFieldName = (name) => {
      return name.replace("_", " ");
    };

    const changedFieldsArray = Object.keys(changedValues).map((key) => ({
      name: formatFieldName(key),
      oldValue: selectedRecord[key],
      newValue: changedValues[key],
    }));

    setChangedFields((prevFields) => {
      const updatedFields = [...prevFields];
      changedFieldsArray.forEach((newField) => {
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

  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === "table" ? "profile" : "table");
  };

  const handleEtabSelection = (etab) => {
    setActiveEtab(etab);
  };

  // Get ville name by id
  const getVilleName = (villeId) => {
    if (!villeId || !villes.length) return "Non spécifiée";
    const ville = villes.find(v => v.id.toString() === villeId.toString());
    return ville ? ville.nom_ville : "Non spécifiée";
  };

  // Format social media URL for display
  const formatSocialUrl = (url) => {
    if (!url) return "Non spécifié";
    return url.replace(/https?:\/\/(www\.)?/i, '').split('/')[0];
  };

  // Profile Mode Layout
  const renderProfileView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      );
    }

    if (data.length === 0) {
      return <Empty description="Aucun établissement trouvé" />;
    }

    return (
      <Row gutter={[24, 24]} className="mt-4">
        {/* Left Sidebar - List of Establishments */}
        <Col xs={24} sm={24} md={6} lg={5} xl={4}>
          <Card 
            className="shadow-md" 
            title={<Title level={5}>Établissements</Title>}
            bodyStyle={{ padding: "0px", maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={data}
              className=""
              renderItem={(item) => (
                <List.Item 
                  className={` cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-3 ${activeEtab && activeEtab.id_etablissement === item.id_etablissement ? (darkmode ? 'bg-gray-800' : 'bg-blue-50') : ''}`}
                  onClick={() => handleEtabSelection(item)}
                >
                  <List.Item.Meta
                    // avatar={
                    //   <Avatar 
                    //     src={item.image ? `${Endpoint()}media/${item.image}` : null}
                    //     icon={!item.image && <BankOutlined />}
                    //     size="large"
                    //   />
                    // }
                    className="pl-1 pr-1"
                    title={<Text className="">{item.nom_etablissement}</Text>}
                    description={
                      <Text className="mt-2" type="secondary">
                        <EnvironmentOutlined className="mr-1" />
                        {getVilleName(item.ville)}
                      </Text>
                    }
                  />
                  {/* <Badge 
                    count={item.nb_clients} 
                    overflowCount={999} 
                    style={{ backgroundColor: darkmode ? "#00b96b" : "#1677ff" }}
                  /> */}
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Main Content - Establishment Details */}
        <Col xs={24} sm={24} md={18} lg={19} xl={20}>
          {activeEtab ? (
            <Row gutter={[24, 24]}>
              {/* Header Card with Cover Image and Basic Info */}
              <Col span={24}>
                <Card className="shadow-md">
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={8}>
                      <div className="h-48 md:h-full w-full rounded-lg overflow-hidden relative flex items-center justify-center bg-gray-100 dark:bg-gray-800 shadow-inner">
                        {activeEtab.image ? (
                          <img
                            alt={activeEtab.nom_etablissement}
                            src={`${Endpoint()}media/${activeEtab.image}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/400x300?text=Pas+d'image";
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <BankOutlined style={{ fontSize: '48px', opacity: 0.5 }} />
                            <Text type="secondary" className="mt-2">Aucune image disponible</Text>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col xs={24} md={16}>
                      <div className="flex justify-between items-start mb-4">
                        <Title level={4} className="mb-0">{activeEtab.nom_etablissement}</Title>
                        {!isCoach && (
                          <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            onClick={handleProfileEdit}
                          >
                            Modifier
                          </Button>
                        )}
                      </div>
                      
                      <Row gutter={[24, 12]}>
                        <Col xs={24} sm={12}>
                          <Paragraph className="mb-2 flex items-center">
                            <EnvironmentOutlined className="mr-2 text-blue-500" style={{ fontSize: '18px' }} />
                            <span>
                              <Text strong>Adresse:</Text><br />
                              {activeEtab.adresse_etablissement}<br />
                              {getVilleName(activeEtab.ville)}
                            </span>
                          </Paragraph>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Paragraph className="mb-2 flex items-center">
                            <PhoneOutlined className="mr-2 text-green-500" style={{ fontSize: '18px' }} />
                            <span>
                              <Text strong>Téléphone:</Text><br />
                              {activeEtab.teletablissement || "Non spécifié"}
                            </span>
                          </Paragraph>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Paragraph className="mb-2 flex items-center">
                            <MailOutlined className="mr-2 text-red-500" style={{ fontSize: '18px' }} />
                            <span>
                              <Text strong>Email:</Text><br />
                              {activeEtab.mailetablissement || "Non spécifié"}
                            </span>
                          </Paragraph>
                        </Col>
                        
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Detailed Information */}
              <Col span={24}>
                <Card className="shadow-md">
                  <Tabs defaultActiveKey="details">
                    <TabPane
                      tab={
                        <span>
                          <InfoCircleOutlined />
                          Détails
                        </span>
                      }
                      key="details"
                    >
                      <Row gutter={[24, 24]}>
                        <Col xs={24}>
                          <div className="mb-4">
                            <Title level={4}>Description</Title>
                            <Paragraph>
                              {activeEtab.description || "Aucune description disponible pour cet établissement."}
                            </Paragraph>
                          </div>
                          <Divider />
                        </Col>
                        
                        {/* Site Web */}
                        <Col xs={24} md={12} lg={8}>
                          <Card 
                            size="small"
                            className="h-full"
                            title={
                              <div className="flex items-center">
                                <GlobalOutlined className="mr-2 text-blue-500" />
                                <Text strong>Site Web</Text>
                              </div>
                            }
                          >
                            {activeEtab.sitewebetablissement ? (
                              <a 
                                href={activeEtab.sitewebetablissement}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline flex items-center"
                              >
                                <LinkOutlined className="mr-2" />
                                {formatSocialUrl(activeEtab.sitewebetablissement)}
                              </a>
                            ) : (
                              <Text type="secondary">Non spécifié</Text>
                            )}
                          </Card>
                        </Col>
                        
                        {/* Facebook */}
                        <Col xs={24} md={12} lg={8}>
                          <Card 
                            size="small"
                            className="h-full"
                            title={
                              <div className="flex items-center">
                                <FacebookOutlined className="mr-2 text-blue-600" />
                                <Text strong>Facebook</Text>
                              </div>
                            }
                          >
                            {activeEtab.facebook ? (
                              <a 
                                href={activeEtab.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center"
                              >
                                <LinkOutlined className="mr-2" />
                                {formatSocialUrl(activeEtab.facebook)}
                              </a>
                            ) : (
                              <Text type="secondary">Non spécifié</Text>
                            )}
                          </Card>
                        </Col>
                        
                        {/* Instagram */}
                        <Col xs={24} md={12} lg={8}>
                          <Card 
                            size="small"
                            className="h-full"
                            title={
                              <div className="flex items-center">
                                <InstagramOutlined className="mr-2 text-pink-600" />
                                <Text strong>Instagram</Text>
                              </div>
                            }
                          >
                            {activeEtab.instagrame ? (
                              <a 
                                href={activeEtab.instagrame}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:underline flex items-center"
                              >
                                <LinkOutlined className="mr-2" />
                                {formatSocialUrl(activeEtab.instagrame)}
                              </a>
                            ) : (
                              <Text type="secondary">Non spécifié</Text>
                            )}
                          </Card>
                        </Col>
                        
                        {/* WhatsApp */}
                        <Col xs={24} md={12} lg={8}>
                          <Card 
                            size="small"
                            className="h-full"
                            title={
                              <div className="flex items-center">
                                <WhatsAppOutlined className="mr-2 text-green-500" />
                                <Text strong>WhatsApp</Text>
                              </div>
                            }
                          >
                            {activeEtab.watsapp ? (
                              <Text>
                                {activeEtab.watsapp}
                              </Text>
                            ) : (
                              <Text type="secondary">Non spécifié</Text>
                            )}
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    
                    {/* <TabPane
                      tab={
                        <span>
                          <TeamOutlined />
                          Clients
                        </span>
                      }
                      key="clients"
                    >
                      <Row gutter={[24, 24]} className="mb-6">
                        <Col xs={24} sm={12} md={8} lg={6}>
                          <Card>
                            <Statistic 
                              title="Total Clients" 
                              value={activeEtab.nb_clients} 
                              prefix={<TeamOutlined />} 
                              valueStyle={{ color: darkmode ? "#00b96b" : "#1677ff" }}
                            />
                          </Card>
                        </Col>
                      </Row>
                      
                      <Text type="secondary">
                        Cette section pourrait afficher des statistiques détaillées sur les clients ou 
                        une liste des clients associés à cet établissement.
                      </Text>
                    </TabPane> */}
                  </Tabs>
                </Card>
              </Col>
            </Row>
          ) : (
            <Empty description="Sélectionnez un établissement pour voir les détails" />
          )}
        </Col>
      </Row>
    );
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
      <div className="mb-4 flex justify-between items-center mt-5">
        <Space>
          <Text>Mode d'affichage:</Text>
          <Switch
            checked={displayMode === "profile"}
            onChange={toggleDisplayMode}
            checkedChildren={<AppstoreOutlined />}
            unCheckedChildren={<UnorderedListOutlined />}
          />
        </Space>
      </div>

      {/* Modal for Details and Edit */}
      <Modal
        visible={visibleModal}
        onCancel={handleModalCancel}
        footer={null}
        title={selectedRecord?.nom_etablissement}
        width={700}
      >
        {selectedRecord && !editMode && (
          <div className="notification-detail border rounded-lg shadow-md mb-3 p-4">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <div className="detail-item mb-3">
                  <strong>Adresse :</strong>{" "}
                  <span>{selectedRecord.adresse_etablissement}</span>
                </div>

                <div className="detail-item mb-3">
                  <strong>Téléphone :</strong>{" "}
                  <span>{selectedRecord.teletablissement}</span>
                </div>

                <div className="detail-item mb-3">
                  <strong>Email :</strong>{" "}
                  <span>{selectedRecord.mailetablissement}</span>
                </div>

                <div className="detail-item mb-3">
                  <strong>Description :</strong>{" "}
                  <p>{selectedRecord.description}</p>
                </div>

                <div className="detail-item mb-3">
                  <strong>Site web :</strong>{" "}
                  <a
                    className="text-blue-500 hover:underline"
                    href={selectedRecord.sitewebetablissement}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedRecord.sitewebetablissement}
                  </a>
                </div>

                <div className="detail-item mb-3">
                  <strong>Facebook :</strong>{" "}
                  <a
                    className="text-blue-500 hover:underline"
                    href={selectedRecord.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedRecord.facebook}
                  </a>
                </div>

                <div className="detail-item mb-3">
                  <strong>Instagram :</strong>{" "}
                  <a
                    className="text-blue-500 hover:underline"
                    href={selectedRecord.instagrame}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedRecord.instagrame}
                  </a>
                </div>

                <div className="detail-item mb-3">
                  <strong>WhatsApp :</strong>{" "}
                  <span>{selectedRecord.watsapp}</span>
                </div>

                <div className="detail-item mb-4">
                  <strong>Nombre de clients :</strong>{" "}
                  <span>{selectedRecord.nb_clients}</span>
                </div>
              </Col>
              
              <Col xs={24} md={8}>
                <div className="detail-item flex justify-center">
                  <img
                    src={`${Endpoint()}media/${selectedRecord.image}`}
                    alt="Établissement"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
                    }}
                  />
                </div>
              </Col>
            </Row>

            {!isCoach && (
              <div className="flex justify-center mt-4">
                <Button
                  className="mt-2 bg-blue-500 text-white hover:bg-blue-600 transition"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Modifier
                </Button>
              </div>
            )}
          </div>
        )}

        {selectedRecord && editMode && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={selectedRecord}
            onValuesChange={handleFormChange}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="nom_etablissement" 
                  label="Nom Etablissement"
                  rules={[{ required: true, message: 'Veuillez saisir le nom de l\'établissement' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="adresse_etablissement" 
                  label="Adresse"
                  rules={[{ required: true, message: 'Veuillez saisir l\'adresse' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item name="ville" label="Ville">
                  <Select>
                    {villes.map((ville) => (
                      <Select.Option key={ville.id} value={ville.id.toString()}>
                        {ville.nom_ville}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="teletablissement" label="Téléphone">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="mailetablissement" 
                  label="Email"
                  rules={[
                    { 
                      type: 'email',
                      message: 'Format d\'email invalide',
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="sitewebetablissement" label="Site Web">
                  <Input placeholder="https://www.example.com" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item name="facebook" label="Facebook">
                  <Input placeholder="https://www.facebook.com/..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="instagrame" label="Instagram">
                  <Input placeholder="https://www.instagram.com/..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="watsapp" label="WhatsApp">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="nb_clients" label="Nombre de Clients">
              <Input disabled={true} />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Space>
                <Button onClick={handleModalCancel}>Annuler</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!isFormChanged}
                >
                  Sauvegarder
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Display Modes */}
      {displayMode === "table" ? (
        <Table
          loading={loading}
          size="large"
          className="w-full"
          columns={columns}
          dataSource={data}
          rowKey="id_etablissement"
          pagination={{ pageSize: 10 }}
        />
      ) : (
        renderProfileView()
      )}
    </ConfigProvider>
  );
};

export default TableEtablissement;