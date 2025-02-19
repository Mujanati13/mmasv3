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
  Card,
  Segmented,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  DeleteOutlined,
  PrinterOutlined,
  EditOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import {
  getCurrentDate,
  convertToDateTime,
  getTimeInHHMM,
  formatDateToYearMonthDay,
  getDayNameInFrench,
  addNewTrace,
  getTimes,
  parseSeance,
} from "../../utils/helper";
import Paper from "@mui/material/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Appointments,
  WeekView,
  EditRecurrenceMenu,
  AllDayPanel,
  ConfirmationDialog,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import dayjs from "dayjs";
import { Endpoint } from "../../utils/endpoint";

const TableReservation = ({ darkmode }) => {
  const [data2, setData2] = useState([]);
  const [currentDate] = useState(getCurrentDate());
  const [addedAppointment, setAddedAppointment] = useState({});
  const [appointmentChanges, setAppointmentChanges] = useState({});
  const [editingAppointment, setEditingAppointment] = useState(undefined);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [changedFields, setChangedFields] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [filters, setFilters] = useState({
    cour: [],
    coach: [],
    salle: [],
    jour: [],
  });
  const getUniqueColumnValues = (dataIndex) => {
    return [...new Set(data.map((item) => item[dataIndex]))];
  };
  const commitChanges = ({ added, changed, deleted }) => {
    setData2((prevData) => {
      let updatedData = prevData;
      if (added) {
        const startingAddedId =
          updatedData.length > 0
            ? updatedData[updatedData.length - 1].id + 1
            : 0;
        updatedData = [...updatedData, { id: startingAddedId, ...added }];
      }
      if (changed) {
        updatedData = updatedData.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        updatedData = updatedData.filter(
          (appointment) => appointment.id !== deleted
        );
      }
      return updatedData;
    });
  };

  const openCustomForm = async (appointmentData) => {
    const clientToEdit = data.find(
      (client) => client.id_seance == appointmentData.id
    );
    if (clientToEdit) {
      setEditingClient(clientToEdit);
      form.setFieldsValue(clientToEdit);

      // Fetch available salles and coaches before opening the modal
      await checkAndFetchAvailability2(
        clientToEdit.jour,
        clientToEdit.heure_debut,
        clientToEdit.heure_fin
      );

      setIsModalVisible(true);
    } else {
      // If it's a new appointment
      const newAppointment = {
        startDate: appointmentData.startDate,
        endDate: appointmentData.endDate,
      };
      setClientData({
        ...ClientData,
        heure_debut: getTimeInHHMM(newAppointment.startDate),
        heure_fin: getTimeInHHMM(newAppointment.endDate),
        date_reservation: formatDateToYearMonthDay(newAppointment.startDate),
        day_name: getDayNameInFrench(newAppointment.startDate).jour,
        jour: getDayNameInFrench(newAppointment.startDate).index,
      });
      setOpen1(true);
    }
  };

  //
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [editingClient, setEditingClient] = useState({
    id_cour: null,
    id_coach: null,
    id_salle: null,
    capacity: null,
    jour: null,
    heure_debut: null,
    heure_fin: null,
    cour: "",
    coach: "",
    salle: "",
    genre: "",
    day_name: "",
    date_reservation: getCurrentDate(),
    nb_reservations: 0,
  });
  const [update, setUpdate] = useState(null);
  const [form] = Form.useForm();
  const [open1, setOpen1] = useState(false);
  const [add, setAdd] = useState(false);
  const [Coach, setCoach] = useState([]);
  const [Cours, setCours] = useState([]);
  const [Salle, setSalle] = useState([]);
  const [SalleDetils, setSalleDetils] = useState([]);
  const [CourDetils, setCourDetils] = useState([]);
  const [display, setDisplay] = useState(true);
  const [displayValue, setDisplayValue] = useState("Tableau");
  const id_staff = JSON.parse(localStorage.getItem("data"));
  const [disableSalleCoach, setDisableSalleCoach] = useState(true);
  const [occupiedSessions, setOccupiedSessions] = useState([]);
  const [availableSalles, setAvailableSalles] = useState([]);
  const [availableCoaches, setAvailableCoaches] = useState([]);
  const [timeError, setTimeError] = useState("");
  const [clients, setClients] = useState([]);
  const [currentClient, setcurrentClient] = useState("");
  const [isReservationDrawerVisible, setIsReservationDrawerVisible] =
    useState(false);
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(selectedSeance);

      setLoading(true);
      try {
        const response = await fetch(
          Endpoint() +
            "/api/Etudiant_by_resevation_id?id_seance=" +
            selectedSeance.id,
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        setClients(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedSeance]);

  const handleReservationClick = (seanceId) => {
    const seance = data2.find((item) => item.id === seanceId);
    setSelectedSeance(seance);
    setIsReservationDrawerVisible(true);
  };

  // Update the state to handle multiple selected clients

  // Update the handleReservationSubmit function to handle multiple clients
  const handleReservationSubmit = async () => {
    if (selectedClients.length === 0) {
      message.error("Veuillez sélectionner au moins un client");
      return;
    }

    const authToken = localStorage.getItem("jwtToken");
    const { startTime, endTime } = getTimes(selectedSeance);

    try {
      // Create an array of promises for each client reservation
      const reservationPromises = selectedClients.map(async (clientId) => {
        const response = await fetch(Endpoint() + "/api/Conditio_reserv/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            id_seance: selectedSeance.id,
            id_etd: clientId,
            date_reservation: getCurrentDate(),
            date_presence: startTime.start,
            heure_debut: startTime,
            heure_fin: endTime,
            statut: "confirmé",
          }),
        });

        return response.json();
      });

      // Wait for all reservations to complete
      const results = await Promise.all(reservationPromises);

      // Check if any reservations were successful
      const successfulReservations = results.filter(
        (result) => result.msg === "Added Successfully!!"
      );

      if (successfulReservations.length > 0) {
        message.success(
          `${successfulReservations.length} réservation(s) ajoutée(s) avec succès`
        );
      }

      // Show warnings for any failed reservations
      results.forEach((result) => {
        if (result.msg !== "Added Successfully!!") {
          message.warning(result.msg);
        }
      });

      setIsReservationDrawerVisible(false);
      setSelectedClients([]);
      form.resetFields();
      onClose();
      fetchData();
    } catch (error) {
      console.error("Error making reservations:", error);
      // message.error("Une erreur est survenue lors des réservations");
    }
  };

  // State for room related data
  const [ClientData, setClientData] = useState({
    id_cour: null,
    id_coach: null,
    id_employe: id_staff[0].id_employe,
    id_salle: null,
    capacity: null,
    jour: null,
    heure_debut: null,
    heure_fin: null,
    cour: "",
    coach: "",
    salle: "",
    genre: "",
    day_name: "",
    date_reservation: getCurrentDate(),
    nb_reservations: 0,
  });

  const handelDisplay = () => {
    setDisplay(!display);
  };

  const handleEmptyCellClick = (startDate) => {
    const newAppointment = {
      startDate,
      endDate: new Date(startDate.getTime() + 60 * 60 * 1000), // default to 30 minutes later
    };
    ClientData.heure_debut = getTimeInHHMM(newAppointment.startDate);
    ClientData.heure_fin = getTimeInHHMM(newAppointment.endDate);
    ClientData.date_reservation = formatDateToYearMonthDay(
      newAppointment.startDate
    );
    ClientData.day_name = getDayNameInFrench(newAppointment.startDate).jour;
    ClientData.jour = getDayNameInFrench(newAppointment.startDate).index;
    console.log(getTimeInHHMM(newAppointment.startDate));
    setOpen1(true);
    openCustomForm(newAppointment);
  };
  // Validation function to check if all required fields are filled for the room form
  const isRoomFormValid = () => {
    return (
      ClientData.id_cour !== null &&
      ClientData.id_coach !== null &&
      ClientData.id_salle !== null &&
      ClientData.capacity !== null &&
      ClientData.jour !== null &&
      ClientData.heure_debut !== null &&
      ClientData.heure_fin !== null &&
      ClientData.cour !== "" &&
      ClientData.coach !== "" &&
      ClientData.salle !== "" &&
      ClientData.genre !== ""
    );
  };

  const isValidTimeRange = () => {
    if (ClientData.heure_debut && ClientData.heure_fin) {
      const startTime = new Date(`2000-01-01T${ClientData.heure_debut}`);
      const endTime = new Date(`2000-01-01T${ClientData.heure_fin}`);
      return endTime > startTime;
    }
  };

  const checkAndFetchAvailability2 = async (jour, heure_debut, heure_fin) => {
    // Input validation
    if (!jour || !heure_debut || !heure_fin) {
      setDisableSalleCoach(true);
      return;
    }
  
    try {
      // Fetch availability data
      const response = await fetch(
        `${Endpoint()}/api/sallesdispo/?jour=${jour}&heur_debut=${heure_debut}&heur_fin=${heure_fin}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setOccupiedSessions(data.data);
  
      // Filter available salles and coaches
      const availableSalles = Salle.filter(
        (salle) => !data.data.data.some((session) => session.id_salle === salle.value)
      );
  
      const availableCoaches = Coach.filter(
        (coach) => !data.data.data.some((session) => session.id_coach === coach.value)
      );
  
      // Handle editing mode
      if (editingClient) {
        // Check if current selections are still available
        const isCurrentSalleAvailable = availableSalles.some(
          (salle) => salle.value === editingClient.id_salle
        );
        const isCurrentCoachAvailable = availableCoaches.some(
          (coach) => coach.value === editingClient.id_coach
        );
  
        // Handle unavailable salle
        if (!isCurrentSalleAvailable && editingClient.id_salle) {
          message.warning("La salle sélectionnée n'est plus disponible");
          setEditingClient((prev) => ({
            ...prev,
            id_salle: null,
            salle: "",
            capacity: null,
          }));
        }
  
        // Handle unavailable coach
        if (!isCurrentCoachAvailable && editingClient.id_coach) {
          message.warning("Le coach sélectionné n'est plus disponible");
          setEditingClient((prev) => ({
            ...prev,
            id_coach: null,
            coach: "",
          }));
        }
      }
  
      // Update available options
      setAvailableSalles(availableSalles);
      setAvailableCoaches(availableCoaches);
      setDisableSalleCoach(false);
  
    } catch (error) {
      console.error("Error fetching availability:", error);
      // message.error("Erreur lors de la vérification des disponibilités");
      setDisableSalleCoach(true);
    }
  };
  // Function to add a new chamber
  const addClient = async () => {
    const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token
    try {
      // Check if the form is valid before submitting
      if (!isRoomFormValid()) {
        message.warning("Remplissez tous les champs obligatoires");
        return;
      }

      if (!isValidTimeRange()) {
        message.warning("L'heure de fin doit être après l'heure de début");
        return;
      }
      const id_staff = JSON.parse(localStorage.getItem("data"));
      const response = await fetch(Endpoint() + "/api/seance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
        },
        body: JSON.stringify(ClientData),
      });
      if (response.ok) {
        const res = await response.json();
        if (res.msg == "Added successfully!!") {
          message.success("Séance ajoutée avec succès");
          setAdd(Math.random() * 1000);
          setClientData({
            id_cour: null,
            id_coach: null,
            id_salle: null,
            capacity: null,
            jour: null,
            heure_debut: null,
            heure_fin: null,
            cour: "",
            coach: "",
            salle: "",
            genre: "",
            day_name: "",
            date_reservation: getCurrentDate(),
            nb_reservations: 0,
          });
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_employe,
            "Ajout",
            getCurrentDate(),
            `${JSON.stringify(ClientData)}`,
            "seance"
          );
          onCloseR();
        } else {
          message.warning(res.msg);
          console.log(res);
        }
      } else {
        console.log(response);
        message.error("Error adding Seance");
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
    setClientData({
      id_cour: null,
      id_coach: null,
      id_salle: null,
      capacity: null,
      jour: null,
      heure_debut: null,
      heure_fin: null,
      cour: "",
      coach: "",
      salle: "",
      genre: "",
      day_name: "",
      date_reservation: getCurrentDate(),
      nb_reservations: 0,
    });
    setDisableSalleCoach(true);
  };

  // Function to handle form submission in the room drawer
  const handleRoomSubmit = () => {
    addClient();
  };

  const authToken = localStorage.getItem("jwtToken"); // Replace with your actual auth token

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await fetch(Endpoint() + "/api/seance/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const jsonData = await response.json();

        const modifiedData = jsonData.data.map((item) => ({
          ...item,
          Jour: item.day_name,
          Cours: item.cour,
        }));

        const processedData = modifiedData.map((item, index) => ({
          ...item,
          key: item.id_seance || index,
        }));

        setData(processedData);
        setFilteredData(processedData);

        const desiredKeys = [
          "Cours",
          "coach",
          "salle",
          "Jour",
          "heure_debut",
          "heure_fin",
          "capacity",
        ];

        const generatedColumns = desiredKeys.map((key) => {
          let column = {
            title: capitalizeFirstLetter(key.replace(/\_/g, " ")),
            dataIndex: key,
            key,
            render: (text) => text,
          };

          // Add filters for specific columns
          if (["Cours", "coach", "salle", "Jour"].includes(key)) {
            column = {
              ...column,
              filters: getUniqueColumnValues(key).map((value) => ({
                text: value,
                value,
              })),
              onFilter: (value, record) => record[key].indexOf(value) === 0,
            };
          }

          return column;
        });

        setColumns(generatedColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, update, add]);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("jwtToken");

      try {
        const response = await fetch(Endpoint() + "/api/seance/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        const formattedData = data.data.map((item) => {
          return {
            id: item.id_seance,
            title: item.cour,
            startDate: parseSeance(item).startDateTime,
            endDate: parseSeance(item).endDateTime,
          };
        });

        setData2(formattedData);
        console.log(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, [add, update]);

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.cour.toLowerCase().includes(value)
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

  // Modify the handleEditClick function
  const handleEditClick = async () => {
    if (selectedRowKeys.length === 1) {
      const clientToEdit = data.find(
        (client) => client.key === selectedRowKeys[0]
      );
      setEditingClient(clientToEdit);
      form.setFieldsValue(clientToEdit);
      console.log(clientToEdit.jour);

      // Fetch available salles and coaches before opening the modal
      await checkAndFetchAvailability2(
        clientToEdit.jour,
        clientToEdit.heure_debut,
        clientToEdit.heure_fin
      );

      setIsModalVisible(true);
    }
  };

  const handleModalSubmit = async () => {
    // if (!isValidTimeRange()) {
    //   message.warning("L'heure de fin doit être après l'heure de début");
    //   return;
    // }
    console.log();
    try {
      // Check if the selected salle and coach are available
      const isSalleAvailable = availableSalles.some(
        (salle) => salle.value === editingClient.id_salle
      );
      const isCoachAvailable = availableCoaches.some(
        (coach) => coach.value === editingClient.id_coach
      );

      if (!isSalleAvailable || !isCoachAvailable) {
        message.error(
          "La salle ou le coach sélectionné n'est pas disponible pour cet horaire."
        );
        return;
      }
      const response = await fetch(Endpoint() + `/api/seance/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(editingClient),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        const updatedData = data.map((client) =>
          client.key === editingClient.key ? updatedClient : client
        );
        setUpdate(updatedData);
        setData(updatedData);
        setFilteredData(updatedData);
        message.success("seance mis à jour avec succès");
        setIsModalVisible(false);
        setEditingClient({
          id_cour: null,
          id_coach: null,
          id_salle: null,
          capacity: null,
          jour: null,
          heure_debut: null,
          heure_fin: null,
          cour: "",
          coach: "",
          salle: "",
          genre: "",
          day_name: "",
          date_reservation: getCurrentDate(),
          nb_reservations: 0,
        });
        setSelectedRowKeys([]);
        const id_staff = JSON.parse(localStorage.getItem("data"));
        const res = await addNewTrace(
          id_staff[0].id_employe,
          "Modification",
          getCurrentDate(),
          `${JSON.stringify(changedFields)}`,
          "seance"
        );
        setIsFormChanged(false);
        setChangedFields([]);

        // Reset the form fields
        form.resetFields();
      } else {
        message.error("Erreur lors de la mise à jour du client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      message.error("An error occurred while updating the client");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setChangedFields([]);
    setEditingClient(null);
    setClientData({
      id_cour: null,
      id_coach: null,
      id_salle: null,
      capacity: null,
      jour: null,
      heure_debut: null,
      heure_fin: null,
      cour: "",
      coach: "",
      salle: "",
      genre: "",
      day_name: "",
      date_reservation: getCurrentDate(),
      nb_reservations: 0,
    });
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length >= 1) {
      try {
        const promises = selectedRowKeys.map(async (key) => {
          const clientToDelete = data.find((client) => client.key === key);
          console.log(clientToDelete);
          const response = await fetch(
            Endpoint() + `/api/seance/${clientToDelete.id_seance}`,
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
          const id_staff = JSON.parse(localStorage.getItem("data"));
          const res = await addNewTrace(
            id_staff[0].id_employe,
            "Supprimer",
            getCurrentDate(),
            `${JSON.stringify(ClientData)}`,
            "seance"
          );
        });

        await Promise.all(promises);

        const updatedData = data.filter(
          (client) => !selectedRowKeys.includes(client.key)
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setSelectedRowKeys([]);
        setIsModalVisible1(false);
        message.success(
          `${selectedRowKeys.length} seance(s) supprimé(s) avec succès`
        );
      } catch (error) {
        console.error("Error deleting clients:", error);
        message.error("An error occurred while deleting clients");
      }
    }
  };

  const handleDelete2 = async () => {
    if (editingClient != undefined) {
      try {
        const response = await fetch(
          Endpoint() + `/api/seance/${editingClient.id_seance}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(editingClient),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete client with key ${key}`);
        }

        const updatedData = data.filter(
          (client) => !selectedRowKeys.includes(client.key)
        );
        setData(updatedData);
        setAdd(Math.random() * 100);
        setFilteredData(updatedData);
        setSelectedRowKeys([]);
        setIsModalVisible1(false);
        message.success(`seance supprimé avec succès`);
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
    setClientData({
      id_cour: null,
      id_coach: null,
      id_salle: null,
      capacity: null,
      jour: null,
      heure_debut: null,
      heure_fin: null,
      cour: "",
      coach: "",
      salle: "",
      genre: "",
      day_name: "",
      date_reservation: getCurrentDate(),
      nb_reservations: 0,
    });
    console.log(e);
  };

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await fetch(
          Endpoint() + "/api/staff_by_type?type=prof",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
            },
          }
        );
        const jsonData = await response.json();
        const option = jsonData.data.map((coach) => {
          return {
            label: coach.nom + " " + coach.prenom,
            value: coach.id_employe,
          };
        });
        setCoach(option);
        // Ensure each row has a unique key
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await fetch(Endpoint() + "/api/cours/", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        });
        const jsonData = await response.json();
        setCourDetils(jsonData.data);
        const option = jsonData.data.map((coach) => {
          return {
            label: coach.nom_cour,
            value: coach.id_cour,
          };
        });
        setCours(option);
        // Ensure each row has a unique key
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await fetch(Endpoint() + "/api/salles/", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
          },
        });
        const jsonData = await response.json();
        setSalleDetils(jsonData.data);
        const option = jsonData.data.map((coach) => {
          return {
            label: coach.nom_salle,
            value: coach.id_salle,
          };
        });
        setSalle(option);
        // Ensure each row has a unique key
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // console.log(editingClient);

    if (editingClient != undefined) {
      checkAndFetchAvailability2(
        editingClient.jour,
        editingClient.heure_debut,
        editingClient.heure_fin,
        editingClient.id_seance
      );
    }
  }, [
    editingClient?.jour,
    editingClient?.heure_debut,
    editingClient?.heure_fin,
  ]);

  const validateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return true;

    const start = dayjs(startTime, "HH:mm");
    const end = dayjs(endTime, "HH:mm");
    const durationInMinutes = end.diff(start, "minute");

    if (durationInMinutes < 15) {
      setTimeError("La durée de la séance doit être d'au moins 15 minutes.");
      return false;
    }
    if (durationInMinutes > 180) {
      setTimeError("La durée de la séance ne peut pas dépasser 3 heures.");
      return false;
    }
    setTimeError("");
    return true;
  };

  const handleTimeChange = (time, type) => {
    const updatedClientData = { ...ClientData, [type]: time };
    setClientData(updatedClientData);
    validateDuration(
      updatedClientData.heure_debut,
      updatedClientData.heure_fin
    );
    checkAndFetchAvailability2();
  };

  const handleEditingTimeChange = (time, type) => {
    const updatedEditingClient = { ...editingClient, [type]: time };
    setEditingClient(updatedEditingClient);
    validateDuration(
      updatedEditingClient.heure_debut,
      updatedEditingClient.heure_fin
    );

    if (time !== editingClient[type]) {
      setIsFormChanged(true);
      setChangedFields((prev) => [...new Set([...prev, type])]);
    }
  };

  const AppointmentContent = ({ children, style, ...restProps }) => (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: "#FFA07A",
        borderRadius: "8px",
      }}
      onClick={() => openCustomForm(restProps.data)}
    >
      <div style={{ padding: "8px" }}>
        {children}
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleReservationClick(restProps.data.id);
          }}
          style={{ marginTop: "4px" }}
        >
          Réserver
        </Button>
      </div>
    </Appointments.Appointment>
  );

  const onClose = () => {
    setIsReservationDrawerVisible(false);
    form.resetFields();
  };

  return (
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
      <div className="w-full p-2">
        <Drawer
          title="Réserver une séance"
          placement="right"
          closable={false}
          onClose={onClose}
          visible={isReservationDrawerVisible}
          width={400}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="clients"
              label="Sélectionner les clients"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner au moins un client",
                },
              ]}
            >
              <Select
                mode="multiple"
                showSearch
                placeholder="Sélectionner les clients"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onChange={(values) => setSelectedClients(values)}
              >
                {clients.map((client) => (
                  <Select.Option
                    key={client.id_etudiant}
                    value={client.id_etudiant}
                  >
                    {`${client.nom} ${client.prenom}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item className="flex space-x-2">
              <Button type="primary" onClick={handleReservationSubmit}>
                Confirmer la réservation
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-7">
            {display ? (
              <div className="w-52">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search seance"
                  value={searchText}
                  onChange={handleSearch}
                />
              </div>
            ) : (
              ""
            )}
            {!display ? (
              <div>
                <ClockCircleOutlined />
                <span className="ml-2 font-medium">Calendrier</span>
              </div>
            ) : (
              " "
            )}
            <div className="flex items-center space-x-6">
              {selectedRowKeys.length === 1 ? (
                <EditOutlined
                  className="cursor-pointer"
                  onClick={handleEditClick}
                />
              ) : (
                ""
              )}
              {selectedRowKeys.length >= 1 ? (
                <Popconfirm
                  title="Supprimer la séance"
                  description="Êtes-vous sûr de supprimer cette séance ?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined className="cursor-pointer" />{" "}
                </Popconfirm>
              ) : (
                ""
              )}
              {/* {selectedRowKeys.length >= 1 ? (
              <PrinterOutlined disabled={true} />
            ) : (
              ""
            )} */}
            </div>
          </div>
          {/* add new client  */}
          <div>
            <div className="flex items-center space-x-3">
              <Button
                type="default"
                onClick={showDrawerR}
                icon={<UserAddOutlined />}
              >
                Ajout seance
              </Button>

              <Segmented
                onChange={(v) => {
                  setDisplay(!display);
                  setDisplayValue(v);
                }}
                value={displayValue}
                options={[
                  {
                    label: "Tableau",
                    value: "Tableau",
                    icon: <BarsOutlined />,
                  },
                  {
                    label: "Calendrier",
                    value: "Calendrier",
                    icon: <AppstoreOutlined />,
                  },
                ]}
              />
              {/* <Button type="default" onClick={handelDisplay}>
              Planing
            </Button> */}
            </div>
            <Drawer
              title="Saisir une nouvelle séance"
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
                        <label htmlFor="civilite" className="block font-medium">
                          *Cours
                        </label>
                        <Select
                          id="Cours"
                          showSearch
                          value={ClientData.cour}
                          placeholder="Cours"
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value) => {
                            const cour = CourDetils.filter(
                              (sal) => sal.id_cour === value
                            );
                            ClientData.cour = cour[0].nom_cour;
                            ClientData.genre = cour[0].genre;
                            setClientData({ ...ClientData, id_cour: value });
                          }}
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
                          options={Cours}
                        />
                      </div>
                      <div>
                        <label htmlFor="civilite" className="block font-medium">
                          *Jour de la semaine
                        </label>
                        <Select
                          id="Jour de la semaine "
                          showSearch
                          value={ClientData.day_name}
                          placeholder="Jour de la semaine "
                          className="w-full"
                          optionFilterProp="children"
                          onChange={(value, option) => {
                            setClientData({
                              ...ClientData,
                              jour: parseInt(value),
                              day_name: option.label,
                            });
                            checkAndFetchAvailability2();
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "").startsWith(input)
                          }
                          options={[
                            { label: "Lundi", value: 1 },
                            { label: "Mardi", value: 2 },
                            { label: "Mercredi", value: 3 },
                            { label: "Jeudi", value: 4 },
                            { label: "Vendredi", value: 5 },
                            { label: "Samedi", value: 6 },
                            { label: "Dimanche", value: 7 },
                          ]}
                        />
                      </div>
                      <div>
                        <label>Heure de début</label>
                        <Input
                          type="time"
                          className="w-full border border-gray-200 p-1 rounded-md"
                          value={ClientData.heure_debut}
                          onChange={(e) =>
                            handleTimeChange(e.target.value, "heure_debut")
                          }
                        />
                      </div>
                      <div>
                        <label>Heure de fin</label>
                        <Input
                          type="time"
                          className="w-full border border-gray-200 p-1 rounded-md"
                          value={ClientData.heure_fin}
                          onChange={(e) =>
                            handleTimeChange(e.target.value, "heure_fin")
                          }
                        />
                      </div>
                      {timeError && (
                        <div className="text-red-500">{timeError}</div>
                      )}

                      <div>
                        <label htmlFor="civilite" className="block font-medium">
                          *Salle
                        </label>
                        <Select
                          id="Salle"
                          value={ClientData.salle}
                          showSearch
                          placeholder="Salle"
                          className="w-full"
                          optionFilterProp="children"
                          disabled={disableSalleCoach}
                          onChange={(value, option) => {
                            const sale = SalleDetils.filter(
                              (sal) => sal.id_salle === value
                            );
                            ClientData.capacity = sale[0].capacity;
                            setClientData({
                              ...ClientData,
                              id_salle: value,
                              salle: option.label,
                            });
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={disableSalleCoach ? [] : availableSalles}
                        />
                      </div>
                      <div>
                        <label htmlFor="civilite" className="block font-medium">
                          *Coach
                        </label>
                        <Select
                          id="Coach"
                          showSearch
                          placeholder="Coach"
                          className="w-full"
                          value={ClientData.coach}
                          optionFilterProp="children"
                          disabled={disableSalleCoach}
                          onChange={(value, option) =>
                            setClientData({
                              ...ClientData,
                              id_coach: value,
                              coach: option.label,
                            })
                          }
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={disableSalleCoach ? [] : availableCoaches}
                        />
                      </div>
                      <div>
                        <label>Capacité</label>
                        <Input disabled value={ClientData.capacity} />
                      </div>
                      {/* UploadImage component already included */}
                    </div>
                  </div>
                  <Space className="mt-10">
                    <Button onClick={handleRoomSubmit} type="default">
                      Enregistrer
                    </Button>
                    <Button danger onClick={onCloseR}>
                      Annuler
                    </Button>
                  </Space>
                </div>
              </div>
            </Drawer>
          </div>
        </div>
        {display ? (
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
            onChange={(pagination, filters, sorter) => {
              setFilters(filters);
              // Apply filters to data
              let newFilteredData = data;
              Object.keys(filters).forEach((key) => {
                if (filters[key] && filters[key].length > 0) {
                  newFilteredData = newFilteredData.filter((item) =>
                    filters[key].includes(item[key])
                  );
                }
              });
              setFilteredData(newFilteredData);
            }}
          />
        ) : (
          <div className="mt-5">
            <Paper>
              <Scheduler data={data2} height={410} locale="fr-FR">
                <ViewState currentDate={currentDate} />
                <EditingState
                  onCommitChanges={commitChanges}
                  addedAppointment={addedAppointment}
                  onAddedAppointmentChange={setAddedAppointment}
                  appointmentChanges={appointmentChanges}
                  onAppointmentChangesChange={setAppointmentChanges}
                  editingAppointment={editingAppointment}
                  onEditingAppointmentChange={setEditingAppointment}
                />
                <WeekView
                  startDayHour={9}
                  endDayHour={17}
                  // excludedDays={""} // Exclude Saturday and Sunday
                  timeTableCellComponent={(props) => (
                    <WeekView.TimeTableCell
                      {...props}
                      onClick={() => handleEmptyCellClick(props.startDate)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                />
                <AllDayPanel messages={{ allDay: "Toute la journée" }} />
                <EditRecurrenceMenu />
                <ConfirmationDialog />
                <Appointments
                  appointmentComponent={(props) => (
                    <Appointments.Appointment
                      {...props}
                      onClick={() => openCustomForm(props.data)}
                    />
                  )}
                />
                <AppointmentTooltip
                  showOpenButton
                  showDeleteButton
                  onOpenButtonClick={(appointmentData) =>
                    openCustomForm(appointmentData)
                  }
                  onDeleteButtonClick={() => {
                    setEditingClient(
                      data.find(
                        (client) => client.id_seance == appointmentData.id
                      )
                    );
                    setIsModalVisible1(true);
                  }}
                />
                <Appointments appointmentComponent={AppointmentContent} />
                <AppointmentTooltip
                  showOpenButton
                  showDeleteButton
                  onOpenButtonClick={(appointmentData) =>
                    openCustomForm(appointmentData)
                  }
                />
              </Scheduler>
            </Paper>
          </div>
        )}

        <Modal
          visible={isModalVisible1}
          onCancel={() => setIsModalVisible1(false)}
          okButtonProps={false}
          footer={<></>}
        >
          <Card
            className="w-full"
            title="Information seance"
            actions={[
              <Popconfirm
                title="Supprimer la séance"
                description="Êtes-vous sûr de supprimer cette séance ?"
                onConfirm={handleDelete2}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className="cursor-pointer" />
              </Popconfirm>,
              <EditOutlined
                key="edit"
                onClick={() => {
                  setIsModalVisible(true);
                  setIsModalVisible1(false);
                }}
              />,
            ]}
          >
            <div>
              <span className="font-medium">Cour</span>:{" "}
              {editingClient && editingClient.cour}
            </div>
            <div>
              <span className="font-medium">Coach</span>:{" "}
              {editingClient && editingClient.coach}
            </div>
            <div>
              <span className="font-medium">Salle</span>:{" "}
              {editingClient && editingClient.salle}
            </div>
          </Card>
        </Modal>

        <Modal
          title="Edit Seance"
          visible={isModalVisible}
          onOk={handleModalSubmit}
          onCancel={handleModalCancel}
          okButtonProps={{ disabled: !isFormChanged }}
        >
          <div className="h-96 overflow-y-auto">
            <div className="mt-5">
              <div>Cours</div>
              <Select
                id="cour"
                showSearch
                value={editingClient && editingClient.cour}
                placeholder="Cours"
                className="w-full mt-1"
                optionFilterProp="children"
                onChange={(value) => {
                  if (value !== editingClient.id_cour) {
                    setIsFormChanged(true);
                    setChangedFields((prev) => [
                      ...new Set([...prev, "id_cour", "cour", "genre"]),
                    ]);
                  }
                  const cour = CourDetils.find((sal) => sal.id_cour === value);
                  setEditingClient({
                    ...editingClient,
                    id_cour: value,
                    cour: cour ? cour.nom_cour : "",
                    genre: cour ? cour.genre : "",
                  });
                }}
                filterOption={(input, option) =>
                  (option?.label ?? "").startsWith(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={Cours}
              />
            </div>
            <div className="mt-5">
              <div>Salle</div>
              <Select
                id="Salle"
                value={editingClient && editingClient.salle}
                showSearch
                placeholder="Salle"
                className="w-full mt-1"
                optionFilterProp="children"
                onChange={(value, option) => {
                  if (value !== editingClient.id_salle) {
                    setIsFormChanged(true);
                    setChangedFields((prev) => [
                      ...new Set([...prev, "id_salle", "salle", "capacity"]),
                    ]);
                  }
                  const sale = SalleDetils.find(
                    (sal) => sal.id_salle === value
                  );
                  setEditingClient({
                    ...editingClient,
                    id_salle: value,
                    salle: option.label,
                    capacity: sale ? sale.capacity : null,
                  });
                }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={availableSalles}
              />
            </div>
            <div className="mt-5">
              <div>Coach</div>
              <Select
                id="Coach"
                showSearch
                placeholder="Coach"
                value={editingClient && editingClient.coach}
                className="w-full mt-1"
                optionFilterProp="children"
                onChange={(value, option) => {
                  if (value !== editingClient.id_coach) {
                    setIsFormChanged(true);
                    setChangedFields((prev) => [
                      ...new Set([...prev, "id_coach", "coach"]),
                    ]);
                  }
                  setEditingClient({
                    ...editingClient,
                    id_coach: value,
                    coach: option.label,
                  });
                }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={availableCoaches}
              />
            </div>
            <div className="mt-5">
              <div>Jour de la semaine</div>
              <Select
                id="Jour de la semaine "
                showSearch
                value={editingClient && editingClient.day_name}
                placeholder="Jour de la semaine "
                className="w-full mt-1"
                optionFilterProp="children"
                onChange={(value, option) => {
                  if (value !== editingClient.jour) {
                    setIsFormChanged(true);
                    editingClient.salle = "";
                    editingClient.coach = "";

                    setChangedFields((prev) => [
                      ...new Set([...prev, "jour", "day_name"]),
                    ]);
                  }
                  setEditingClient({
                    ...editingClient,
                    jour: parseInt(value),
                    day_name: option.label,
                  });
                }}
                filterOption={(input, option) =>
                  (option?.label ?? "").startsWith(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={[
                  { label: "Lundi", value: 1 },
                  { label: "Mardi", value: 2 },
                  { label: "Mercredi", value: 3 },
                  { label: "Jeudi", value: 4 },
                  { label: "Vendredi", value: 5 },
                  { label: "Samedi", value: 6 },
                  { label: "Dimanche", value: 7 },
                ]}
              />
            </div>
            <div className="mt-5">
              <label>heur de début</label>
              <div>
                <input
                  type="time"
                  value={editingClient && editingClient.heure_debut}
                  className="w-full"
                  onChange={(event) => {
                    if (event.target.value !== editingClient.heure_debut) {
                      setIsFormChanged(true);
                      editingClient.salle = "";
                      editingClient.coach = "";
                      setChangedFields((prev) => [
                        ...new Set([...prev, "heure_debut"]),
                      ]);
                    }
                    setEditingClient({
                      ...editingClient,
                      heure_debut: event.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="mt-5">
              <label>Heur de fine</label>
              <div>
                <input
                  type="time"
                  value={editingClient && editingClient.heure_fin}
                  className="w-full"
                  onChange={(event) => {
                    if (event.target.value !== editingClient.heure_fin) {
                      setIsFormChanged(true);
                      setChangedFields((prev) => [
                        ...new Set([...prev, "heure_fin"]),
                      ]);
                    }
                    editingClient.salle = "";
                    editingClient.coach = "";
                    setEditingClient({
                      ...editingClient,
                      heure_fin: event.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="mt-5">
              <label>Capacity</label>
              <Input disabled value={editingClient && editingClient.capacity} />
            </div>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default TableReservation;
