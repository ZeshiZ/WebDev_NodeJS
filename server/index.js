const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const e = require("express");

const saltRounds = 10;

// get config vars
dotenv.config();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "clinic",
});

app.use(
  cors({
    origin: ["https://theclinic1-client.herokuapp.com/"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/appointments", authenticateToken, (req, res) => {
  const id = req.user.id;
  console.log(req.user);

  let sqlAll =
    "SELECT appointments.*, users.name FROM appointments LEFT JOIN users ON doctor_id = users.id WHERE patient_id = ? ORDER BY schedule_date DESC";

  if (req.user.role === "doctor") {
    sqlAll =
      "SELECT appointments.*, users.name FROM appointments LEFT JOIN users ON patient_id = users.id WHERE doctor_id = ? ORDER BY schedule_date DESC";
  }

  db.query(sqlAll, [id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.get("/api/appointments/:schedule", authenticateToken, (req, res) => {
  const id = req.user.id;
  const schedule = req.params.schedule;

  let sqlSelect =
    "SELECT appointments.*, users.name FROM appointments LEFT JOIN users ON doctor_id = users.id WHERE patient_id = ? and schedule_date = ? ORDER BY schedule_date DESC";

  if (req.user.role === "doctor") {
    sqlSelect =
      "SELECT appointments.*, users.name FROM appointments LEFT JOIN users ON patient_id = users.id WHERE doctor_id = ? and schedule_date = ? ORDER BY schedule_date DESC";
  }

  db.query(sqlSelect, [id, schedule], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.put("/api/appointments", authenticateToken, (req, res) => {
  const id = req.user.id;
  const schedule = req.body.schedule;
  const notes = req.body.notes;

  if (req.user.role !== "doctor") return;

  const sqlUpdate =
    "UPDATE appointments SET notes = ? WHERE doctor_id = ? and schedule_date = ?";

  db.query(sqlUpdate, [notes, id, schedule], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.post("/api/appointments", authenticateToken, (req, res) => {
  const id = req.user.id;
  const schedule = req.body.schedule;
  const doctor = req.body.doctor;
  const reason = req.body.reason;

  const sqlInsert =
    "INSERT INTO appointments (doctor_id, schedule_date, patient_id, reason) VALUES (?, ?, ?, ?)";

  const sqlUpdate =
    "UPDATE schedules SET available = 0 WHERE doctor_id = ? and  schedule_date = ?";

  db.query(sqlUpdate, [doctor, schedule], (err, result) => {
    if (err) console.log(err);
  });

  db.query(sqlInsert, [doctor, schedule, id, reason], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.get("/api/schedules/:id", authenticateToken, (req, res) => {
  const id = req.params.id;

  const sqlAll =
    "SELECT * FROM schedules WHERE DATEDIFF(schedule_date, now()) >= 0 and doctor_id = ?;";

  db.query(sqlAll, [id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.post("/api/schedules", authenticateToken, (req, res) => {
  const doctorId = req.body.doctorId;
  const schedules = req.body.schedules;

  if (!doctorId || !schedules) {
    return;
  }

  const sqlDelete =
    "DELETE FROM schedules WHERE DATEDIFF(schedule_date, now()) >= 0 and doctor_id = ?;";
  const sqlInsert =
    "INSERT INTO schedules (doctor_id, schedule_date, available) values (?, ?, ?)";

  db.query(sqlDelete, [doctorId], (err, result) => {
    if (err) console.log(err);

    schedules.forEach((sched) => {
      db.query(sqlInsert, [doctorId, sched, 1], (err, result) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });

  res.send();
});

app.post("/api/todos/:id", authenticateToken, (req, res) => {
  const todoId = req.params.id;
  const isDone = req.body.isDone;

  const sqlUpdate = "UPDATE todos SET isDone = ? WHERE id = ?";

  db.query(sqlUpdate, [isDone, todoId], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.get("/api/users/:role", (req, res) => {
  const role = req.params.role;

  if (role) {
    const sqlSelect = "SELECT * FROM users WHERE role = ?";

    db.query(sqlSelect, [role], (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      res.send(result);
    });
  } else {
    const sqlSelect = "SELECT * from users";

    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
      }
      res.send(result);
    });
  }
});

app.post("/api/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  const sqlRegister =
    "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)";

  bcrypt.hash(password, saltRounds, (err, passwordHash) => {
    db.query(sqlRegister, [name, email, passwordHash, role], (err, result) => {
      if (err) {
        console.log(err);
        res.send({ err: err });
        return;
      }
      res.send(result);
    });
  });
});

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const sqlLogin = "SELECT * FROM users WHERE email = ?";

  db.query(sqlLogin, [email], (err, result) => {
    if (err) {
      res.send({ err: err });
      return;
    }

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          let user = {
            id: result[0].id,
            name: result[0].name,
            email: result[0].email,
            role: result[0].role,
          };
          const token = generateAccessToken(user);

          res.send(token);
        } else {
          res.send({ message: "Wrong username/password combination." });
        }
      });
    } else {
      res.send({ message: "User doesn't exist." });
    }
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "24h" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

app.listen(3001, () => {
  console.log("running on port 3001");
});
