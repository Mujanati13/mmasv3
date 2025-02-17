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
} from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import {
  addNewTrace,
  addNewTraceDetail,
  getCurrentDate,
} from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const TableEtablissement = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [add, Setadd] = useState();
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [villes, setVilles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(Endpoint() + "/api/etablissements", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        });
        const jsonData = await response.json();
        setData(jsonData.data);

        // Fetch villes data
        const villesResponse = await fetch(Endpoint() + "/api/villes/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const villesData = await villesResponse.json();
        setVilles(villesData.data);

        // Generate columns based on the desired keys
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
            if (key === "Modifier") {
              return (
                <Button
                  className="mt-5"
                  type="default"
                  icon={<EditOutlined onClick={handleEdit} />}
                  onClick={handleEdit}
                >
                  dd
                </Button>
              );
            }
            if (key === "") {
              return (
                <span>
                  <EyeOutlined
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedRecord(record);
                      setVisibleModal(true);
                      setEditMode(false);
                    }}
                  />
                </span>
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
  }, [authToken, add]);

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

  const handleEdit = () => {
    setEditMode(true);
    form.setFieldsValue(selectedRecord);
    setChangedFields([]);
    setIsFormChanged(false);
  };

  const handleFormSubmit = async (values) => {
    console.log("====================================");
    console.log(changedFields);
    console.log("====================================");
    try {
      const response = await fetch(
        `${Endpoint()}api/etablissements/`,
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
      const updatedRecord = await response.json();
      setData((prevData) =>
        prevData.map((item) =>
          item.id_etablissement === updatedRecord.id_etablissement
            ? updatedRecord
            : item
        )
      );
      setVisibleModal(false);
      setSelectedRecord(null);
      const id_staff = JSON.parse(localStorage.getItem("data"));
      const res = await addNewTrace(
        id_staff[0].id_employe,
        "Modification",
        getCurrentDate(),
        `${JSON.stringify(changedFields)}`,
        "établissement"
      );
      console.log("====================================");
      console.log(res);
      console.log("====================================");
      setChangedFields([]);
      setIsFormChanged(false);
      Setadd(Math.random() * 10000);
    } catch (error) {
      console.error("Error updating data:", error);
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
    <div>
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
          visible={visibleModal}
          onCancel={handleModalCancel}
          footer={null}
          title={selectedRecord?.nom_etablissement}
        >
          {selectedRecord && !editMode && (
            <div className="notification-detail border border-blue-300 rounded-lg shadow-md mb-3 p-2">
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
                <strong>Site web :</strong>
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
                <strong>Facebook :</strong>
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
                <strong>Instagram :</strong>
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

              <div className="detail-item mb-4 flex justify-end">
                <img
                  src={`${Endpoint()}media/${selectedRecord.image}`}
                  alt="Établissement"
                  className="w-48 h-48 object-cover rounded-lg" // Taille de l'image ajustée
                />
              </div>

              {!JSON.parse(localStorage.getItem("data"))[0].id_coach && (
                <div className="flex justify-center">
                  <Button
                    className="mt-5 bg-blue-500 text-white hover:bg-blue-600 transition"
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
              <Form.Item name="nom_etablissement" label="Nom Etablissement">
                <Input />
              </Form.Item>
              <Form.Item name="adresse_etablissement" label="Adresse">
                <Input />
              </Form.Item>
              <Form.Item name="ville" label="Ville">
                <Select>
                  {villes.map((ville) => (
                    <Select.Option key={ville.id} value={ville.id.toString()}>
                      {ville.nom_ville}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="teletablissement" label="Téléphone">
                <Input />
              </Form.Item>
              <Form.Item name="mailetablissement" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input />
              </Form.Item>
              <Form.Item name="sitewebetablissement" label="Site Web">
                <Input />
              </Form.Item>
              <Form.Item name="facebook" label="Facebook">
                <Input />
              </Form.Item>
              <Form.Item name="instagrame" label="Instagram">
                <Input />
              </Form.Item>
              <Form.Item name="watsapp" label="WhatsApp">
                <Input />
              </Form.Item>
              <Form.Item name="nb_clients" label="Nombre de Clients">
                <Input disabled={true} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!isFormChanged}
                >
                  Sauvegarder
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>
        <Table
          loading={loading}
          size="large"
          className="w-full mt-5"
          columns={columns}
          dataSource={data}
          rowKey="id_etablissement" // Use id_etablissement as rowKey to avoid key warnings
        />
      </ConfigProvider>
    </div>
  );
};

export default TableEtablissement;
