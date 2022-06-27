import { useEffect, useState } from "react";
import Calendar from "../components/calendar/Calendar";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ScheduleAppointment = () => {
  const [availableTime, setAvailableTime] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [appointmentDates, setAppointmentDates] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/users/doctor")
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  useEffect(() => {
    if (doctor) {
      axios
        .get(`http://localhost:3001/api/schedules/${doctor}`)
        .then((res) => {
          setAvailableTime(res.data);

          const dates = [
            ...new Set(
              res.data.map((item) =>
                moment(item.schedule_date).format("yyyy-MM-DD")
              )
            ),
          ];

          const data = dates.map((item) => ({
            schedule: new Date(item),
            available:
              res.data.filter(
                (x) => item === moment(x.schedule_date).format("yyyy-MM-DD")
              )?.length || 0,
          }));

          console.log(data);

          setAppointmentDates(data);

          console.log(appointmentDates);
        })
        .catch((err) => {
          alert(err);
        });
    }
  }, [doctor]);

  const selectedHandler = (day) => {
    setAppointmentDate(day);
  };

  const bookAppointment = (sched) => {
    axios
      .post("http://localhost:3001/api/appointments", {
        schedule: moment(sched.schedule_date).format("YYYY-MM-DD HH:mm:ss"),
        doctor,
        reason,
      })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      <h2 className="title center mt-6">Schedule Appointment</h2>

      <div className="w-800 m-auto">
        <div className="input">
          <label htmlFor="reason" className="text-default mt-3">
            Reason
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>
        <div className="input">
          <label htmlFor="doctor" className="text-default mt-3">
            Doctor
          </label>
          <select
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          >
            <option value="" hidden>
              Please select doctor
            </option>
            {doctors.map((doctor) => (
              <option key={`doctor-${doctor.id}`} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input">
          <label htmlFor="appointmentDate" className="text-default mt-3">
            Appointment Date
          </label>
          <Calendar
            onSelected={selectedHandler}
            bookedDates={appointmentDates}
          />
          {/* <input
            id="appointmentDate"
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          /> */}
        </div>

        <div className="input">
          <label htmlFor="appointmentTime" className="text-default mt-3">
            {appointmentDate && moment(appointmentDate).format("MMMM DD, YYYY")}
          </label>
          <table className="s-table">
            {availableTime
              .filter(
                (x) =>
                  moment(x.schedule_date).format("YYYY-MM-DD") ===
                  moment(appointmentDate).format("YYYY-MM-DD")
              )
              .map((x) => (
                <tr
                  className={`${x.available.data[0] ? "available" : "booked"}`}
                >
                  <th>
                    {moment(x.schedule_date).format("hh:mm a")} :{" "}
                    {x.available.data[0] ? "Available" : "Booked"}
                  </th>
                  <td className="center">
                    {x.available.data[0] ? (
                      <button
                        className="btn"
                        style={{ display: "inline-block" }}
                        onClick={() => bookAppointment(x)}
                      >
                        Book
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
          </table>
        </div>
      </div>
    </>
  );
};

export default ScheduleAppointment;
