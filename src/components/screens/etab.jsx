import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  ConfigProvider,
  Typography,
  Space,
  Row,
  Col,
  Select,
  Divider,
  Avatar,
  Badge,
  Tag,
  Image,
  notification,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  GlobalOutlined,
  FacebookOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  LinkOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { addNewTrace, getCurrentDate } from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const { Text, Link, Title, Paragraph } = Typography;

const EtablissementDisplay = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [add, setAdd] = useState();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const authToken = localStorage.getItem("jwtToken");
  const [changedFields, setChangedFields] = useState([]);
  const [villes, setVilles] = useState([]);
  const isStaff = !JSON.parse(localStorage.getItem("data"))[0].id_coach;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [etablissementsRes, villesRes] = await Promise.all([
        fetch(Endpoint() + "/api/etablissements", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch(Endpoint() + "/api/villes/", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);

      const [etablissementsData, villesData] = await Promise.all([
        etablissementsRes.json(),
        villesRes.json(),
      ]);

      setData(etablissementsData.data);
      setVilles(villesData.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Erreur",
        description: "Impossible de charger les données des établissements",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authToken, add]);

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      ville: record.ville.toString(),
    });
    setEditingId(record.id_etablissement);
  };

  const handleCancel = () => {
    setEditingId(null);
    setChangedFields([]);
    form.resetFields();
  };

  const handleFormChange = (changedValues, allValues) => {
    const formatFieldName = (name) => name.replace("_", " ");

    const changedFieldsArray = Object.keys(changedValues).map((key) => ({
      name: formatFieldName(key),
      oldValue: data.find((item) => item.id_etablissement === editingId)[key],
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
  };

  const handleSave = async (id) => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`${Endpoint()}api/etablissements/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...values,
          id_etablissement: id,
          changedFields: changedFields,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update establishment");
      }

      const updatedRecord = await response.json();
      setData(
        data.map((item) =>
          item.id_etablissement === id ? updatedRecord : item
        )
      );

      const id_staff = JSON.parse(localStorage.getItem("data"));
      await addNewTrace(
        id_staff[0].id_employe,
        "Modification",
        getCurrentDate(),
        `${JSON.stringify(changedFields)}`,
        "établissement"
      );

      notification.success({
        message: "Succès",
        description: "Établissement mis à jour avec succès",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });

      setEditingId(null);
      setChangedFields([]);
      setAdd(Math.random() * 10000);
    } catch (error) {
      console.error("Error saving:", error);
      notification.error({
        message: "Erreur",
        description: "Impossible de mettre à jour l'établissement",
      });
    }
  };

  const EstablishmentCard = ({ establishment }) => {
    const isEditing = establishment.id_etablissement === editingId;
    const currentVille = villes.find(
      (v) => v.id.toString() === establishment.ville?.toString()
    );

    if (isEditing) {
      return (
        <Card
          loading={loading}
          className="mb-8 overflow-hidden"
          bordered={true}
          actions={[
            <Button
              key="save"
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleSave(establishment.id_etablissement)}
            >
              Sauvegarder
            </Button>,
            <Button
              key="cancel"
              danger
              icon={<CloseOutlined />}
              onClick={handleCancel}
            >
              Annuler
            </Button>,
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleFormChange}
            className="px-4"
            initialValues={{
              ...establishment,
              ville: establishment.ville?.toString(),
            }}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Space align="start" size={24}>
                  <Avatar
                    size={100}
                    src={`${Endpoint()}media/${establishment.image}`}
                    shape="square"
                    className="rounded-lg"
                  />
                  <Space direction="vertical" size={4} className="flex-1">
                    <Form.Item
                      name="nom_etablissement"
                      label="Nom de l'établissement"
                      rules={[{ required: true, message: "Le nom est requis" }]}
                    >
                      <Input className="text-lg" />
                    </Form.Item>
                    <Form.Item
                      name="ville"
                      label="Ville"
                      rules={[
                        { required: true, message: "La ville est requise" },
                      ]}
                    >
                      <Select style={{ width: "100%" }}>
                        {villes.map((ville) => (
                          <Select.Option
                            key={ville.id}
                            value={ville.id.toString()}
                          >
                            {ville.nom_ville}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Form.Item name="description" label="Description">
                  <Input.TextArea
                    rows={4}
                    placeholder="Description de l'établissement"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title={<Space> Informations de Contact</Space>}
                  size="small"
                  className="h-full"
                >
                  <Form.Item
                    name="adresse_etablissement"
                    label="Adresse"
                    rules={[
                      { required: true, message: "L'adresse est requise" },
                    ]}
                  >
                    <Input prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name="teletablissement"
                    label="Téléphone"
                    rules={[
                      { required: true, message: "Le téléphone est requis" },
                    ]}
                  >
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name="mailetablissement"
                    label="Email"
                    rules={[
                      { required: true, message: "L'email est requis" },
                      { type: "email", message: "Email invalide" },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <LinkOutlined /> Réseaux Sociaux
                    </Space>
                  }
                  size="small"
                  className="h-full"
                >
                  <Form.Item name="sitewebetablissement" label="Site Web">
                    <Input prefix={<GlobalOutlined />} />
                  </Form.Item>
                  <Form.Item name="facebook" label="Facebook">
                    <Input prefix={<FacebookOutlined />} />
                  </Form.Item>
                  <Form.Item name="instagrame" label="Instagram">
                    <Input prefix={<InstagramOutlined />} />
                  </Form.Item>
                  <Form.Item name="watsapp" label="WhatsApp">
                    <Input prefix={<WhatsAppOutlined />} />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </Form>
        </Card>
      );
    }

    return (
      <Card
        loading={loading}
        className="mb-8 overflow-hidden transition-shadow duration-300"
        bordered={true}
        actions={
          isStaff
            ? [
                // <Button
                //   key="edit"
                //   type="primary"
                //   icon={<EditOutlined />}
                //   onClick={() => handleEdit(establishment)}
                // >
                //   Modifier
                // </Button>,
              ]
            : []
        }
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className="flex items-start space-x-6">
              <Badge>
                <Avatar
                  size={120}
                  src={`${Endpoint()}media/${establishment.image}`}
                  shape="square"
                  className="rounded-lg"
                />
              </Badge>
              <div className="flex-1">
                <Space direction="vertical" size={2} className="w-full">
                  <div className="flex items-center justify-between">
                    <Title level={3} className="mb-0">
                      {establishment.nom_etablissement} - TN
                    </Title>
                    {isStaff && (
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(establishment)}
                      >
                        Modifier
                      </Button>
                    )}
                  </div>
                  <Space size={8} wrap>
                    <Tag icon={<EnvironmentOutlined />} color="blue">
                      {currentVille?.nom_ville || "Ville non spécifiée"}
                    </Tag>
                  </Space>
                </Space>
              </div>
            </div>
          </Col>

          <Col span={24}>
            <Card
              size="small"
              title={
                <Space>
                  <FileTextOutlined /> Description
                </Space>
              }
              className="bg-gray-50"
            >
              <Paragraph className="mb-0">
                {establishment.description || "Aucune description disponible"}
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              size="small"
              title={<Space> Informations de Contact</Space>}
              className="h-full"
            >
              <Space direction="vertical" size={16} className="w-full">
                <Space className="w-full">
                  <EnvironmentOutlined className="text-blue-500" />
                  <Text>{establishment.adresse_etablissement}</Text>
                </Space>
                <Space className="w-full">
                  <PhoneOutlined className="text-green-500" />
                  <Link href={`tel:${establishment.teletablissement}`}>
                    {establishment.teletablissement}
                  </Link>
                </Space>
                <Space className="w-full">
                  <MailOutlined className="text-orange-500" />
                  <Link href={`mailto:${establishment.mailetablissement}`}>
                    {establishment.mailetablissement}
                  </Link>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              size="small"
              title={
                <Space>
                  <LinkOutlined /> Réseaux Sociaux
                </Space>
              }
              className="h-full"
            >
              <Space direction="vertical" size={16} className="w-full">
                {establishment.sitewebetablissement && (
                  <Link
                    href={establishment.sitewebetablissement}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Space>
                      <GlobalOutlined className="text-blue-500" />
                      Site Web
                    </Space>
                  </Link>
                )}
                {establishment.facebook && (
                  <Link
                    href={establishment.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Space>
                      <FacebookOutlined className="text-blue-600" />
                      Facebook
                    </Space>
                  </Link>
                )}
                {establishment.instagrame && (
                  <Link
                    href={establishment.instagrame}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Space>
                      <InstagramOutlined className="text-pink-500" />
                      Instagram
                    </Space>
                  </Link>
                )}
                {establishment.watsapp && (
                  <Link
                    href={`https://wa.me/${establishment.watsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Space>
                      <WhatsAppOutlined className="text-green-500" />
                      {establishment.watsapp}
                    </Space>
                  </Link>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
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
      <div className="p-4">
        {data.map((establishment) => (
          <EstablishmentCard
            key={establishment.id_etablissement}
            establishment={establishment}
          />
        ))}
      </div>
    </ConfigProvider>
  );
};

export default EtablissementDisplay;
