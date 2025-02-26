import React, { useState, useEffect } from "react";
import {
  Table,
  ConfigProvider,
  Input,
  Select,
  message,
  Popconfirm,
  Modal,
  Drawer,
  Button,
  Spin,
  DatePicker,
  Checkbox,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  PrinterOutlined,
  FileAddOutlined,
  EyeOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {
  addMonths,
  addNewTrace,
  getCurrentDate,
  toCapitalize,
} from "../../utils/helper";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { handlePrintContract } from "../../utils/printable/contract";
import { Endpoint } from "../../utils/endpoint";
const { Option } = Select;

const TableContract = ({ darkmode }) => {
  const adminData = JSON.parse(localStorage.getItem("data"));
  const initialAdminId = adminData ? adminData[0].id_admin : "";

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open1, setOpen1] = useState(false);
  const [clients, setClients] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [abonnements, setAbonnements] = useState([]);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportFields, setExportFields] = useState({});
  const [exportDateRange, setExportDateRange] = useState([null, null]);
  const [exportModeReglement, setExportModeReglement] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState([]);
  const [add, setAdd] = useState(false);
  const [niveaux, setNiveaux] = useState([]);
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  const [classes, setClasses] = useState([]);

  const [ContractData, setContractData] = useState({
    id_etd: "",
    date_debut: getCurrentDate(),
    date_fin: null,
    reste: null,
    id_abn: null,
    Type: "",
    type: "",
    reduction: 0,
    id_etablissement: 19,
    abonnement: "",
    Mode_reglement: "Espèces",
    description: "",
    montant: null,
    id_admin: JSON.parse(localStorage.getItem("data"))[0].id_admin,
  });

  const fetchNiveaux = async () => {
    try {
      const response = await fetch(Endpoint() + "/api/niveau/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setNiveaux(data.data);
    } catch (error) {
      console.error("Error fetching niveaux:", error);
    }
  };
  const fetchClasses = async () => {
    try {
      const response = await fetch(Endpoint() + "/api/classe/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setClasses(data.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClients();
    fetchAbonnements();
    fetchNiveaux();
    fetchClasses(); // Add this line
    const adminData = JSON.parse(localStorage.getItem("data"));
    const initialAdminId = adminData ? adminData[0].id_admin : "";
    ContractData.id_admin = initialAdminId;
  }, []);

  const handleAddTransaction = () => {
    const newTransaction = {
      montant: "",
      Mode_reglement: "Espèces",
      Type: true,
    };
    setTransactions([...transactions, newTransaction]);
  };

  const handleRemoveTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    updateContractDataFromTransactions(updatedTransactions);
  };

  const handleTransactionChange = (index, field, value) => {
    const updatedTransactions = transactions.map((transaction, i) => {
      if (i === index) {
        return { ...transaction, [field]: value };
      }
      return transaction;
    });
    setTransactions(updatedTransactions);
    updateContractDataFromTransactions(updatedTransactions);
  };

  const updateContractDataFromTransactions = (updatedTransactions) => {
    const totalMontant = updatedTransactions.reduce(
      (sum, transaction) => sum + (parseFloat(transaction.montant) || 0),
      0
    );
    const tarifMinusReduction =
      ContractData.tarif - (ContractData.reduction || 0);
    const newReste = Math.max(0, tarifMinusReduction - totalMontant);

    setContractData({
      ...ContractData,
      montant: totalMontant,
      reste: newReste,
    });
  };

  const handleViewDetails = (record) => {
    setSelectedContract(record);
    setIsModalVisible(true);
    setTransactionData([]); // Reset transaction data when opening a new contract
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedContract(null);
  };

  const handleExport = () => {
    // Filter data based on date range and Mode_reglement
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.date_debut);
      const dateRangeFilter =
        (!exportDateRange[0] || itemDate >= exportDateRange[0].toDate()) &&
        (!exportDateRange[1] || itemDate <= exportDateRange[1].toDate());
      const modeReglementFilter =
        exportModeReglement.length === 0 ||
        exportModeReglement.includes(item.Mode_reglement);
      return dateRangeFilter && modeReglementFilter;
    });

    // Filter fields based on user selection
    const exportData = filteredData.map((item) => {
      const exportItem = {};
      Object.keys(exportFields).forEach((field) => {
        if (exportFields[field]) {
          exportItem[field] = item[field];
        }
      });
      return exportItem;
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contrats");

    // Save to file
    XLSX.writeFile(wb, "contrats_export.xlsx");
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(Endpoint() + "/api/Parentt/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setClients(data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchTransactions = async (id_contrat) => {
    try {
      const response = await fetch(
        `${Endpoint()}/api/transaction_by_contrat_id/?id_contrat=${id_contrat}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setTransactionData(data.data);
      setTransactionModalVisible(true);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // message.error("An error occurred while fetching transactions");
    }
  };

  const fetchAbonnements = async () => {
    try {
      const response = await fetch(Endpoint() + "/api/abonnement/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setAbonnements(data.data);
    } catch (error) {
      console.error("Error fetching abonnements:", error);
    }
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
    }
  };

  useEffect(() => {
    // console.log(JSON.stringify(localStorage.getItem("data")));
    fetchStudents();
    fetchClients();
    fetchAbonnements();
    const adminData = JSON.parse(localStorage.getItem("data"));
    const initialAdminId = adminData ? adminData[0].id_admin : ""; // Accessing the first element's id_admin
    ContractData.id_admin = initialAdminId;
  }, []);

  const handlePrint = () => {
    selectedRowKeys.map(async (key) => {
      const ContractData = data.find((client) => client.key === key);
      const Client = clients.filter(
        (client) => client.id_client === ContractData.id_client
      );
      handlePrintContract(Client[0], ContractData);
    });
  };

  // Validation function to check if all required fields are filled for the contract form
  const isContractFormValid = () => {
    return ContractData.date_debut !== null && ContractData.date_fin !== null;
  };

  // Function to add a new contract
  const addContract = async () => {
    // Format date for consistency
    const date = new Date(ContractData.date_fin);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    ContractData.date_fin = `${year}-${month}-${day}`;

    // Get admin data
    const id_staff = JSON.parse(localStorage.getItem("data"));
    ContractData.id_admin = id_staff[0].id_employe;
    ContractData.Type = true;

    try {
      // Check for existing contracts with same student, subscription and overlapping dates
      const existingContracts = data.filter(
        (contract) =>
          contract.id_etd === ContractData.id_etd &&
          contract.id_abn === ContractData.id_abn &&
          // Check if dates overlap
          new Date(contract.date_debut) <= new Date(ContractData.date_fin) &&
          new Date(contract.date_fin) >= new Date(ContractData.date_debut)
      );

      if (existingContracts.length > 0) {
        message.warning(
          "Un contrat existe déjà pour cet étudiant avec le même abonnement pour cette période"
        );
        return;
      }

      const dataToSend = {
        ...ContractData,
        transactions: transactions.map((transaction) => ({
          ...transaction,
          date: getCurrentDate(),
        })),
      };

      // Add contract if no duplicates found
      const contractResponse = await fetch(Endpoint() + "/api/contrat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (contractResponse.ok) {
        const contractResult = await contractResponse.json();
        if (contractResult.msg === "Added Successfully!!") {
          message.success("Contrat et transactions ajoutés avec succès");
          onCloseR();
          setAdd(Math.random() * 1000);
          setOpen1(false);
        } else {
          message.warning(contractResult.msg);
        }
      } else {
        message.error("Error adding contract");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Une erreur s'est produite lors de l'ajout du contrat");
    }
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    setActiveStep(0);
    setTransactions([]);
    setContractData({
      id_client: "",
      date_debut: getCurrentDate(),
      date_fin: null,
      reste: null,
      id_abn: null,
      Type: true,
      type: "",
      reduction: "",
      id_etablissement: 19,
      abonnement: "",
      Mode_reglement: "Espèces",
      description: "",
      montant: null,
      id_admin: null,
    });
  };

  // stepper
  const steps = [
    {
      label: "Informations de contrat",
      description: (
        <div className="w-full grid grid-cols-2 gap-4 mt-5">
          <div>
            <label htmlFor="dateDebut">Date de Début</label>
            <DatePicker
              id="dateDebut"
              className="w-full"
              size="middle"
              placeholder="Date de Début"
              value={dayjs(getCurrentDate())}
              disabled={true}
              onChange={(date, dateString) =>
                setContractData({ ...ContractData, date_debut: dateString })
              }
            />
          </div>
          <div>
            <label htmlFor="dateFin">Date de Fin</label>
            <DatePicker
              className="w-full"
              id="dateFin"
              size="middle"
              placeholder="Date de Fin"
              disabled={true}
              value={ContractData.date_fin && dayjs(ContractData.date_fin)}
              onChange={(date, dateString) => {
                setContractData({
                  ...ContractData,
                  date_fin: date,
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="abonnement">Abonnement</label>
            <Select
              id="abonnement"
              showSearch
              className="w-full"
              placeholder="Abonnement"
              value={ContractData.id_abn}
              onChange={(value) => {
                const selectedAbonnement = abonnements.find(
                  (abonnement) => abonnement.id_abn === value
                );
                if (selectedAbonnement) {
                  const {
                    tarif,
                    duree_mois,
                    id_abn,
                    type_abonnement,
                    namecat_conrat,
                  } = selectedAbonnement;
                  const endDate = addMonths(duree_mois);
                  setContractData((prevContractData) => ({
                    ...prevContractData,
                    id_abn: id_abn,
                    date_fin: endDate,
                    tarif: tarif,
                    abonnement: `${type_abonnement} ${namecat_conrat}`,
                    reste: tarif,
                    reduction: 0,
                  }));
                }
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={abonnements.map((abonnement) => ({
                value: abonnement.id_abn,
                label: `${abonnement.type_abonnement} (${abonnement.namecat_conrat})`,
              }))}
            />
          </div>
          {/* <div>
            <label htmlFor="client">Parent</label>
            <Select
              id="client"
              showSearch
              value={ContractData.id_parent}
              className="w-full"
              onChange={(value) => {
                setContractData({ ...ContractData, id_parent: value });
                const c = clients.find((e) => e.id_parent == value);
                console.log("====================================");
                if (c.civilite == "Monsieur") {
                  setContractData((prevContractData) => ({
                    ...prevContractData,
                    type: "Homme",
                  }));
                } else {
                  setContractData((prevContractData) => ({
                    ...prevContractData,
                    type: "Femme",
                  }));
                }
                console.log(c);
                console.log("====================================");
              }}
              placeholder="Client"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").startsWith(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={clients.map((client) => ({
                value: client.id_parent,
                label: `${client.nom} ${client.prenom}`,
              }))}
            />
          </div> */}
          <div>
            <label htmlFor="niveau">Niveau</label>
            <Select
              id="niveau"
              showSearch
              className="w-full"
              placeholder="Sélectionner un niveau"
              value={selectedNiveau}
              onChange={(value) => {
                setSelectedNiveau(value);
                setContractData({ ...ContractData, id_etd: null }); // Reset student selection
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={niveaux.map((niveau) => ({
                value: niveau.id_niveau,
                label: niveau.niveau,
              }))}
            />
          </div>
          <div>
            <label htmlFor="client">Etudiants</label>
            <Select
              id="client"
              showSearch
              value={ContractData.id_etd}
              className="w-full"
              onChange={(value) => {
                setContractData({ ...ContractData, id_etd: value });
              }}
              placeholder="Etudiants"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={students
                .filter((student) => {
                  if (!selectedNiveau) return true;

                  // Find the classes for the selected niveau
                  const niveauClasses = classes.filter(
                    (classe) => classe.id_niveau === selectedNiveau
                  );
                  console.log(niveauClasses)

                  // Check if student's class is in the filtered classes
                  return niveauClasses.some(
                    (classe) => classe.id_classe === student.id_classe
                  );
                })

                .map((student) => ({
                  value: student.id_etudiant,
                  label: `${student.nom} ${student.prenom}`,
                }))}
                
              disabled={!selectedNiveau}
            />
          </div>
          <div>
            <label htmlFor="reduction">Réduction</label>
            <Input
              id="reduction"
              size="middle"
              placeholder="Réduction"
              value={ContractData.reduction}
              onChange={(e) => {
                const reduction = parseFloat(e.target.value) || 0;
                if (reduction > ContractData.tarif) {
                  message.warning("Réduction doit être inférieur au tarif ");
                  return;
                }
                const newReste = ContractData.tarif - reduction;
                setContractData({
                  ...ContractData,
                  reduction: reduction,
                  reste: newReste,
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="tarif">Tarif D'abonnement</label>
            <Input
              id="tarif"
              disabled={true}
              size="middle"
              placeholder="Tarif"
              value={ContractData.tarif}
              onChange={(e) =>
                setContractData({
                  ...ContractData,
                  tarif: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label htmlFor="type">Genre</label>
            <Select
              id="type"
              showSearch
              // disabled={true}
              placeholder="Type"
              value={ContractData.type} // Use ContractData.Type instead of ContractData.type
              className="w-full"
              onChange={(value) =>
                setContractData((prevContractData) => ({
                  ...prevContractData,
                  type: value,
                }))
              } // Use setContractData to update ContractData state
              options={[
                {
                  value: "Homme",
                  label: "Homme",
                },
                {
                  value: "Femme",
                  label: "Femme",
                },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      label: "Ajouter transactions",
      description: (
        <div className="w-full mt-5">
          <Table
            style={{ width: "100%" }}
            className="w-full"
            size="small"
            dataSource={transactions}
            pagination={false}
            rowKey={(record, index) => index}
            columns={[
              {
                title: "Montant",
                dataIndex: "montant",
                key: "montant",
                render: (text, record, index) => (
                  <Input
                    value={text}
                    onChange={(e) => {
                      const montant = parseFloat(e.target.value) || 0;
                      const tarifMinusReduction =
                        ContractData.tarif - (ContractData.reduction || 0);
                      const totalMontant = transactions.reduce(
                        (sum, t, i) =>
                          sum +
                          (i === index ? montant : parseFloat(t.montant) || 0),
                        0
                      );
                      if (totalMontant > tarifMinusReduction) {
                        message.warning(
                          "Le montant total ne peut pas dépasser le tarif moins la réduction"
                        );
                        return;
                      }
                      handleTransactionChange(index, "montant", e.target.value);
                    }}
                  />
                ),
              },
              {
                title: "Mode de Règlement",
                dataIndex: "Mode_reglement",
                key: "Mode_reglement",
                render: (text, record, index) => (
                  <Select
                    value={text}
                    onChange={(value) =>
                      handleTransactionChange(index, "Mode_reglement", value)
                    }
                    options={[
                      { value: "Chèques", label: "Chèques" },
                      { value: "Espèces", label: "Espèces" },
                      { value: "Prélèvements", label: "Prélèvements" },
                      { value: "Autre", label: "Autre" },
                    ]}
                  />
                ),
              },
              {
                title: "Description",
                dataIndex: "description",
                key: "description",
                render: (text, record, index) => (
                  <Input
                    // value={}
                    onChange={(e) =>
                      handleTransactionChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Entrez une description"
                  />
                ),
              },
              {
                title: "Action",
                key: "action",
                render: (_, record, index) => (
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveTransaction(index)}
                    danger
                  />
                ),
              },
            ]}
          />
          {ContractData.reste > 0 && transactions.length < 1 ? (
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddTransaction}
              style={{ marginTop: "10px" }}
            >
              Ajouter une transaction
            </Button>
          ) : (
            <p style={{ marginTop: "10px", color: "green" }}>
              Le montant total a été payé. Aucune transaction supplémentaire
              n'est nécessaire.
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <label htmlFor="resteActuel">Le reste actuel</label>
              <Input
                id="resteActuel"
                disabled={true}
                size="middle"
                placeholder="Le reste actuel"
                value={ContractData.reste}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Final",
      description: (
        <div className="mt-4">
          <Card title="Résumé du Contrat" style={{ width: "100%" }}>
            {Object.entries(ContractData).map(([key, value]) => {
              if (
                key === "id_client" ||
                key === "id_abn" ||
                key === "id_etablissement" ||
                key === "Type" ||
                key === "description" ||
                key === "id_admin" ||
                key === "Mode_reglement" ||
                key === "montant" ||
                value === null ||
                value === undefined ||
                value === ""
              )
                return null;
              return (
                <Row key={key} style={{ marginBottom: "8px" }}>
                  <Col span={12}>
                    <strong>{toCapitalize(key.replaceAll("_", " "))}</strong>
                  </Col>
                  <Col span={12}>{value}</Col>
                </Row>
              );
            })}

            {transactions.filter((t) => t.montant && t.montant !== "").length >
              0 && (
              <>
                <Divider />
                <h3 style={{ marginTop: "16px", marginBottom: "8px" }}>
                  Transactions
                </h3>
                <Table
                  columns={[
                    {
                      title: "Montant",
                      dataIndex: "montant",
                      key: "montant",
                      render: (text) => `${text} MAD`,
                    },
                    {
                      title: "Mode de Règlement",
                      dataIndex: "Mode_reglement",
                      key: "Mode_reglement",
                    },
                    {
                      title: "Description",
                      dataIndex: "description",
                      key: "description",
                      render: (text) => text || "-",
                    },
                  ]}
                  dataSource={transactions.filter(
                    (t) => t.montant && t.montant !== ""
                  )}
                  pagination={false}
                  size="small"
                />
              </>
            )}
          </Card>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      addContract();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both contracts and students data in parallel
        const [contractResponse, studentsResponse] = await Promise.all([
          fetch(Endpoint() + "/api/contrat/", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
          fetch(Endpoint() + "/api/etudiants/", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
        ]);

        const [contractData, studentsData] = await Promise.all([
          contractResponse.json(),
          studentsResponse.json(),
        ]);

        // Update students state
        setStudents(studentsData.data);

        // Process contract data
        const processedData = contractData.data.map((item, index) => ({
          ...item,
          key: item.id_contrat || index,
        }));

        setData(processedData);
        setFilteredData(processedData);

        // Define columns with student name rendering
        const desiredKeys = [
          {
            title: "Etudiants",
            dataIndex: "id_etd",
            key: "nom_complet",
            render: (id_etd) => {
              const student = studentsData.data.find(
                (s) => s.id_etudiant === id_etd
              );
              return student ? `${student.nom} ${student.prenom}` : "-";
            },
          },
          {
            title: "Type d'Abonnement",
            dataIndex: "abonnement",
            key: "abonnement",
          },
          {
            title: "Type",
            dataIndex: "type",
            key: "type",
          },
          {
            title: "Date de Début",
            dataIndex: "date_debut",
            key: "date_debut",
          },
          {
            title: "Date de Fin",
            dataIndex: "date_fin",
            key: "date_fin",
          },
          {
            title: "Catégorie d'Abonnement",
            dataIndex: "cat_abn",
            key: "cat_abn",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <EyeOutlined
                onClick={() => handleViewDetails(record)}
                style={{ cursor: "pointer" }}
              />
            ),
          },
        ];

        const generatedColumns = desiredKeys.map((column) => ({
          title: column.title,
          dataIndex: column.dataIndex,
          key: column.key,
          render: column.render || ((text) => text),
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.client.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const ContractData = data.find((client) => client.key === key);
          console.log(ContractData);
          const response = await fetch(
            `${Endpoint()}/api/contrat/${ContractData.id_contrat}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify(ContractData),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to delete client with key ${key}`);
          }
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_admin,
            "Supprimer",
            getCurrentDate(),
            `${JSON.stringify(ContractData)}`,
            "contrat"
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

  const detailColumns = [
    {
      title: "",
      dataIndex: "property",
      key: "property",
    },
    {
      title: "",
      dataIndex: "value",
      key: "value",
      render: (text) => {
        if (typeof text === "boolean") {
          return text ? "Oui" : "Non";
        }
        return text || "Non spécifié";
      },
    },
  ];

  const getDetailData = (contract) => {
    if (!contract) return [];

    return [
      // { key: "section1", property: "Informations Personnelles", value: "" },
      {
        key: "fullName",
        property: "Nom Complet du Client",
        value: `${contract.client || ""} ${
          contract.Prenom_client || ""
        }`.trim(),
      },
      { key: "type", property: "Genre", value: contract.type },
      // { key: "section2", property: "Informations du Contrat", value: "" },
      {
        key: "numcontrat",
        property: "Numéro de Contrat",
        value: contract.numcontrat,
      },
      {
        key: "date_debut",
        property: "Date",
        value: "de " + contract.date_debut + " à " + contract.date_fin,
      },
      // { key: "date_fin", property: "Date de Fin", value: contract.date_fin  },
      {
        key: "etablissemnt",
        property: "Établissement",
        value: contract.etablissemnt,
      },
      {
        key: "abonnement",
        property: "Type d'Abonnement",
        value: contract.abonnement,
      },
      {
        key: "cat_abn",
        property: "Catégorie d'Abonnement",
        value: contract.cat_abn,
      },
      // { key: "section3", property: "Informations Financières", value: "" },
      // {
      //   key: "reduction",
      //   property: "Réduction",
      //   value:
      //     contract.reduction !== undefined
      //       ? `${contract.reduction} MAD`
      //       : undefined,
      // },
      {
        key: "reste",
        property: "Montant Restant",
        value:
          contract.reste !== undefined ? `${contract.reste} MAD` : undefined,
      },
    ];
  };

  const detailData = selectedContract
    ? Object.entries(selectedContract)
        .filter(([key]) => !key.startsWith("id_")) // Filter out properties starting with 'id_'
        .map(([key, value]) => ({
          key,
          property:
            key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
          value:
            typeof value === "object" ? JSON.stringify(value) : String(value),
        }))
    : [];

  const handlePrintReceipt = (transaction) => {
    // setSelectedTransaction(transaction);
    printReceipt(selectedContract, transaction);
    // You would implement the actual printing logic here.
    // For now, we'll just show a message
    // TODO: Implement actual receipt printing logic
  };

  const handleprintFacteur = (transaction) => {
    printFacteur(selectedContract, transaction);
  };

  const modeReglementOptions = ["Chèques", "Espèces", "Prélèvements", "Autre"];

  // printReceipt()

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
          title="Options d'exportation"
          visible={exportModalVisible}
          onOk={() => {
            setExportModalVisible(false);
            handleExport();
          }}
          onCancel={() => setExportModalVisible(false)}
          okText="Exporter"
          cancelText="Annuler"
        >
          <div>
            <h4>Sélectionnez les champs à exporter :</h4>
            {columns.map((column) => (
              <Checkbox
                key={column.key}
                onChange={(e) =>
                  setExportFields({
                    ...exportFields,
                    [column.key]: e.target.checked,
                  })
                }
              >
                {column.title}
              </Checkbox>
            ))}
          </div>
          <div style={{ marginTop: "20px" }}>
            <h4>Sélectionnez la plage de dates :</h4>
            <DatePicker.RangePicker
              onChange={(dates) => setExportDateRange(dates)}
              placeholder={["Date de début", "Date de fin"]}
              format="DD/MM/YYYY"
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <h4>Sélectionnez le mode de règlement :</h4>
            <Checkbox.Group
              options={modeReglementOptions}
              onChange={(checkedValues) =>
                setExportModeReglement(checkedValues)
              }
            />
          </div>
        </Modal>
        <Modal
          title="Détails du Contrat Client"
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={800}
        >
          <Button
            type=""
            className="mb-5 mt-5"
            onClick={() => fetchTransactions(selectedContract?.id_contrat)}
          >
            Afficher les transactions
          </Button>
          {selectedContract ? (
            <Table
              columns={detailColumns}
              dataSource={getDetailData(selectedContract)}
              pagination={false}
              size="small"
              className="mt-3"
            />
          ) : (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          )}
        </Modal>
        <Modal
          title="Détails des Transactions"
          visible={transactionModalVisible}
          onCancel={() => setTransactionModalVisible(false)}
          footer={null}
          width={800}
        >
          <Table
            columns={[
              { title: "Date", dataIndex: "date", key: "date" },
              {
                title: "Type",
                dataIndex: "Type",
                key: "Type",
                render: (text) => (text ? "Entrée" : "Sortie"),
              },
              { title: "Montant", dataIndex: "montant", key: "montant" },
              {
                title: "Mode de règlement",
                dataIndex: "Mode_reglement",
                key: "Mode_reglement",
              },
              {
                title: "Description",
                dataIndex: "description",
                key: "description",
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={() => handlePrintReceipt(record)}
                  >
                    Imprimer Reçu
                  </Button>
                ),
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={() => handleprintFacteur(record)}
                  >
                    Imprimer la facteur
                  </Button>
                ),
              },
            ]}
            dataSource={transactionData}
            pagination={false}
            size="small"
          />
        </Modal>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-7">
            <div className="w-52">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search Client"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-6">
              {selectedRowKeys.length === 1 ? "" : ""}
              {/* security isseu */}
              {/* {(true) &&
                                selectedRowKeys.length >= 1 ? (
                                <Popconfirm
                                    title="Supprimer le contact"
                                    description="Êtes-vous sûr de supprimer ce contact ?"
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
              <Button
                onClick={() => setExportModalVisible(true)}
                icon={<DownloadOutlined />}
              >
                Export to Excel
              </Button>
            </div>
          </div>
          {/* add contract */}
          <div>
            <>
              <div className="flex items-center space-x-3">
                {JSON.parse(localStorage.getItem(`data`))[0].fonction ==
                  "Administration" &&
                  (true ? (
                    <Button
                      type="default"
                      onClick={showDrawerR}
                      icon={<FileAddOutlined />}
                    >
                      Ajouter Contrat
                    </Button>
                  ) : (
                    ""
                  ))}
              </div>
              <Drawer
                title="Saisir un nouveau Contrat"
                width={720}
                onClose={onCloseR}
                closeIcon={false}
                open={open1}
                bodyStyle={{
                  paddingBottom: 80,
                }}
              >
                <div>
                  <Box sx={{ maxWidth: 800 }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel
                            optional={
                              index === 2 ? (
                                <Typography variant="caption">
                                  Dernière étape
                                </Typography>
                              ) : null
                            }
                          >
                            {step.label}
                          </StepLabel>
                          <StepContent>
                            <Typography>{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                              <div>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  {index === steps.length - 1
                                    ? "Terminer"
                                    : "Continuer"}
                                </Button>
                                <Button
                                  className="ml-3 mt-3"
                                  disabled={index === 0}
                                  onClick={handleBack}
                                  sx={{ mt: 1, mr: 1, ml: 2 }}
                                >
                                  Retour
                                </Button>
                              </div>
                            </Box>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                    {activeStep === steps.length && (
                      <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>
                          Toutes les étapes sont terminées
                        </Typography>
                        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                          Réinitialiser
                        </Button>
                      </Paper>
                    )}
                  </Box>
                </div>
              </Drawer>
            </>
          </div>
        </div>
        <Table
          pagination={{
            pageSize: 7,
            showQuickJumper: true,
          }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          size="small"
          className="w-full mt-5"
          columns={columns}
          dataSource={filteredData}
          loading={Loading}
        />
      </ConfigProvider>
    </div>
  );
};

export default TableContract;
