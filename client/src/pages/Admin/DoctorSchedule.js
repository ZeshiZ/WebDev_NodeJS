import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCalendar } from "react-check-calendar";
import moment from "moment";
import axios from "axios";
import "react-check-calendar/dist/index.css";

const DoctorSchedule = () => {
  const [selected, setSelected] = useState([]);
  const [to, setTo] = useState(6);
  const [from, setFrom] = useState(6);
  const [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [times, setTimes] = useState([]);
  const { id } = useParams();

  const nextWeek = moment().add(1, "week");
  const prevWeek = moment().subtract(1, "week");
  const currentWeek = moment();
  const intervals = [
    { start: 6, end: 6.5 },
    { start: 6.5, end: 7 },
    { start: 7, end: 7.5 },
    { start: 7.5, end: 8 },
    { start: 8, end: 8.5 },
    { start: 8.5, end: 9 },
    { start: 9, end: 9.5 },
    { start: 9.5, end: 10 },
    { start: 10, end: 10.5 },
    { start: 10.5, end: 11 },
    { start: 11, end: 11.5 },
    { start: 11.5, end: 12 },
    { start: 12, end: 12.5 },
    { start: 12.5, end: 13 },
    { start: 13, end: 13.5 },
    { start: 13.5, end: 14 },
    { start: 14, end: 14.5 },
    { start: 14.5, end: 15 },
    { start: 15, end: 15.5 },
    { start: 15.5, end: 16 },
    { start: 16, end: 16.5 },
    { start: 16.5, end: 17 },
    { start: 17, end: 17.5 },
  ];

  const timeSelection = [
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
  ];

  const navigate = useNavigate();

  const updateDays = (value) => {
    console.log(days);
    if (days.find((x) => x === value) || days.find((x) => x === value) === 0) {
      setDays(days.filter((x) => x !== value));
      return;
    }

    setDays([...days, value]);
  };

  useEffect(() => {
    if (to && from) {
      setTimes(intervals.filter((x) => x.start >= from && x.end <= to));
    }
  }, [to, from]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/schedules/${id}`)
      .then((res) => {
        setSelected(
          res.data.map((x) => ({
            start: moment(x.schedule_date),
            end: moment(x.schedule_date).add(30, "minutes"),
          }))
        );

        console.log(selected);
      })
      .catch((err) => {
        alert(err);
      });
  }, [id]);

  const submit = () => {
    let data = {
      doctorId: id,
      schedules: selected.map((x) =>
        moment(x.start).format("YYYY-MM-DD HH:mm:ss")
      ),
    };

    if (!data.schedules) {
      alert("Please select atleast one schedule time range!");
      return;
    }

    axios
      .post("http://localhost:3001/api/schedules", data)
      .then((res) => {
        navigate("/doctors");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      <h2 className="title center">Available Schedule</h2>

      <div className="mt-3 w-800 m-auto">
        <div className="input">
          <label>Days</label>
          <div className="input-group">
            <input
              type="checkbox"
              value={1}
              id="mon"
              onChange={(e) => updateDays(+e.target.value)}
            />{" "}
            <label htmlFor="mon">Mon</label>
            <input
              type="checkbox"
              value={2}
              id="tue"
              onChange={(e) => updateDays(+e.target.value)}
            />{" "}
            <label htmlFor="tue">Tue</label>
            <input
              type="checkbox"
              value={3}
              id="wed"
              onChange={(e) => updateDays(+e.target.value)}
            />{" "}
            <label htmlFor="wed">Wed</label>
            <input
              type="checkbox"
              value={4}
              id="thu"
              onChange={(e) => updateDays(+e.target.value)}
            />{" "}
            <label htmlFor="thu">Thu</label>
            <input
              type="checkbox"
              value={5}
              id="fri"
              onChange={(e) => updateDays(+e.target.value)}
            />{" "}
            <label htmlFor="fri">Fri</label>
            <input
              type="checkbox"
              value={6}
              id="sat"
              onChange={(e) => updateDays(+e.target.value)}
            />{" "}
            <label htmlFor="sat">Sat</label>
            <input
              type="checkbox"
              value={0}
              id="sun"
              onChange={(e) => updateDays(+e.target.value)}
            />{" "}
            <label htmlFor="sun">Sun</label>
          </div>
        </div>
        <div className="input">
          <label>Hours</label>
          <div className="input-group">
            <label>From</label>
            <select
              id="from"
              onChange={(e) => {
                const multiplier =
                  e.target.value.split(" ")[1] === "AM" ? 0 : 12;

                const hour =
                  +e.target.value.split(" ")[0].split(":")[0] + multiplier;
                const min =
                  +e.target.value.split(" ")[0].split(":")[1] === 30 ? 0.5 : 0;
                console.log(multiplier, hour, min);

                setFrom(hour + min);
              }}
            >
              {timeSelection.map((value) => (
                <option value={value} key={`from-${value}`}>
                  {value}
                </option>
              ))}
            </select>
            <label>To</label>
            <select
              id="to"
              onChange={(e) => {
                const multiplier =
                  e.target.value.split(" ")[1] === "AM" ? 0 : 12;
                const hour =
                  +e.target.value.split(" ")[0].split(":")[0] + multiplier;
                const min =
                  +e.target.value.split(" ")[0].split(":")[1] === 30 ? 0.5 : 0;

                setTo(hour + min);
              }}
            >
              {" "}
              {timeSelection.map((value) => (
                <option value={value} key={`to-${value}`}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="w-800 m-auto center">
        {days.length !== 7 && times.length > 0 && (
          <CheckCalendar
            checkedDates={selected}
            onChange={({ moments, dates }) => setSelected(moments)}
            min={currentWeek}
            disableAfter={nextWeek}
            //disableBefore={prevWeek}
            hideDays={days}
            hoursIntervals={times}
            datesFormats={{
              fromHour: "[<strong>]h:mm[</strong>] [<small>]a[</small>]",
              toHour: " [to] [<strong>]h:mm[</strong>] [<small>]a[</small>]",
            }}
          />
        )}

        {days.length !== 7 && times.length > 0 && selected && (
          <button
            type="submit"
            style={{ minWidth: "120px", display: "inline-block" }}
            onClick={() => submit()}
          >
            Save Schedule
          </button>
        )}
      </div>
    </>
  );
};

export default DoctorSchedule;
