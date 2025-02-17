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
  DatePicker,
  ConfigProvider,
  Upload,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { addNewTrace, getCurrentDate } from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const TableStudent = ({ darkmode }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [update, setUpdate] = useState(null);
  const [form] = Form.useForm();
  const [open1, setOpen1] = useState(false);
  const [add, setAdd] = useState(false);
  const [parents, setParents] = useState([]);
  const [cities, setCities] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [classes, setClasses] = useState([]);
  const [imagePath, setimagePath] = useState("/student/avatar.png");
  const [filters, setFilters] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [studentData, setStudentData] = useState({
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
    parent_id: "",
    date_naissance: null,
    date_inscription: null,
    id_classe: null,
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
    formData.append("path", "student/");

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
    fetchCities();
    fetchClasses();
  }, [authToken, update, add]);

  const filterData = (data, searchText, filters) => {
    return data.filter((item) => {
      const nameMatch = `${item.prenom} ${item.nom}`
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const filterMatch = Object.entries(filters).every(([key, value]) => {
        if (!value || value.length === 0) return true;
        return value.includes(String(item[key]));
      });

      return nameMatch && filterMatch;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_coach || index,
          nom_complet: `${item.prenom} ${item.nom}`,
        }));

        setData(processedData);
        const filtered = filterData(processedData, searchText, filters);
        setFilteredData(filtered);

        const desiredKeys = ["nom", "prenom", "classe", "nom_ville"];

        const generatedColumns = desiredKeys.map((key) => {
          const columnConfig = {
            title: getColumnTitle(key),
            dataIndex: key,
            key,
            sorter: getSorter(key),
            sortOrder: sortedInfo.columnKey === key && sortedInfo.order,
            render: getRender(key),
            filters: getFilters(processedData, key),
            onFilter: (value, record) => record[key] === value,
          };

          return columnConfig;
        });

        setColumns(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, update, add, sortedInfo, searchText, filters]);

  function getColumnTitle(key) {
    const titles = {
      nom: "Nom",
      prenom: "Prénom",
      classe: "Classe",
      nom_ville: "Ville",
    };
    return titles[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  function getSorter(key) {
    return (a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  }

  function getRender(key) {
    return (text) => <span>{text}</span>;
  }

  function getFilters(data, key) {
    const uniqueValues = [...new Set(data.map((item) => item[key]))];
    return uniqueValues.map((value) => ({ text: value, value }));
  }

  const fetchParents = async () => {
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
      setParents(jsonData.data);
    } catch (error) {
      console.error("Error fetching parents:", error);
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

  const fetchClasses = async () => {
    try {
      const response = await fetch(
        Endpoint()+"/api/classe/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const jsonData = await response.json();
      setClasses(jsonData.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = filterData(data, value, filters);
    setFilteredData(filtered);
  };

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const handleEditClick = () => {
    if (selectedRowKeys.length === 1) {
      const studentToEdit = data.find(
        (student) => student.key === selectedRowKeys[0]
      );
      studentToEdit.password = null;
      setEditingStudent(studentToEdit);
      setImageUrl(
        Endpoint()+"/media/" + studentToEdit.image
      );
      form.setFieldsValue({
        ...studentToEdit,
        date_naissance: moment(studentToEdit.date_naissance),
        date_inscription: moment(studentToEdit.date_inscription),
        parent_id: studentToEdit.affiliation.id_parent,
      });
      setIsModalVisible(true);
    } else {
      message.warning("Veuillez sélectionner un étudiant à modifier");
    }
  };
  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.id_etudiant = editingStudent.id_etudiant;
      if (values.password === "") {
        values.password = null;
      }
      values.date_naissance = moment(values.date_naissance).format(
        "YYYY-MM-DD"
      );
      values.date_inscription = moment(values.date_inscription).format(
        "YYYY-MM-DD"
      );

      if (true) {
        console.log("====================================");
        console.log(imagePath);
        console.log("====================================");
        const imagePaths = await handleUploadImage();
        values.image = imagePath;
      }

      const response = await fetch(
        Endpoint()+`/api/etudiants/`,
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
        const updatedStudent = await response.json();
        const updatedData = data.map((student) =>
          student.key === editingStudent.key ? updatedStudent : student
        );
        setUpdate(updatedData);
        setData(updatedData);
        const id_staff = JSON.parse(localStorage.getItem("data"));
        const res = await addNewTrace(
          id_staff[0].id_admin,
          "Modification",
          getCurrentDate(),
          `${JSON.stringify(values)}`,
          "student"
        );
        const filtered = filterData(updatedData, searchText, filters);
        setFilteredData(filtered);
        message.success("Étudiant mis à jour avec succès");
        setIsModalVisible(false);
        setEditingStudent(null);
        setSelectedRowKeys([]);
        form.resetFields();
        setFileList([]);
      } else {
        message.error("Erreur lors de la mise à jour de l'étudiant");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      message.error(
        "Une erreur s'est produite lors de la mise à jour de l'étudiant"
      );
    }
  };
  const handleImageChange = async (info) => {
    const { status } = info.file;
    if (status === "done") {
      const imageUrl = await handleUploadImage(info.file.originFileObj);
      if (imageUrl) {
        setImageUrl(imageUrl);
        message.success(`${info.file.name} file uploaded successfully.`);
      }
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingStudent(null);
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    setStudentData({
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
      parent_id: "",
      date_naissance: null,
      date_inscription: null,
      id_classe: null,
    });
  };

  const handleStudentSubmit = async () => {
    try {
      if (
        !studentData.nom ||
        !studentData.prenom ||
        !studentData.tel ||
        !studentData.mail ||
        !studentData.ville ||
        !studentData.parent_id ||
        !studentData.date_naissance ||
        !studentData.date_inscription ||
        !studentData.id_classe
      ) {
        message.warning("Veuillez remplir tous les champs requis");
        return;
      }

      // Upload image first
      const imagePaths = await handleUploadImage();
      if (!imagePath) {
        console.log("====================================");
        console.log(imagePath);
        console.log("====================================");
        message.error("Erreur lors de l'upload de l'image");
        return;
      }

      // Update studentData with the new image path
      const updatedStudentData = {
        ...studentData,
        image: imagePath,
      };

      const response = await fetch(
        Endpoint()+"/api/etudiants/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedStudentData),
        }
      );

      if (response.ok) {
        message.success("Étudiant ajouté avec succès");
        setAdd(Math.random() * 1000);
        setimagePath("/student/avatar.png");
        const id_staff = JSON.parse(localStorage.getItem("data"));
        const res = await addNewTrace(
          id_staff[0].id_admin,
          "Ajout",
          getCurrentDate(),
          `${JSON.stringify(updatedStudentData)}`,
          "student"
        );
        onCloseR();
      } else {
        message.error("Erreur lors de l'ajout de l'étudiant");
      }
    } catch (error) {
      console.error("Une erreur s'est produite:", error);
      message.error("Une erreur s'est produite lors de l'ajout de l'étudiant");
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilters(filters);
  };

  // const handleUploadImage = async (file) => {
  //   const formData = new FormData();
  //   formData.append("uploadedFile", file);
  //   formData.append("path", "student/");

  //   try {
  //     const response = await fetch(
  //       Endpoint()+"/api/saveImage/",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     if (response.ok) {
  //       const res = await response.json();
  //       return End`/media/${res.path}`;
  //     } else {
  //       const errorResponse = await response.json();
  //       message.error(`File upload failed: ${errorResponse.detail}`);
  //     }
  //   } catch (error) {
  //     console.error("Error during file upload:", error);
  //     message.error("File upload failed");
  //   }
  // };

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
                placeholder="Rechercher un étudiant"
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
                  Ajouter un étudiant
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
          onChange={handleTableChange}
        />
        <Modal
          title="Modifier l'étudiant"
          visible={isModalVisible}
          onOk={handleModalSubmit}
          onCancel={handleModalCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="civilite" label="Civilité">
              <Select>
                <Select.Option value="Monsieur">Monsieur</Select.Option>
                <Select.Option value="Madame">Madame</Select.Option>
                <Select.Option value="Mademoiselle">Mademoiselle</Select.Option>
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
            <Form.Item name="ville" label="Ville">
              <Select>
                {cities.map((city) => (
                  <Select.Option key={city.id} value={city.id}>
                    {city.nom_ville}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="date_inscription" label="Date d'inscription">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="id_classe" label="Classe">
              <Select>
                {classes.map((classe) => (
                  <Select.Option
                    key={classe.id_classe}
                    value={classe.id_classe}
                  >
                    {`${classe.niveau} / ${classe.groupe}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="parent_id" label="Parent">
              <Select>
                {parents.map((parent) => (
                  <Select.Option
                    key={parent.id_parent}
                    value={parent.id_parent}
                  >
                    {`${parent.nom} ${parent.prenom}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Image">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
              >
                {imageUrl && fileList.length == 0 ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : fileList.length >= 1 ? null : (
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
          title="Ajouter un étudiant"
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
                    value={studentData.civilite}
                    onChange={(value) =>
                      setStudentData({ ...studentData, civilite: value })
                    }
                  >
                    <Select.Option value="Monsieur">Monsieur</Select.Option>
                    <Select.Option value="Madame">Madame</Select.Option>
                    <Select.Option value="Mademoiselle">
                      Mademoiselle
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nom" required>
                  <Input
                    value={studentData.nom}
                    onChange={(e) =>
                      setStudentData({ ...studentData, nom: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Prénom" required>
                  <Input
                    value={studentData.prenom}
                    onChange={(e) =>
                      setStudentData({ ...studentData, prenom: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Adresse">
                  <Input
                    value={studentData.adresse}
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        adresse: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Téléphone" required>
                  <Input
                    value={studentData.tel}
                    onChange={(e) =>
                      setStudentData({ ...studentData, tel: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" required>
                  <Input
                    type="email"
                    value={studentData.mail}
                    onChange={(e) =>
                      setStudentData({ ...studentData, mail: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Ville" required>
                  <Select
                    value={studentData.ville}
                    onChange={(value) =>
                      setStudentData({ ...studentData, ville: value })
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
                <Form.Item label="Date de naissance" required>
                  <DatePicker
                    className="w-full"
                    value={
                      studentData.date_naissance
                        ? moment(studentData.date_naissance)
                        : null
                    }
                    onChange={(date, dateString) =>
                      setStudentData({
                        ...studentData,
                        date_naissance: dateString,
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Date d'inscription" required>
                  <DatePicker
                    className="w-full"
                    value={
                      studentData.date_inscription
                        ? moment(studentData.date_inscription)
                        : null
                    }
                    onChange={(date, dateString) =>
                      setStudentData({
                        ...studentData,
                        date_inscription: dateString,
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Classe" required>
                  <Select
                    value={studentData.id_classe}
                    onChange={(value) =>
                      setStudentData({ ...studentData, id_classe: value })
                    }
                  >
                    {classes.map((classe) => (
                      <Select.Option
                        key={classe.id_classe}
                        value={classe.id_classe}
                      >
                        {`${classe.niveau} / ${classe.groupe}`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <div className="text-xl">Affiliation</div>
            <Form.Item className="mt-5" label="Parent" required>
              <Select
                value={studentData.parent_id}
                onChange={(value) =>
                  setStudentData({ ...studentData, parent_id: value })
                }
              >
                {parents.map((parent) => (
                  <Select.Option
                    key={parent.id_parent}
                    value={parent.id_parent}
                  >
                    {`${parent.nom} ${parent.prenom}`}
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
              <Button onClick={handleStudentSubmit} type="primary">
                Enregistrer
              </Button>
            </Space>
          </div>
        </Drawer>
      </ConfigProvider>
    </div>
  );
};

export default TableStudent;
