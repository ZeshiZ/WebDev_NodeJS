import moment from "moment";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const appointments = [
  { id: 1, scheduleDate: new Date(), reason: "test reason", note: "test note" },
  {
    id: 2,
    scheduleDate: new Date("06/18/2022 09:30 PM"),
    reason: "test reason",
    note: "test note",
  },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

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
      <div className="end">
        <Link
          to="/appointments/book"
          className="btn"
          style={{ maxWidth: "120px", display: "inline-block" }}
        >
          Book Appointment
        </Link>
      </div>

      <h2 className="title center">Appointment History</h2>

      {appointments.map((appointment) => (
        <div className="container">
          <div key={appointment.id}>
            <div className="date">{`${moment(appointment.schedule_date).format(
              "MMMM D, yyyy"
            )} at ${moment(appointment.schedule_date).format("h:mm A")}`}</div>
            <div className="content">
              <p>
                <b>Doctor:</b> {appointment.name}
              </p>
              <p>
                <b>Reason:</b> {appointment.reason}
              </p>
              <p>
                <b>Notes:</b> {appointment.notes}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Appointments;
