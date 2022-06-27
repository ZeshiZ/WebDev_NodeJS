import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import jwt from "jwt-decode";

const Layout = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const currentUser = !token ? {} : jwt(token);
    setUser(currentUser);
    window.addEventListener("storage", storageEventHandler, false);

    if (!token) {
      navigate("/login");
    }
  }, []);

  function storageEventHandler() {
    const token = sessionStorage.getItem("token");
    const currentUser = !token ? {} : jwt(token);
    setUser(currentUser);
  }

  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <div className="header">
        <h1>The Clinic</h1>
        {user?.role === "patient" && (
          <nav>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li style={{ cursor: "pointer" }} onClick={logout}>
                Logout
              </li>
            </ul>
          </nav>
        )}
        {user?.role === "doctor" && (
          <nav>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li style={{ cursor: "pointer" }} onClick={logout}>
                Logout
              </li>
            </ul>
          </nav>
        )}
        {user?.role === "admin" && (
          <nav>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                {" "}
                <NavLink to="/doctors">Doctors</NavLink>
              </li>
              <li>
                <NavLink to="/customers">Customers</NavLink>
              </li>
              <li>
                <NavLink to="/accounts">Accounts</NavLink>
              </li>
              <li style={{ cursor: "pointer" }} onClick={logout}>
                Logout
              </li>
            </ul>
          </nav>
        )}
      </div>
      <div className="wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
