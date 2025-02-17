import React, { useEffect, useState } from "react";
import { Button, Divider, Tooltip, Modal, Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Endpoint } from "../../utils/endpoint";

function Birthday({ darkmode }) {
  const [soonBirthdayClients, setSoonBirthdayClients] = useState([]);
  const [displayAll, setDisplayAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const authToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchBirthdayData = async () => {
      try {
        const response = await fetch(
          Endpoint()+"/api/clients/age/",
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSoonBirthdayClients(data.soon_birthday_clients);
      } catch (error) {
        console.error("Failed to fetch birthday data:", error);
      }
    };

    fetchBirthdayData();
  }, []);

  const handleViewAll = () => {
    setDisplayAll(true);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Message sent:", values);
      form.resetFields();
      setModalVisible(false);
    });
  };

  return (
    <div className={`w-[53%] h-96 overflow-auto rounded-md p-4 border transition-colors duration-200 
      ${darkmode 
        ? 'bg-gray-800 border-gray-700 text-gray-100' 
        : 'bg-white border-red-50 text-gray-900'}`}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">Clients à fêter</div>
        {!displayAll && (
          <Button
            type="primary"
            className="font-medium text-sm"
            onClick={handleViewAll}
          >
            Voir tout
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {soonBirthdayClients
          .slice(0, displayAll ? soonBirthdayClients.length : 4)
          .map((client) => (
            <div key={client.id_client} className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm ${darkmode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {`${client.nom_client} ${client.prenom_client}`}
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      width="20"
                      height="20"
                      src="https://img.icons8.com/color-glass/48/birthday.png"
                      alt="birthday"
                      className="w-5 h-5"
                    />
                    <span className={`text-sm ${darkmode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {client.date_naissance}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-5">
                  <Tooltip title="Envoyer">
                    <Button
                      type="text"
                      icon={<MailOutlined className={darkmode ? 'text-blue-400' : 'text-blue-600'} />}
                      onClick={showModal}
                      className="flex items-center justify-center hover:bg-opacity-80"
                    />
                  </Tooltip>
                  <div className={`flex items-center justify-center w-6 h-6 text-sm font-medium rounded-lg
                    ${darkmode 
                      ? 'bg-green-900 bg-opacity-40 text-green-400' 
                      : 'bg-green-200 text-green-600'}`}
                  >
                    {client.days_left}
                  </div>
                </div>
              </div>
              <Divider className={darkmode ? 'border-gray-700' : 'border-gray-200'} />
            </div>
          ))}
      </div>

      <Modal
        title={
          <span className={darkmode ? 'text-gray-100' : 'text-gray-900'}>
            Envoyer un message
          </span>
        }
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        className={darkmode ? 'ant-modal-dark' : ''}
      >
        <Form 
          form={form} 
          layout="vertical"
          className={darkmode ? 'text-gray-100' : 'text-gray-900'}
        >
          <Form.Item
            name="message"
            label="Message"
            rules={[
              { required: true, message: "Please enter your message" },
            ]}
          >
            <Input.TextArea 
              rows={4}
              className={darkmode 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300'
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Birthday;