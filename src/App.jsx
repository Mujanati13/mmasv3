import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import ForgetPassword from "./pages/forgetPaw";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route exact path="/" element={<Entry />} /> */}
        <Route exact path="/" element={<Login />} />
        <Route exact path="/forget-password" element={<ForgetPassword />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
