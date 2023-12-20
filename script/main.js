require("dotenv").config();

const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { nanoid } = require("nanoid");
const bcrypt = require("bcryptjs");
const routerLogin = express.Router();
const routerSignUp = express.Router();
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb");
const clientPromise = MongoClient.connect("mongodb://root:MOzprbXZtPVK@localhost:27022", function (err, database) {
  // console.log(database);
  if (err) {
    return console.log(err);
  }
  db = database;
});
// let db;
nunjucks.configure("src", {
  autoescape: true,
  express: app,
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
});

app.set("view engine", "njk");
app.use(cookieParser());

app.use(express.json());
app.use(express.static("script"));
app.use(express.static("css"));
app.use(express.static("img"));
app.use(express.static("src"));
app.use(express.static("trs-pages"));
app.use(express.static("gallery_photo"));
app.use(express.static("font-awesome-4.7.0"));
routerLogin.use(express.static("script"));
routerLogin.use(express.static("css"));
routerLogin.use(express.static("img"));
routerLogin.use(express.static("src"));
routerLogin.use(express.static("trs-pages"));
routerLogin.use(express.static("gallery_photo"));
routerLogin.use(express.static("font-awesome-4.7.0"));
routerLogin.use(express.static("css"));
app.use(async (req, res, next) => {
  try {
    const client = await clientPromise;
    // console.log(client);
    req.db = client.db("users");
    next();
  } catch (err) {
    next(err);
  }
});
app.use("/login", routerLogin);
app.use("/signup", routerSignUp);

app.get("/", (req, res) => {
  res.render("index");
});

// npx kill-port 3000
const auth = () => async (req, res, next) => {
  // console.log(req.db);
  if (!req.cookies["sessionId"]) {
    return next();
  }
  const user = await findUserBySessionId(req.db, req.cookies["sessionId"]);
  req.user = user;
  console.log(req.user);
  req.sessionId = req.cookies["sessionId"];
  next();
};

routerLogin.get("/", auth(), (req, res) => {
  res.render("login", {
    user: req.user,
    authError: req.query.authError === "true",
  });
});

routerSignUp.get("/", (req, res) => {
  res.render("signup", {
    user: req.body.id,
  });
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});

// const clientPromise = MongoClient.connect("mongodb://0.0.0.0:27022", function (err, database) {
//   if (err) {
//     return console.log(err);
//   }
//   db = database;
// });

// routerLogin.use(async (req, res, next) => {
//   try {
//     const client = await clientPromise;
//     req.db = client.db("users");
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

const createUser = async (db, fullname, number, email, country, password, date) => {
  const id = new ObjectId.ObjectId();
  password = bcrypt.hashSync(password, 7);
  await db.collection("users").insertOne({ _id: id, fullname, number, email, country, password, date });
  return id;
};

const findUserBySessionId = async (db, sessionId) => {
  const session = await db.collection("sessions").findOne(
    { sessionId },
    {
      projection: { userId: 1 },
    }
  );

  if (!session) {
    return;
  }
  return db.collection("users").findOne({ _id: new ObjectId.ObjectId(session.userId) });
};

const findUserByUsername = async (db, email) => db.collection("users").findOne({ email });

const createSession = async (db, userId) => {
  const sessionId = nanoid();

  await db.collection("sessions").insertOne({
    userId,
    sessionId,
  });

  return sessionId;
};

async function deleteSession(db, sessionId) {
  await db.collection("sessions").deleteOne({ sessionId });
}

routerLogin.post("/", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await findUserByUsername(req.db, email);
  console.log(password);
  console.log(user.password);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.redirect("/login/?authError=true");
  }
  const sessionId = await createSession(req.db, user._id);
  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/login/");
});

routerSignUp.post("/", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  console.log(req.body);
  const { fullname, number, email, country, password } = req.body;
  const user = await findUserByUsername(req.db, email);
  // console.log(bcrypt.compareSync(password, user.password));
  if (user && bcrypt.compareSync(password, user.password)) {
    console.log("Такой пользователь уже существует");
    const sessionId = await createSession(req.db, user._id);
    res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
  } else if (user && !bcrypt.compareSync(password, user.password)) {
    return res.redirect("/?authError=true");
  } else {
    const date = new Date();
    console.log(date.getDate());
    console.log(date.getMonth());
    console.log(date.getFullYear());
    const dateRegistration =
      date.getDate().toString() + "." + date.getMonth().toString() + "." + date.getFullYear().toString();
    const idUser = await createUser(req.db, fullname, number, email, country, password, dateRegistration);
    const sessionId = await createSession(req.db, idUser);
    res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/login");
  }
});

routerLogin.get("/logout", auth(), async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  await deleteSession(req.db, req.sessionId);
  res.clearCookie("sessionId").redirect("/");
});
