require("dotenv").config();

const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { nanoid } = require("nanoid");
const bcrypt = require("bcryptjs");
const router = express.Router();
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
app.use("/login", router);
router.get("/", (req, res) => {
  res.render("login", {
    user: req.body.id,
  });
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
