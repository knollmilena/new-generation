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

app.get("/", (req, res) => {
  res.render("index");
});

// npx kill-port 3000
const auth = () => async (req, res, next) => {
  if (!req.cookies["sessionId"]) {
    return next();
  }
  const user = await findUserBySessionId(req.db, req.cookies["sessionId"]);
  req.user = user;
  req.sessionId = req.cookies["sessionId"];
  next();
};

app.use("/login", routerLogin);
routerLogin.get("/", auth(), (req, res) => {
  res.render("login", {
    user: req.user,
    authError: req.query.authError === "true",
  });
});

app.use("/signup", routerSignUp);

routerSignUp.get("/", (req, res) => {
  res.render("signup", {
    user: req.body.id,
  });
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
const { MongoClient, ObjectId } = require("mongodb");
const clientPromise = MongoClient.connect("mongodb://localhost:27022", function (err, database) {
  if (err) {
    return console.log(err);
  }
  db = database;
});

app.use(async (req, res, next) => {
  try {
    const client = await clientPromise;
    req.db = client.db("users");
    next();
  } catch (err) {
    next(err);
  }
});

const createUser = async (db, username, password) => {
  const id = ObjectId();
  password = bcrypt.hashSync(password, 7);
  await db.collection("users").insertOne({ _id: ObjectId(id), username, password });
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
  return db.collection("users").findOne({ _id: ObjectId(session.userId) });
};

const findUserByUsername = async (db, username) => db.collection("users").findOne({ username });

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

routerLogin.post("/login", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(req.db, username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.redirect("/?authError=true");
  }
  const sessionId = await createSession(req.db, user._id);
  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
});
