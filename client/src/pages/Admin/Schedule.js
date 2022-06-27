import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";

const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/appointments")
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  return (
    <>
      <h2 className="title center">Appointments</h2>

      {appointments.map((appointment) => (
        <div className="container" key={appointment.id}>
          <div>
            <div className="date">{`${moment(appointment.schedule_date).format(
              "MMMM D, yyyy"
            )} at ${moment(appointment.schedule_date).format("h:mm A")}`}</div>
            <div className="content">
              <p>
                <b>Patient:</b> {appointment.name}
              </p>
              <p>
                <b>Reason:</b> {appointment.reason}
              </p>
              <p>
                <b>Notes:</b> {appointment.notes}
              </p>
            </div>
            <div className="center mt-3">
              <Link
                to={`/schedule/${appointment.schedule_date}`}
                className="btn"
              >
                {!!appointment.notes ? "Update" : "Add"} Notes
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Schedule;
