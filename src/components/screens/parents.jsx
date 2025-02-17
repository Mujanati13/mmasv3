import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Modal,
  Form,
  Select,
  message,
  Button,
  Drawer,
  Space,
  Row,
  Col,
  Divider,
  ConfigProvider,
  Upload,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { addNewTrace, getCurrentDate } from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const TableParent = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [update, setUpdate] = useState(null);
  const [form] = Form.useForm();
  const [open1, setOpen1] = useState(false);
  const [add, setAdd] = useState(false);
  const [students, setStudents] = useState([]);
  const [cities, setCities] = useState([]);
  const [imagePath, setimagePath] = useState("/parent/avatar.png");

  // State for parent related data
  const [parentData, setParentData] = useState({
    civilite: "",
    nom: "",
    prenom: "",
    adresse: "",
    tel: "",
    mail: "",
    cin: "",
    statut: false,
    password: "",
    image: "",
    ville: "",
    etudiant_id: "",
    image: imagePath,
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name ||
        (file.url ? file.url.substring(file.url.lastIndexOf("/") + 1) : "")
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleUploadImage = async () => {
    // Check if there is a file to upload
    if (fileList.length === 0) {
      // message.error("No files to upload.");
      return;
    }

    const file = fileList[0]; // Only upload the first file
    console.log(file.originFileObj);

    const formData = new FormData();
    formData.append("uploadedFile", file.originFileObj);
    formData.append("path", "client/");

    try {
      const response = await fetch(
        Endpoint()+"/api/saveImage/",
        {
          method: "POST",
          body: formData, // Corrected: Pass formData directly as the body
        }
      );

      if (response.ok) {
        const res = await response.json();
        setimagePath(res.path);
        ClientData.image = res.path;
        return res.path;
      } else {
        const errorResponse = await response.json();
        // message.error(`File upload failed: ${errorResponse.detail}`);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      //   message.error("File upload failed");
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchParents();
    fetchStudents();
    fetchCities();
  }, [authToken, update, add]);

  const fetchParents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        Endpoint()+"/api/Parentt/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const jsonData = await response.json();

      const processedData = jsonData.data.map((item, index) => ({
        ...item,
        key: item.id_parent || index,
      }));

      setData(processedData);
      setFilteredData(processedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching parents:", error);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        Endpoint()+"/api/etudiants/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const jsonData = await response.json();
      setStudents(jsonData.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(
        Endpoint()+"/api/villes/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const jsonData = await response.json();
      setCities(jsonData.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter(
      (item) =>
        item.nom.toLowerCase().includes(value) ||
        item.prenom.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Row selection object
  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const handleEditClick = () => {
    if (selectedRowKeys.length === 1) {
      const parentToEdit = data.find(
        (parent) => parent.key === selectedRowKeys[0]
      );
      parentToEdit.password = null;
      setEditingParent(parentToEdit);
      form.setFieldsValue(parentToEdit);
      console.log("====================================");
      console.log(
        Endpoint()+"/media/" + parentToEdit.image
      );
      console.log("====================================");
      // Set the fileList with the existing image if it exists
      if (parentToEdit.image) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url:
              Endpoint()+"/media/" +
              parentToEdit.image,
          },
        ]);
      } else {
        setFileList([]);
      }

      setIsModalVisible(true);
    } else {
      message.warning("Veuillez sélectionner un parent à modifier");
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.id_parent = editingParent.id_parent;
      if (values.password === "") {
        values.password = null;
      }

      // Handle image upload if there's a new image
      const imageUrl = await handleUploadImage();
      values.image = imagePath;

      const response = await fetch(
        `${Endpoint()}/api/Parentt/`,
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
        const updatedParent = await response.json();
        const updatedData = data.map((parent) =>
          parent.key === editingParent.key ? updatedParent : parent
        );
        setUpdate(updatedData);
        setData(updatedData);
        setFilteredData(updatedData);
        message.success("Parent mis à jour avec succès");
        setIsModalVisible(false);
        setEditingParent(null);
        setSelectedRowKeys([]);
        const id_staff = JSON.parse(localStorage.getItem("data"));
        const res = await addNewTrace(
          id_staff[0].id_admin,
          "Modification",
          getCurrentDate(),
          `${JSON.stringify(values)}`,
          "parent"
        );
        setimagePath("client/avatar.png");
        form.resetFields();
        setFileList([]);
      } else {
        message.error("Erreur lors de la mise à jour du parent");
      }
    } catch (error) {
      console.error("Error updating parent:", error);
      message.error(
        "Une erreur s'est produite lors de la mise à jour du parent"
      );
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingParent(null);
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    setParentData({
      civilite: "",
      nom: "",
      prenom: "",
      adresse: "",
      tel: "",
      mail: "",
      cin: "",
      statut: false,
      password: "",
      image: "",
      ville: "",
      etudiant_id: "",
    });
  };

  const handleParentSubmit = async () => {
    try {
      if (
        !parentData.nom ||
        !parentData.prenom ||
        !parentData.tel ||
        !parentData.mail ||
        !parentData.ville ||
        !parentData.etudiant_id
      ) {
        message.warning("Veuillez remplir tous les champs requis");
        return;
      }

      // Handle image upload if there's a new image
      let imageUrl = null;
      imageUrl = await handleUploadImage();

      const parentDataToSend = {
        ...parentData,
        image: imageUrl || imagePath, // Use uploaded image URL or default image path
      };

      const response = await fetch(
        Endpoint()+"/api/Parentt/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(parentDataToSend),
        }
      );
      if (response.ok) {
        message.success("Parent ajouté avec succès");
        setAdd(Math.random() * 1000);
        onCloseR();
        const id_staff = JSON.parse(localStorage.getItem("data"));
        const res = await addNewTrace(
          id_staff[0].id_admin,
          "Ajout",
          getCurrentDate(),
          `${JSON.stringify(parentDataToSend)}`,
          "parent"
        );
        setFileList([]); // Reset file list after successful submission
      } else {
        message.error("Erreur lors de l'ajout du parent");
      }
    } catch (error) {
      console.log(error);
      message.error("Une erreur s'est produite:", error);
    }
  };

  // Enhanced columns with filtering
  const columns = [
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      sorter: (a, b) => a.nom.localeCompare(b.nom),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Rechercher nom"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Rechercher
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Réinitialiser
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.nom.toLowerCase().includes(value.toLowerCase()),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Prénom",
      dataIndex: "prenom",
      key: "prenom",
      sorter: (a, b) => a.prenom.localeCompare(b.prenom),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Rechercher prénom"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Rechercher
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Réinitialiser
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.prenom.toLowerCase().includes(value.toLowerCase()),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Téléphone",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "Email",
      dataIndex: "mail",
      key: "mail",
    },
    {
      title: "Ville",
      dataIndex: "nom_ville",
      key: "nom_ville",
      filters: cities.map((city) => ({
        text: city.nom_ville,
        value: city.nom_ville,
      })),
      onFilter: (value, record) => record.nom_ville === value,
    },
  ];

  return (
    <div className="w-full p-2">
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
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-7">
            <div className="w-52">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Rechercher un parent"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-6">
              {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                "Administration" &&
                (true ? (
                  <Button
                    onClick={handleEditClick}
                    icon={<EditOutlined />}
                    disabled={selectedRowKeys.length !== 1}
                  >
                    Modifier
                  </Button>
                ) : (
                  ""
                ))}
            </div>
          </div>
          <div>
            {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
              "Administration" &&
              (true ? (
                <Button onClick={showDrawerR} icon={<UserAddOutlined />}>
                  Ajouter un parent
                </Button>
              ) : (
                ""
              ))}
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
          title="Modifier le parent"
          visible={isModalVisible}
          onOk={handleModalSubmit}
          onCancel={handleModalCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="civilite" label="Civilité">
              <Select>
                <Select.Option value="Monsieur">Monsieur</Select.Option>
                <Select.Option value="Madame">Madame</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="nom" label="Nom">
              <Input />
            </Form.Item>
            <Form.Item name="prenom" label="Prénom">
              <Input />
            </Form.Item>
            <Form.Item name="adresse" label="Adresse">
              <Input />
            </Form.Item>
            <Form.Item name="tel" label="Téléphone">
              <Input />
            </Form.Item>
            <Form.Item name="mail" label="Email">
              <Input type="email" />
            </Form.Item>
            <Form.Item name="cin" label="CIN">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input />
            </Form.Item>
            <Form.Item name="ville" label="Ville">
              <Select>
                {cities.map((city) => (
                  <Select.Option key={city.id} value={city.id}>
                    {city.nom_ville}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="statut" label="Statut">
              <Select>
                <Select.Option value={true}>Actf</Select.Option>
                <Select.Option value={false}>Inactif</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="image" label="Image">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={({ fileList: newFileList }) =>
                  setFileList(newFileList)
                }
                beforeUpload={() => false}
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
        <Drawer
          title="Ajouter un parent"
          width={720}
          onClose={onCloseR}
          open={open1}
          bodyStyle={{
            paddingBottom: 80,
          }}
        >
          <Form layout="vertical">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false} // Prevent automatic upload
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <div style={{ marginTop: 20 }}></div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Civilité" required>
                  <Select
                    value={parentData.civilite}
                    onChange={(value) =>
                      setParentData({ ...parentData, civilite: value })
                    }
                  >
                    <Select.Option value="Monsieur">Monsieur</Select.Option>
                    <Select.Option value="Madame">Madame</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nom" required>
                  <Input
                    value={parentData.nom}
                    onChange={(e) =>
                      setParentData({ ...parentData, nom: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Prénom" required>
                  <Input
                    value={parentData.prenom}
                    onChange={(e) =>
                      setParentData({ ...parentData, prenom: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Adresse">
                  <Input
                    value={parentData.adresse}
                    onChange={(e) =>
                      setParentData({ ...parentData, adresse: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Téléphone" required>
                  <Input
                    value={parentData.tel}
                    onChange={(e) =>
                      setParentData({ ...parentData, tel: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" required>
                  <Input
                    type="email"
                    value={parentData.mail}
                    onChange={(e) =>
                      setParentData({ ...parentData, mail: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="CIN">
                  <Input
                    value={parentData.cin}
                    onChange={(e) =>
                      setParentData({ ...parentData, cin: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ville" required>
                  <Select
                    value={parentData.ville}
                    onChange={(value) =>
                      setParentData({ ...parentData, ville: value })
                    }
                  >
                    {cities.map((city) => (
                      <Select.Option key={city.id} value={city.id}>
                        {city.nom_ville}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Mot de passe">
                  <Input.Password
                    value={parentData.password}
                    onChange={(e) =>
                      setParentData({ ...parentData, password: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* Intentionally left empty for layout purposes */}
              </Col>
            </Row>
            <Divider />
            <div className="text-xl">Affiliation</div>
            <Form.Item className="mt-5" label="Étudiant" required>
              <Select
                value={parentData.etudiant_id}
                onChange={(value) =>
                  setParentData({ ...parentData, etudiant_id: value })
                }
              >
                {students.map((student) => (
                  <Select.Option
                    key={student.id_etudiant}
                    value={student.id_etudiant}
                  >
                    {`${student.nom} ${student.prenom}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "10px 16px",
              background: "#fff",
              textAlign: "right",
            }}
          >
            <Space>
              <Button onClick={onCloseR}>Annuler</Button>
              <Button onClick={handleParentSubmit} type="primary">
                Enregistrer
              </Button>
            </Space>
          </div>
        </Drawer>
      </ConfigProvider>
    </div>
  );
};

export default TableParent;
