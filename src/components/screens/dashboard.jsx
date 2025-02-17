import { Button, ConfigProvider } from "antd";
import { ContainerOutlined } from "@ant-design/icons";
import React from "react";
import TypeContart from "../charts/typeContart";
import Teresorerie from "../charts/teresorerie";
import Client from "../charts/client";
import Reservations from "../charts/reservations";
import Birthday from "../charts/birthday";
import DemoDualAxes from "../charts/dudLine";
import ContratsType from "../charts/echeance";
import SalaryContractChart from "../charts/SalaryContractChart";
import StudentGradeDistribution from "../charts/StudentGradeDistribution";
import CourseAccumulationChart from "../charts/dudLine";
import CourseScatterPlot from "../charts/dudLine";
import CourseDualAxesChart from "../charts/dudLine";
import CourseRadialBarChart from "../charts/dudLine";
import CourseDataTable from "../charts/dudLine";
import DailyActivityChart from "../charts/dudLine";
import CourseDistribution from "../charts/CourseDistribution";

function DashboardInterface({ darkmode }) {
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
      <div className="w-full ">
        <div className="p-2 flex items-start justify-between">
          <Teresorerie darkmode={false}/>
          <Client darkmode={false}/>
          <Reservations darkmode={false}/>
        </div>
        <div className="pl-1  pr-5 mt-0 flex items-start justify-between">
          <div className="w-[45%] h-96">
            <TypeContart darkmode={false}/>
          </div>
          <Birthday darkmode={false}/>
        </div>
        <div className="p-1 flex items-start justify-between mt-5">
          <SalaryContractChart darkmode={false}/>
          <div className="w-10"></div>
          <StudentGradeDistribution darkmode={false}/>
        </div>
        <div className="w-full p-1 flex flex-col space-y-2 items-start justify-between">
          <div className="flex w-full">
            <ContratsType darkmode={false}/>
            <div className="w-5"></div>
            <CourseDistribution darkmode={false}/>
          </div>
          <div style={{height:"50px"}} className="w-full mt-2">
            <DailyActivityChart />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default DashboardInterface;
