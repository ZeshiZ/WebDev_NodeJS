import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import jwt from "jwt-decode";
import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./Layout";

import "./App.css";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import AppointmentConfirm from "./pages/AppointmentConfirm";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Admin/Doctors";
import Notes from "./pages/Admin/Notes";
import DoctorForm from "./pages/Admin/DoctorForm";
import DoctorSchedule from "./pages/Admin/DoctorSchedule";
import AdminAccounts from "./pages/Admin/Accounts";
import Accounts from "./pages/Admin/Accounts";
import AccountForm from "./pages/Admin/AccountForm";
import Patients from "./pages/Admin/Patients";
import PatientForm from "./pages/Admin/PatientForm";
import Schedule from "./pages/Admin/Schedule";

function App() {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useState(() => {
    const storedTtoken = sessionStorage.getItem("token");
    const currentUser = !storedTtoken ? {} : jwt(storedTtoken);
    setUser(currentUser);
    setToken(storedTtoken);
  }, []);

  axios.interceptors.request.use((request) => {
    if (token) {
      request.headers.common.Authorization = `Bearer ${token}`;
    }

    return request;
  });

  useEffect(() => {
    const storedTtoken = sessionStorage.getItem("token");
    if (storedTtoken) {
      const currentUser = !storedTtoken ? {} : jwt(storedTtoken);
      setUser(currentUser);
      setToken(storedTtoken);
    } else {
      setUser({});
      setToken(null);
    }
  }, [location]);

  let routes = [];

  switch (user.role) {
    case "admin":
      routes = [
        {
          index: true,
          path: "/",
          element: (
            <h1 className="center title mt-6" style={{ borderBottom: "none" }}>
              Welcome {user.name}!
            </h1>
          ),
        },
        { index: false, path: "doctors", element: <Doctors /> },
        { index: false, path: "doctors/add", element: <DoctorForm /> },
        {
          index: false,
          path: "doctors/:id/schedule",
          element: <DoctorSchedule />,
        },
        { index: false, path: "accounts", element: <Accounts /> },
        { index: false, path: "accounts/add", element: <AccountForm /> },
        { index: false, path: "customers", element: <Patients /> },
        { index: false, path: "customers/add", element: <PatientForm /> },
      ];
      break;
    case "patient":
      routes = [
        { index: true, path: "", element: <Appointments /> },
        {
          index: false,
          path: "appointments/book",
          element: <ScheduleAppointment />,
        },
        {
          index: false,
          path: "appointments/confirmed",
          element: <AppointmentConfirm />,
        },
      ];
      break;
    case "doctor":
      routes = [
        { index: true, path: "", element: <Schedule /> },
        { index: false, path: "schedule/:schedule", element: <Notes /> },
      ];
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        {routes.map((route) => (
          <Route
            index={route.index}
            path={route.path}
            element={route.element}
            key={route.path}
          />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
