import React, { useState, useEffect, useMemo } from "react";
import {
  LogoutOutlined,
  MacCommandOutlined,
  NotificationOutlined,
  UserOutlined,
  FileOutlined,
  UsergroupAddOutlined,
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  SearchOutlined,
  FileDoneOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  SolutionOutlined,
  BankOutlined,
  ProjectOutlined,
  CheckOutlined,
  WarningOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Menu,
  Badge,
  AutoComplete,
  Input,
  Breadcrumb,
  List,
  Button,
  message,
  Tag,
  Modal,
} from "antd";

import { Endponit } from "../helper/enpoint";

import { ClientList } from "../components/en-interface/gestionClient";
import EmployeeManagement from "../components/en-interface/collaborateur";
import ClientDocumentManagement from "../components/en-interface/clientDocumen";
import AppelDOffreInterface from "../components/en-interface/add-condi";
import BonDeCommandeInterface from "../components/en-interface/bdc-list";
import ClientPartenariatInterface from "../components/en-interface/partenariat-list";
import ContractList from "../components/en-interface/contart-en";
import { isEsnLoggedIn, logoutEsn } from "../helper/db";
import { useNavigate } from "react-router-dom";
import ESNCandidatureInterface from "../components/en-interface/me-codi";
import ESNProfilePageFrancais from "../components/en-interface/profile";
// import { messaging } from "../helper/firebase/config";
// import { onMessage, getToken } from "firebase/messaging";

const NotificationInterface = ({
  notifications,
  onNotificationsUpdate,
  setupdate,
}) => {
  const [loading, setLoading] = useState(false);

  const markAsRead = async (notificationId) => {
    // setLoading(true);
    try {
      const response = await fetch(
        Endponit() + "/api/notification/" + notificationId.id,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...notificationId,
            status: "Read",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update notification status");
      }

      const updatedNotifications = notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );

      onNotificationsUpdate(updatedNotifications);
      setupdate(Math.random() * 100);
      message.success("Notification marked as read");
    } catch (error) {
      console.error("Error updating notification status:", error);
      message.error("Impossible de marquer la notification comme lue");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    // setLoading(true);
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      const updatePromises = unreadNotifications.map((notification) =>
        fetch(Endponit() + "/api/updateNotificationStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId: notification.id,
            status: "Read",
          }),
        })
      );

      await Promise.all(updatePromises);

      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }));

      onNotificationsUpdate(updatedNotifications);
      message.success("All notifications marked as read");
      setupdate(Math.random() * 100);
    } catch (error) {
      console.error("Error updating notification statuses:", error);
      message.error("Failed to mark all notifications as read");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-2xl font-semibold">Notifications</h2> */}
        <Button
          type="primary"
          onClick={markAllAsRead}
          loading={loading}
          disabled={!notifications.some((n) => !n.read)}
        >
          Marquer tout comme lu
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            className={`rounded-lg mb-2 p-4 ${
              item.read ? "bg-gray-50" : "bg-blue-50"
            }`}
            actions={[
              !item.read && (
                <Button
                  key="mark-read"
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={() => markAsRead(item)}
                  loading={loading}
                >
                  Marquer comme lu
                </Button>
              ),
            ]}
          >
            <List.Item.Meta
              className="pl-4"
              title={
                <div className="flex items-center">
                  {!item.read && (
                    <Badge
                      style={{ opacity: 0.5 }}
                      status="processing"
                      className="mr-2"
                    />
                  )}
                  <span>{item.title}</span>
                </div>
              }
              description={
                <div className="">
                  <p>{item.content}</p>
                  <small className="text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </small>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

const InterfaceEn = () => {
  const [current, setCurrent] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");
  const [breadcrumbItems, setBreadcrumbItems] = useState(["Tableau de Bord"]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [update, setupdate] = useState([]);
  const navigate = useNavigate();
  const [esnStatus, setEsnStatus] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [attemptedMenu, setAttemptedMenu] = useState("");

  // Function to check ESN status
  const checkEsnStatus = async () => {
    try {
      const response = await fetch(
        Endponit() + "/api/getEsnData/?esnId=" + localStorage.getItem("id")
      );

      if (!response.ok) {
        throw new Error("Échec de la vérification du statut");
      }

      const data = await response.json();
      setEsnStatus(
        String(data.data[0].Statut).toLowerCase() === "actif"  ? true : false
      );
      console.log('====================================');
      console.log("ESN Status:", data.data[0].Statut);
      console.log('====================================');
      console.log("ESN Status:", data.data[0].Statut);
    } catch (error) {
      console.error("Erreur de vérification du statut ESN:", error);
      message.error("Impossible de vérifier le statut du compte");
    }
  };

  // Check if menu is allowed for inactive accounts
  const isMenuAllowed = (menuKey) => {
    // Only profile is allowed for inactive accounts
    return menuKey === "Profile" || menuKey === "documents";
  };

  useEffect(() => {
    checkEsnStatus();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        Endponit() +
          "/api/getNotifications/?type=esn&id=" +
          localStorage.getItem("id")
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      const transformedNotifications = data.data.map((notification) => ({
        id: notification.id,
        type: notification.categorie.toLowerCase(),
        title: notification.categorie,
        content: notification.message,
        timestamp: notification.created_at,
        read: notification.status === "Read",
        dest_id: notification.dest_id,
        event_id: notification.event_id,
      }));
      setNotifications(transformedNotifications);

      const unreadCount = transformedNotifications.filter(
        (n) => !n.read
      ).length;
      setUnreadNotificationsCount(unreadCount);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const retrieveFCMToken = async () => {
    try {
      // const messaging = getMessaging(firebaseApp);

      // Request permission for notifications
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Get the FCM token
        // const currentToken = await getToken(messaging, {
        //   vapidKey:
        //     "BNr1YPHHD-jYLHyQcJUduQyVZA7BWGIx1q6e8m-bU442LV7Hu28P80AJyJNL998WF563PHdD97BLtZNpYJW-sSw", // Replace with your VAPID key
        // });
        // if (currentToken) {
        //   console.log("FCM Token:", currentToken);
        //   // Send the token to your backend server
        //   await fetch(
        //     Endponit() +
        //       "/api/update-token/?id=" +
        //       localStorage.getItem("id") +
        //       "&token=" +
        //       currentToken +
        //       "&type=esn",
        //     {
        //       method: "PUT",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify({
        //         id: localStorage.getItem("id"), // Replace with the user's ID
        //         token: currentToken,
        //         type: "esn",
        //         Esn: "esn",
        //       }),
        //     }
        //   );
        //   console.log("FCM token sent to the server.");
        // } else {
        //   console.log("No registration token available.");
        // }
      } else {
        console.log("Permission denied for notifications.");
      }
    } catch (error) {
      console.error("Error retrieving FCM token:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [update]);

  useEffect(() => {
    const auth = isEsnLoggedIn();
    if (auth === false) {
      navigate("/Login");
    }

    // const unsubscribe = onMessage(messaging, (payload) => {
    //   console.log("Message received:", payload);

    //   const newNotification = {
    //     id: Date.now(),
    //     type: "system",
    //     title: payload.notification?.title || "New Notification",
    //     content: payload.notification?.body || "You have a new notification",
    //     timestamp: new Date().toISOString(),
    //     read: false,
    //   };

    //   setNotifications((prev) => [newNotification, ...prev]);
    //   setUnreadNotificationsCount((prev) => prev + 1);
    // });
    retrieveFCMToken();
    return () => {
      // unsubscribe();
    };
  }, [navigate]);

  const handleNotificationsUpdate = (updatedNotifications) => {
    setNotifications(updatedNotifications);
    const unreadCount = updatedNotifications.filter((n) => !n.read).length;
    setUnreadNotificationsCount(unreadCount);
  };

  const menuItems = [
    {
      label: "Tableau de Bord",
      key: "dashboard",
      icon: <DashboardOutlined />,
    },
    {
      label: "Administration",
      key: "administration",
      icon: <SettingOutlined />,
      children: [
        {
          label: "Mon Profil ESN",
          key: "Profile",
          icon: <UserOutlined />,
        },
        {
          label: "Gestion des Collaborateurs",
          key: "collaborateur",
          icon: <UsergroupAddOutlined />,
        },
      ],
    },
    {
      label: "Gestion Client",
      key: "client-management",
      icon: <TeamOutlined />,
      children: [
        {
          label: "Répertoire Clients",
          key: "Liste-des-Clients",
          icon: <SolutionOutlined />,
        },
        {
          label: "Partenariats",
          key: "Partenariat",
          icon: <BankOutlined />,
        },
      ],
    },
    {
      label: "Gestion Commerciale",
      key: "commercial-management",
      icon: <ShoppingCartOutlined />,
      children: [
        {
          label: "Appels d'Offres",
          key: "Liste-des-Appels-d'Offres",
          icon: <ProjectOutlined />,
        },
        {
          label: "Mes Candidatures",
          key: "Mes-condidateur",
          icon: <UserSwitchOutlined />,
        },
        {
          label: "Bons de Commande",
          key: "Bon-de-Commande",
          icon: <MacCommandOutlined />,
        },
        {
          label: "Contrats",
          key: "Contart",
          icon: <FileDoneOutlined />,
        },
      ],
    },
    {
      label: "Documentation",
      key: "documentation",
      icon: <FileOutlined />,
      children: [
        {
          label: "Documents Clients",
          key: "documents",
          icon: <FileTextOutlined />,
        },
      ],
    },
    {
      label: (
        <Badge
          style={{ opacity: 1, position: "relative", left: 0 }}
          count={unreadNotificationsCount}
          overflowCount={9}
        >
          Notifications
        </Badge>
      ),
      key: "notification",
      icon: <NotificationOutlined />,
    },
  ];

  const groupedMenuItems = useMemo(() => {
    const mainItems = menuItems.filter((item) => !item.group);
    const groupedItems = menuItems.reduce((acc, item) => {
      if (item.group && !acc.find((i) => i.label === item.group)) {
        acc.push({
          label: item.group,
          key: item.group.toLowerCase().replace(/\s+/g, "-"),
          children: menuItems
            .filter((i) => i.group === item.group)
            .map((i) => ({
              ...i,
              group: undefined,
            })),
        });
      }
      return acc;
    }, []);

    return [...mainItems, ...groupedItems];
  }, [menuItems, unreadNotificationsCount]);

  const findMenuPath = (key, items, path = []) => {
    for (const item of items) {
      if (item.key === key) {
        return [...path, item.label];
      }
      if (item.children) {
        const result = findMenuPath(key, item.children, [...path, item.label]);
        if (result) return result;
      }
    }
    return null;
  };

  const flattenMenuItems = (items) => {
    return items.reduce((acc, item) => {
      if (item.children) {
        return [...acc, ...flattenMenuItems(item.children)];
      }
      return [...acc, { key: item.key, label: item.label, icon: item.icon }];
    }, []);
  };

  const getSearchOptions = (searchText) => {
    if (!searchText) return [];
    const search = searchText.toLowerCase();
    const flatItems = flattenMenuItems(menuItems);
    return flatItems
      .filter((item) => {
        if (!item?.label) return false;
        const label = String(item.label);
        return label.toLowerCase().includes(search);
      })
      .map((item) => ({
        value: item.key,
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 0",
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ),
      }));
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleSelect = (value) => {
    // Check if account is inactive and the selected menu is not allowed
    if (esnStatus == true && !isMenuAllowed(value)) {
      setAttemptedMenu(value);
      setIsModalVisible(true);
      return;
    }
    
    setCurrent(value);
    setSearchValue("");
    const path = findMenuPath(value, menuItems);
    if (path) {
      setBreadcrumbItems(path);
    }
  };

  const handleMenuClick = (e) => {
    // Check if account is inactive and the selected menu is not allowed
    if (esnStatus == false && !isMenuAllowed(e.key)) {
      setAttemptedMenu(e.key);
      setIsModalVisible(true);
      return;
    }
    
    setCurrent(e.key);
    const path = findMenuPath(e.key, menuItems);
    if (path) {
      setBreadcrumbItems(path);
    }
  };

  const renderComponent = () => {
    // If account is inactive and current menu is not allowed, redirect to profile
    if (esnStatus === false && !isMenuAllowed(current) && current !== "dashboard") {
      // Force redirect to profile if trying to access restricted areas
      return <ESNProfilePageFrancais />;
    }
    
    switch (current) {
      case "dashboard":
        return null;
      case "Liste-des-Clients":
        return <ClientList />;
      case "Liste-des-Appels-d'Offres":
        return <AppelDOffreInterface />;
      case "collaborateur":
        return <EmployeeManagement />;
      case "documents":
        return <ClientDocumentManagement />;
      case "notification":
        return (
          <NotificationInterface
            notifications={notifications}
            onNotificationsUpdate={handleNotificationsUpdate}
            setupdate={setupdate}
          />
        );
      case "Mes-condidateur":
        return <ESNCandidatureInterface />;
      case "Bon-de-Commande":
        return <BonDeCommandeInterface />;
      case "Contart":
        return <ContractList />;
      case "Partenariat":
        return <ClientPartenariatInterface />;
      case "Profile":
        return <ESNProfilePageFrancais />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Inactive Account Warning Modal */}
      <Modal
        title={
          <div className="flex items-center text-amber-600">
            <WarningOutlined className="mr-2" /> Compte ESN Inactif
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button 
            key="profile" 
            type="primary" 
            onClick={() => {
              setCurrent("Profile");
              const path = findMenuPath("Profile", menuItems);
              if (path) {
                setBreadcrumbItems(path);
              }
              setIsModalVisible(false);
            }}
          >
            Accéder à mon profil ESN
          </Button>,
          <Button 
            key="cancel" 
            onClick={() => setIsModalVisible(false)}
          >
            Fermer
          </Button>
        ]}
      >
        <div className="p-2">
          <p className="text-base mb-3">Votre compte ESN est actuellement inactif. Vous ne pouvez pas accéder à cette section.</p>
          <p className="text-base mb-3">Pour activer votre compte, complétez toutes les informations requises dans votre profil ESN.</p>
          <p className="text-sm text-gray-500">Seule la section "Mon Profil ESN" est accessible jusqu'à l'activation de votre compte.</p>
        </div>
      </Modal>

      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="w-full flex items-center justify-between p-4">
          <div className="flex items-center flex-grow overflow-hidden">
            <div className="flex-grow overflow-hidden">
              <Menu
                onClick={handleMenuClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={groupedMenuItems}
                className="border-none"
                overflowedIndicator={<MoreOutlined style={{ fontSize: '18px' }} />}
              />
            </div>
            
            <AutoComplete
              value={searchValue}
              options={getSearchOptions(searchValue)}
              onSelect={handleSelect}
              onChange={handleSearch}
              className="ml-4 w-64 flex-shrink-0"
            >
              <Input
                className="rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Rechercher dans le menu..."
                suffix={<SearchOutlined className="text-gray-400" />}
              />
            </AutoComplete>
          </div>
          <div className="flex space-x-3 items-center ml-4 flex-shrink-0">
            <Tag color={esnStatus ? "green" : "orange"}>
              {!esnStatus ?  "Compte inactif" : "Compte actif"}
            </Tag>
            <LogoutOutlined
              onClick={() => {
                logoutEsn();
                navigate("/Login");
              }}
              className="text-red-500 cursor-pointer text-base hover:text-red-600"
              title="Déconnexion"
            />
          </div>
        </div>
      </div>
      <div className="pt-20 px-5 mt-5">
        <Breadcrumb className="mb-4">
          {breadcrumbItems.map((item, index) => (
            <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div className="mt-3">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default InterfaceEn;