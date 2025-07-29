import path from "node:path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import passport from "passport";
import "./auth/passport-config.js";
import { pool } from "./db/pool.js";

import { mountRoutes } from "./routes/index.js";
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
//Static assets
app.use(express.static(__dirname + "/public"));

const PgSession = pgSession(session);

app.use(
  session({
    store: new PgSession({ pool, ttl: 1000 * 60 * 60 }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60}, // use true only if HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//This lets me access currentUser in all of my views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

mountRoutes(app);

// 404 handler after main router above
app.use((req, res, next) => {
  res.status(404);
  res.json({ error: "Not Found" });
});

//Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status);
  res.json({ error: err.message || "Server Error" });
});

export default app;
