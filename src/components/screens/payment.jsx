import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  message,
  Drawer,
  Button,
  Modal,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  PrinterOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { handlePrintPayment } from "../../utils/printable/payment";
// import { handlePrintPayment } from "../../../utils/printable/payment";
import { addNewTrace, getCurrentDate } from "../../utils/helper";
import { Endpoint } from "../../utils/endpoint";

const TablePayemnt = ({ darkmode }) => {
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
  const [tarif, setTarif] = useState(0);
  const [add, setAdd] = useState(0);
  const [staffOptions, setStaffOptions] = useState([]);
  const [contract, setcontarct] = useState([]);
  const [contractFilter, setcontarctFilter] = useState([]);
  const [peried, setPeriod] = useState([]);
  const [periedFilter, setPeriodFilter] = useState([]);
  const [StaffFilter, setStaffFilter] = useState([]);
  const [contarctClient, setcontarctClient] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState(null);
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [columnFilterText, setColumnFilterText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sorterInfo, setSorterInfo] = useState({});

  // State for contract related data
  const [PaymentData, setPaymentData] = useState({
    id_contrat: null,
    periode: null,
    salaire: null,
    prime: 0.0,
    nom_periode: "",
    staff: "",
    fonction: "",
    image: "",
    type: "",
    nom_contrat: "",
    salaire_final: 0.0, // Add this line
  });

  const handleViewPaymentData = (record) => {
    setSelectedPaymentData(record);
    setIsModalVisible(true);
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(
        Endpoint()+"/api/Parentt/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        }
      );
      const data = await response.json();
      setClients(data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchAbonnements = async () => {
    try {
      const response = await fetch(
        Endpoint()+"/api/abonnement/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        }
      );
      const data = await response.json();
      setAbonnements(data.data);
    } catch (error) {
      console.error("Error fetching abonnements:", error);
    }
  };

  const handlePrint = () => {
    console.log("====================================");
    console.log();
    console.log("====================================");
    selectedRowKeys.map(async (key) => {
      const ContractData = data.find((client) => client.key === key);
      console.log("====================================");
      console.log(ContractData);
      console.log("====================================");
      const Client = contractFilter.filter(
        (client) => client.id_contratStaff === ContractData.id_contrat
      );
      console.log("====================================");
      console.log(Client.id_employe);
      console.log("====================================");
      const salaire = contarctClient.filter(
        (client) => client.id_employe === Client.id_employe
      );
      console.log(salaire);
      handlePrintPayment(ContractData, Client);
    });
  };

  useEffect(() => {
    // console.log(JSON.stringify(localStorage.getItem("data")));
    fetchClients();
    fetchAbonnements();
    const adminData = JSON.parse(localStorage.getItem("data"));
    const initialAdminId = adminData ? adminData[0].id_admin : ""; // Accessing the first element's id_admin
    // ContractData.id_admin = initialAdminId;
  }, []);

  // Validation function to check if all required fields are filled for the contract form
  const isContractFormValid = () => {
    return true;
  };

  // Function to add a new contract
  const addContract = async () => {
    const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
    const adminData = JSON.parse(localStorage.getItem("data"));
    const initialAdminId = adminData ? adminData[0].id_admin : "";

    const updatedPaymentData = {
      ...PaymentData,
      salaire_base: PaymentData.salaire,
      salaire_final: PaymentData.salaire_final
        ? PaymentData.salaire_final
        : parseInt(PaymentData.salaire) + parseInt(PaymentData.prime),
      id_admin: initialAdminId,
    };

    try {
      const response = await fetch(
        Endpoint()+"/api/salaire/ ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
          body: JSON.stringify(updatedPaymentData),
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res.msg === "Added Successfully!!e") {
          message.success("Paiement ajouté avec succès");
          setAdd(Math.random() * 1000);
          onCloseR();
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_admin,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(updatedPaymentData)}`,
            "paiement"
          );
        } else if (
          res.errors.non_field_errors[0] ==
          "The fields periode, id_contrat must make a unique set."
        ) {
          message.warning("Vous avez déjà été payé pour cette période.");
        } else {
          message.warning(res.msg);
          console.log(res);
        }
      } else {
        console.log(response);
        message.error("Error adding");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred:", error);
    }
  };

  const showDrawerR = () => {
    setOpen1(true);
  };

  const onCloseR = () => {
    setOpen1(false);
    setActiveStep(0);
    setPaymentData({
      id_contrat: null,
      periode: null,
      salaire: null,
      prime: 0.0,
      nom_periode: "",
      staff: "",
      fonction: "",
      image: "",
      type: "",
      nom_contrat: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          Endpoint()+"/api/staff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        setStaffFilter(jsonData.data);
        // Create options for the staff Select
        const staffOptionss = jsonData.data.map((staff) => ({
          value: staff.id_employe, // Assuming staff has an 'id' property
          label: staff.nom + " " + staff.prenom, // Assuming staff has a 'name' property
        }));
        setStaffOptions(staffOptionss);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          Endpoint()+"/api/contratstaff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        setcontarctFilter(jsonData.data);
        // Create options for the staff Select
        const staffOptionss = jsonData.data.map((staff) => ({
          value: staff.id_employe, // Assuming staff has an 'id' property
          label: staff.type_contrat, // Assuming staff has a 'name' property
        }));
        setcontarct(staffOptionss);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          Endpoint()+"/api/periode/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        setPeriodFilter(jsonData.data);
        // Create options for the staff Select
        const staffOptionss = jsonData.data.map((staff) => ({
          value: staff.id_periode, // Assuming staff has an 'id' property
          label: staff.PeriodeSalaire, // Assuming staff has a 'name' property
        }));
        setPeriod(staffOptionss);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // stepper
  const steps = [
    {
      label: "Informations de Paiement",
      description: (
        <div className="w-full grid grid-cols-2 gap-4 mt-5">
          <div>
            <div>Salaries</div>
            <Select
              id="Salaries"
              showSearch
              value={PaymentData.staff} // Use the staff property as the value
              placeholder="Salaries"
              className="w-full"
              optionFilterProp="children"
              onChange={(value, option) => {
                const salaire = contractFilter.find(
                  (val) => val.id_employe === value
                );
                const staff = StaffFilter.find(
                  (val) => val.id_employe === value
                );
                if (salaire && staff) {
                  setPaymentData((prevPaymentData) => ({
                    ...prevPaymentData,
                    salaire: salaire.salaire,
                    fonction: staff.fonction,
                    type: salaire.type_contrat,
                    id_contrat: salaire.id_contratStaff,
                    staff: salaire.employe,
                    nom_contrat: salaire.type_contrat,
                  }));
                } else {
                  message.warning(
                    "Ce client n'a pas de contrat, veuillez en créer un pour lui/elle"
                  );
                  setPaymentData({
                    id_contrat: null,
                    periode: null,
                    salaire: null,
                    prime: 0.0,
                    nom_periode: "",
                    staff: "",
                    fonction: "",
                    image: "",
                    type: "",
                    nom_contrat: "",
                  });
                }
              }}
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
              options={staffOptions}
            />
          </div>
          <div>
            <div>Contrat</div>
            <Select
              id="Contrat"
              showSearch
              placeholder="Contrat"
              className="w-full"
              disabled={true}
              value={PaymentData.nom_contrat}
              // value={PaymentData.id_contrat != null ?PaymentData.staff:""}
              optionFilterProp="children"
              onChange={(value, option) => {
                // PaymentData.id_contrat = value;
              }}
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
              options={contract}
            />
          </div>
          <div>
            <div>Salaire</div>
            <Input value={PaymentData.salaire} readOnly />
          </div>
          <div>
            <div>Prime</div>
            <Input
              value={PaymentData.prime}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Check if the input is a valid number or empty
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  // Update state only if the input is valid
                  setPaymentData((prevPaymentData) => ({
                    ...prevPaymentData,
                    prime: inputValue,
                  }));
                }
                // You can optionally show an error message or handle the invalid input case here
              }}
            />
          </div>
          <div>
            <div>Period</div>
            <Select
              id="Period"
              showSearch
              value={PaymentData.nom_periode}
              placeholder="Period"
              className="w-full"
              optionFilterProp="children"
              onChange={(value, option) => {
                setPaymentData((prevPaymentData) => ({
                  ...prevPaymentData,
                  periode: value,
                  nom_periode: option.label,
                }));
              }}
              options={peried}
            />
          </div>
        </div>
      ),
    },
    {
      label: "Ajouter un Paiement",
      description: (
        <div>
          <div>Salaire final</div>
          <Input
            disabled={false}
            value={parseInt(PaymentData.salaire) + parseInt(PaymentData.prime)}
            onChange={(e) =>
              setPaymentData((prevPaymentData) => ({
                ...prevPaymentData,
                salaire_final:
                  parseInt(e.target.value) + parseInt(PaymentData.prime),
              }))
            }
          />{" "}
        </div>
      ),
    },
    {
      label: "",
      description: (
        <div>
          <div className="mt-4">
            <h2>Paiement</h2>
            <div className="flex items-center space-x-1">
              <div className="font-semibold">Staff:</div>
              <div>{PaymentData.staff}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="font-semibold">Salaries:</div>
              <div>{parseInt(PaymentData.salaire)}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="font-semibold">Prime:</div>
              <div>{PaymentData.prime}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="font-semibold">Period:</div>
              <div>{PaymentData.nom_periode}</div>
            </div>
          </div>
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
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSorterInfo(sorter);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          Endpoint()+"/api/salaire/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const jsonData = await response.json();

        const processedData = jsonData.data.map((item, index) => ({
          ...item,
          key: item.id_trans,
        }));
        setData(processedData);
        setFilteredData(processedData);

        const desiredKeys = ["nom_periode", "staff", "fonction", "type"];
        const generatedColumns = desiredKeys.map((key) => ({
          title: capitalizeFirstLetter(
            {
              nom_periode: "Période",
              staff: "Personnel",
              fonction: "Fonction",
              type: "Type",
            }[key]
          ),
          dataIndex: key,
          key,
          filters: Array.from(
            new Set(processedData.map((item) => item[key]))
          ).map((value) => ({ text: value, value })),
          filteredValue: filteredInfo[key] || null,
          render: (text, record) => {
            if (key === "salaire_final") {
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

        generatedColumns.push({
          title: "Salaire final",
          key: "salaireEtPrime",
          render: (text, record) => record.salaire + (record.prime || 0),
        });

        generatedColumns.push({
          title: "",
          key: "actions",
          render: (text, record) => (
            <EyeOutlined
              style={{ cursor: "pointer" }}
              onClick={() => handleViewPaymentData(record)}
            />
          ),
        });

        setColumns(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  useEffect(() => {
    if (data.length > 0) {
      let newFilteredData = data;

      Object.keys(filteredInfo).forEach((key) => {
        const filterValues = filteredInfo[key];
        if (filterValues && filterValues.length > 0) {
          newFilteredData = newFilteredData.filter((item) =>
            filterValues.includes(item[key])
          );
        }
      });

      // Apply sorting if sorterInfo is available
      if (sorterInfo.column) {
        newFilteredData.sort((a, b) => {
          const result = a[sorterInfo.field] > b[sorterInfo.field] ? 1 : -1;
          return sorterInfo.order === "descend" ? -result : result;
        });
      }

      setFilteredData(newFilteredData);
    }
  }, [filteredInfo, sorterInfo, data]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          Endpoint()+"/api/staff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        setcontarctClient(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
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
      item.staff.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };
  const handleColumnFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setColumnFilterText(value);
    const filtered = data.filter((item) =>
      item.columnName.toLowerCase().includes(value)
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
            `${Endpoint()}/api/salaire/${ContractData.id}`,
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
        });

        await Promise.all(promises);

        const updatedData = data.filter(
          (client) => !selectedRowKeys.includes(client.key)
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setSelectedRowKeys([]);
        message.success(
          `${selectedRowKeys.length} client(s) deleted successfully`
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
          title="Détails de paiement"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Table
            columns={[
              {
                title: "Staff",
                dataIndex: "staff",
                key: "staff",
              },
              {
                title: "Salaires",
                dataIndex: "salaire",
                key: "salaire",
                render: (text) => parseInt(text),
              },
              {
                title: "Prime",
                dataIndex: "prime",
                key: "prime",
              },
              {
                title: "Période",
                dataIndex: "nom_periode",
                key: "nom_periode",
              },
            ]}
            dataSource={selectedPaymentData ? [selectedPaymentData] : []}
            pagination={false}
            rowKey="id_paiement"
          />
        </Modal>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-7">
            <div className="w-52">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search Paiement"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-6">
              {selectedRowKeys.length === 1 ? "" : ""}
              {/* {selectedRowKeys.length >= 1 ? (
              <Popconfirm
                title="Delete Paiement"
                description="Are you sure to delete this Paiement?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className="cursor-pointer" />{" "}
              </Popconfirm>
            ) : (

              ""
            )} */}
              {true && selectedRowKeys.length >= 1 ? (
                <PrinterOutlined onClick={handlePrint} disabled={true} />
              ) : (
                ""
              )}
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
                      Ajouter Paiement
                    </Button>
                  ) : (
                    ""
                  ))}
              </div>
              <Drawer
                title="Saisir un nouveau Paiement"
                width={720}
                onClose={onCloseR}
                closeIcon={false}
                open={open1}
                bodyStyle={{
                  paddingBottom: 80,
                }}
              >
                <div>
                  <Box sx={{ maxWidth: 400 }}>
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
                          Toutes les étapes sont terminées - vous avez fini
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
          onChange={handleChange}
        />
      </ConfigProvider>
    </div>
  );
};

export default TablePayemnt;
