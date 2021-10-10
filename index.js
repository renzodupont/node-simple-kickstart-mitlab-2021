import express from "express";
import bodyParser from "body-parser";
import { Low, JSONFile } from "lowdb";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

// new Express App
const app = express();

// allow cross-origin resource sharing (CORS)
app.use(cors());

// data parser - used to parse post data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static files from public directory
// -------------------------------------------
app.use(express.static("public"));

db.read().then(function () {
  // init the data store
  db.data = db.data || { users: [] };
});

// server is running
app.get("/", function (req, res) {
  res.send("Hello, visitor! Test site by Renzo Dupont");
});

// return all users
app.get("/data", function (req, res) {
  res.send(db.data.users);
});

// add user
app.post("/add", function (req, res) {
  var user = {
    name: req.body.name,
    dob: req.body.dob,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    streetaddress: req.body.streetaddress,
    citystatezip: req.body.citystatezip,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    avatar: req.body.avatar,
  };
  db.data.users.push(user);
  db.write();

  console.log(db.data.users);
  res.send(db.data.users);
});

// start server
// -----------------------
app.listen(3001, function () {
  console.log("Running on port 3001!");
});
