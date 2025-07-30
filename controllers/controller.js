import passport from "passport";
import bcrypt from "bcryptjs";
import { createUser, createMessage, getAllMessages } from "../db/queries.js";
import { validationResult } from "express-validator";

export async function getHome(req, res) {
  console.log("getHome");

  try {
    const messages = await getAllMessages();
    console.log(messages);

    res.render("index", {
      title: "Message Board",
      messages,
      currentUser: req.user,
    });
  } catch (error) {
    console.error("Error loading messages", error);
    res.status(500).render("index", {
      title: "Message Board",
      messages: [],
      currentUser: req.user,
    });
  }
}

export async function getSignUpForm(req, res) {
  res.render("sign-up-form", {
    title: "Register",
  });
}

export async function postSignUpForm(req, res, next) {
  const errors = validationResult(req);
  const { username, full_name, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up-form", {
      errorList: errors.array(),
      username,
      full_name,
      title: "Sign-up",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await createUser({
      username,
      full_name,
      passwordHash,
    });

    req.login(newUser, (err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } catch (error) {
    console.error("Signup error:", error);
    let msg = "";
    if (error.code == 23505) {
      msg = "User already exists";
    }

    res.status(500).render("sign-up-form", {
      errorList: [{ msg: "Something went wrong. Please try again." }, { msg }],
      username,
      full_name,
      title: "Sign-up",
    });
  }
}

export async function getLogInForm(req, res) {
  console.log("getLogInForm");

  res.render("log-in-form", {
    title: "Login",
  });
}

export async function getMemberForm(req, res) {}

export async function postMemberForm(req, res) {}

export async function getNewMessageForm(req, res) {
  res.render("new-message-form", {
    title: "New Post",
  });
}
export async function postNewMessageForm(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("new-message-form", {
      errorList: errors.array(),
      title: "New Post",
    });
  }
  console.log(req.body);
  console.log(res.locals.currentUser);
  const { id } = res.locals.currentUser;

  await createMessage(id, req.body.title, req.body.body);

  res.redirect("/");
}
