import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  NotificationOutlined,
  TransactionOutlined,
  HomeOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  TeamOutlined,
  ReadOutlined,
  UsergroupAddOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  UserOutlined,
  FieldTimeOutlined,
  DollarOutlined,
  FileProtectOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Button,
  Card,
  Typography,
  Switch,
  Space,
  Tooltip,
} from "antd";
import TablePeriod from "../components/screens/peroid";
import TableContractStaff from "../components/screens/contratStaff";
import TablePayemnt from "../components/screens/payment";
import TableStaff from "../components/screens/staff";
import { toCapitalize } from "../utils/helper";
import TableContract from "../components/screens/contarClient";
import TableAffiliation from "../components/screens/affiliation";
import TableParent from "../components/screens/parents";
import TableStudent from "../components/screens/students";
import TableReservation from "../components/screens/reservations";
import TableClasse from "../components/screens/class";
import TableAbonnement from "../components/screens/abonnement";
import TableEtablissement from "../components/screens/etab";
import TableNotification from "../components/screens/notifications";
import DashboardInterface from "../components/screens/dashboard";
import TableSalle from "../components/screens/salle";
import TableCours from "../components/screens/cours";
import TableTransication from "../components/screens/transactions";
import TableReservationCoachs from "../components/screens/presense";
import Quiz from "../components/screens/quiz";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["gestionEtablissement"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("interface_etablissement");
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token == null) {
        navigate("/");
      }
    };

    handleLogout();
  }, [navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    if (true) {
      setUserRole(userData[0].fonction);
      if (userData[0].fonction == "Prof") {
        setSelectedMenu("interface_presence");
      }
    }
  });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Gestion Etablissement menu - only for admin
  const gestionEtablissementMenu = {
    key: "gestionEtablissement",
    icon: <HomeOutlined />,
    label: "GESTION ÉTABLISSEMENT",
    children: [
      {
        key: "interface_etablissement",
        icon: <HomeOutlined />,
        label: "ÉTABLISSEMENT",
      },
      {
        key: "interface_dashboard",
        icon: <DashboardOutlined />,
        label: "DASHBOARD",
      },
      {
        key: "interface_notification",
        icon: <NotificationOutlined />,
        label: "NOTIFICATION",
      },
      {
        key: "interface_transaction",
        icon: <TransactionOutlined />,
        label: "TRANSACTION",
      },
      {
        key: "interface_salle",
        icon: <HomeOutlined />,
        label: "SALLE",
      },
      {
        key: "interface_abonnement",
        icon: <CreditCardOutlined />,
        label: "ABONNEMENT",
      },
    ],
  };

  const professorPlanificationMenu = {
    key: "gestionPlanification",
    icon: <CalendarOutlined />,
    label: "GESTION PLANIFICATION",
    children: [
      {
        key: "interface_planning",
        icon: <CalendarOutlined />,
        label: "PLANNING",
      },
      {
        key: "interface_presence",
        icon: <TeamOutlined />,
        label: "PRÉSENCE",
      },
      {
        key: "interface_cours",
        icon: <ReadOutlined />,
        label: "COURS",
      },
      {
        key: "interface_classes",
        icon: <BookOutlined />,
        label: "CLASSES",
      },
    ],
  };

  const adminPlanificationMenu = {
    key: "gestionPlanification",
    icon: <CalendarOutlined />,
    label: "GESTION PLANIFICATION",
    children: [
      {
        key: "interface_reservation",
        icon: <CalendarOutlined />,
        label: "PLANNING",
      },
      {
        key: "interface_presence",
        icon: <TeamOutlined />,
        label: "PRÉSENCE",
      },
      {
        key: "interface_cours",
        icon: <ReadOutlined />,
        label: "COURS",
      },
      {
        key: "interface_classes",
        icon: <BookOutlined />,
        label: "CLASSES",
      },
    ],
  };

  const studentManagementMenu = {
    key: "gestionEtudiants",
    icon: <UsergroupAddOutlined />,
    label: "GESTION DES ÉTUDIANTS",
    children: [
      {
        key: "interface_Etudiants",
        icon: <UserOutlined />,
        label: "ÉTUDIANTS",
      },
      {
        key: "interface_Parents",
        icon: <TeamOutlined />,
        label: "PARENTS",
      },
      {
        key: "interface_Affiliation",
        icon: <ApartmentOutlined />,
        label: "AFFILIATION",
      },
      {
        key: "contrat_Etudiant",
        icon: <FileTextOutlined />,
        label: "CONTRAT ÉTUDIANT",
      },
    ],
  };

  const personnelMenuItem = {
    key: "gestionPersonnel",
    icon: <TeamOutlined />,
    label: "GESTION DU PERSONNEL",
    children: [
      {
        key: "interface_Staff",
        icon: <UserOutlined />,
        label: "STAFF",
      },
      {
        key: "interface_Periode",
        icon: <FieldTimeOutlined />,
        label: "PÉRIODE",
      },
      {
        key: "interface_Payement",
        icon: <DollarOutlined />,
        label: "PAIEMENT",
      },
      {
        key: "Contrat_Salarier",
        icon: <FileProtectOutlined />,
        label: "CONTRAT SALARIÉ",
      },
    ],
  };

  const menuItems =
    userRole === "Administration" || userRole === "Secrétaire"
      ? [
          gestionEtablissementMenu,
          adminPlanificationMenu,
          studentManagementMenu,
          personnelMenuItem,
          {
            key: "interface_quiz",
            icon: <FileTextOutlined />,
            label: "QUIZ",
          },
        ]
      : userRole === "Prof"
      ? [
          {
            key: "interface_presence",
            icon: <TeamOutlined />,
            label: "PRÉSENCE",
          },
        ]
      : [adminPlanificationMenu, studentManagementMenu];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (
      latestOpenKey &&
      menuItems.map((item) => item.key).indexOf(latestOpenKey) === -1
    ) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "interface_etablissement":
        return <TableEtablissement darkmode={isDarkMode} />;
      case "interface_dashboard":
        return <DashboardInterface darkmode={isDarkMode} />;
      case "interface_notification":
        return <TableNotification darkmode={isDarkMode} />;
      case "interface_transaction":
        return <TableTransication darkmode={isDarkMode} />;
      case "interface_salle":
        return <TableSalle darkmode={isDarkMode} />;
      case "interface_abonnement":
        return <TableAbonnement darkmode={isDarkMode} />;
      case "interface_reservation":
      case "interface_planning":
        return <TableReservation darkmode={isDarkMode} />;
      case "interface_presence":
        return <TableReservationCoachs darkmode={isDarkMode} />;
      case "interface_cours":
        return <TableCours darkmode={isDarkMode} />;
      case "interface_classes":
        return <TableClasse darkmode={isDarkMode} />;
      case "interface_Etudiants":
        return <TableStudent darkmode={isDarkMode} />;
      case "interface_Parents":
        return <TableParent darkmode={isDarkMode} />;
      case "interface_Affiliation":
        return <TableAffiliation darkmode={isDarkMode} />;
      case "contrat_Etudiant":
        return <TableContract darkmode={isDarkMode} />;
      case "interface_Staff":
        return <TableStaff darkmode={isDarkMode} />;
      case "interface_Periode":
        return <TablePeriod darkmode={isDarkMode} />;
      case "interface_Payement":
        return <TablePayemnt darkmode={isDarkMode} />;
      case "Contrat_Salarier":
        return <TableContractStaff darkmode={isDarkMode} />;
      case "interface_quiz":
        return <Quiz darkmode={isDarkMode} />;
      default:
        return (
          <Card title="Welcome" bordered={false}>
            <p>Please select a menu item to view content.</p>
          </Card>
        );
    }
  };

  const getMenuLabel = () => {
    // Handle the special case for Prof role with direct menu item
    if (userRole === "Prof" && selectedMenu === "interface_presence") {
      return "PRÉSENCE";
    }

    // Search through all menu items and their children
    for (const menu of menuItems) {
      // Check if it's a menu with children
      if (menu.children) {
        const foundChild = menu.children.find(
          (child) => child.key === selectedMenu
        );
        if (foundChild) {
          return foundChild.label;
        }
      }
      // Check if it's a direct menu item
      else if (menu.key === selectedMenu) {
        return menu.label;
      }
    }
    return "Dashboard"; // Default fallback
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  const toggleDarkMode = (checked) => {
    setIsDarkMode(checked);
    document.body.classList.toggle("dark-mode", checked);
  };

  return (
    <Layout
      style={{ minHeight: "100vh" }}
      className={isDarkMode ? "dark-mode" : ""}
    >
      <Sider
        className="shadow-sm"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={230}
        collapsedWidth={80}
        style={{
          backgroundColor: isDarkMode ? "#000C17" : "white",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {collapsed ? (
          ""
        ) : (
          <div className="bg-white rounded-md">
            <img
              style={{ margin: "14px 20px" }}
              width={140}
              src="./src/assets/logo.png"
              alt="Logo"
            />
          </div>
        )}
        <div className="w-full">
          <Menu
            theme={isDarkMode ? "dark" : "light"}
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            defaultSelectedKeys={["interface_planning"]}
            className="mt-5"
            items={menuItems}
            onSelect={({ key }) => setSelectedMenu(key)}
            style={{
              fontSize: "13px",
              width: collapsed ? 80 : 230,
            }}
          />
        </div>
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 230,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          className="shadow-sm"
          style={{
            padding: "0 16px",
            background: isDarkMode ? "#000C17" : "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            width: `calc(100% - ${collapsed ? 80 : 230}px)`,
            zIndex: 1,
            transition: "width 0.2s",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="pt-10"
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: isDarkMode ? "white" : "inherit",
              paddingTop: 10,
            }}
          />
          <div
            style={{ color: isDarkMode ? "white" : "black" }}
            className="text-base font-medium"
          >
            {getMenuLabel()}
          </div>
          <Space>
            <Tooltip title="🌙/☀️ Mode">
              <Switch
                checkedChildren="🌙"
                unCheckedChildren="☀️"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
            </Tooltip>
            <Tooltip title="Déconnecté">
              <Button
                danger={true}
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{
                  fontSize: "16px",
                  color: isDarkMode ? "white" : "#000C17",
                }}
              />
            </Tooltip>
          </Space>
        </Header>
        <Content
          className={isDarkMode ? "bg-slate-800" : ""}
          style={{
            padding: "64px 16px 16px 26px",
            minHeight: 280,
            overflow: "initial",
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
