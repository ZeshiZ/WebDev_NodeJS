import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";

const Notes = () => {
  const [notes, setNotes] = useState("");
  const { schedule } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/appointments/${moment(schedule).format(
          "YYYY-MM-DD HH:mm:ss"
        )}`
      )
      .then((res) => {
        if (!!res.data) {
          setNotes(res.data[0].notes);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [schedule]);

  const submit = () => {
    axios
      .put(`http://localhost:3001/api/appointments`, {
        schedule: moment(schedule).format("YYYY-MM-DD HH:mm:ss"),
        notes: notes,
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
      <h1 className="center title">Add Notes</h1>

      <div className="card w-800 m-auto">
        <div className="input">
          <textarea
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="center mt-3">
        <button
          onClick={() => submit()}
          className="btn"
          style={{ minWidth: 160 }}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default Notes;
