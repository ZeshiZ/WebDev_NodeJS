import { useState } from "react";
import * as dateFns from "date-fns";
import moment from "moment";

import "./Calendar.css";

const Calendar = ({ bookedDates, onSelected }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState(null);
  //   const [bookedDates, setBookedDates] = useState([]);

  //   const generateRandomBooking = () => {
  //     const daysInMonth = dateFns.getDaysInMonth(currentMonth);
  //     const randomDaysToGenerate = Math.floor(Math.random() * daysInMonth + 1);

  //     let bookings = [];
  //     for (let i = 0; i < randomDaysToGenerate; i++) {
  //       const randomDay = Math.floor(Math.random() * daysInMonth + 1);

  //       bookings.push({
  //         schedule: new Date(
  //           currentMonth.getFullYear(),
  //           currentMonth.getMonth(),
  //           randomDay
  //         ),
  //         available: 1,
  //       });
  //     }

  //     setBookedDates(bookings);
  //   };

  const isBooked = (date) => {
    return bookedDates?.some((bookedDate) =>
      dateFns.format(date, 'yyyy-MM-dd') === bookedDate.schedule
    );
  };

  const getAvailable = (date) => {
    const booking = bookedDates?.find((bookedDate) =>
      date === bookedDate.schedule
    );

    return !booking ? 0 : booking.available;
  };

  const nextMonth = () => {
    setCurrentMonth(dateFns.addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(dateFns.subMonths(currentMonth, 1));
  };

  //   const renderButton = () => {
  //     return (
  //       <div className="col-center">
  //         <button onClick={generateRandomBooking}>Generate booking</button>
  //       </div>
  //     );
  //   };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = dateFns.startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "dd";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = dateFns.format(day, "yyyy-MM-dd");

        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : isBooked(day)
                ? selected === cloneDay
                  ? "focused"
                  : "selected"
                : "disabled"
            }`}
            key={day}
          >
            <span className="number" onClick={() => selectedHandler(cloneDay)}>
              {formattedDate}
            </span>
            <span className="bg">{`${getAvailable(cloneDay)} available`}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  };

  const selectedHandler = (day) => {
    onSelected(day);
    setSelected(day);
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {/* {renderButton()} */}
    </div>
  );
};

export default Calendar;
