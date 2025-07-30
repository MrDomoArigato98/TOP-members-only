import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import {
  createUser,
  createMessage,
  getAllMessages,
  makeUserMember,
  removeMembership,
  deleteMessageById,
} from "../db/queries.js";
import { validationResult } from "express-validator";

export async function getHome(req, res) {
  console.log(req.user);

  try {
    const messages = await getAllMessages();

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
    let errorMsg = "Something went wrong. Please try again.";
    if (error.code === "23505") {
      errorMsg = "A user with that email already exists.";
    }

    res.status(500).render("sign-up-form", {
      errorList: [{ msg: errorMsg }],
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

export async function getMemberForm(req, res) {
  res.render("member-form", {
    title: "Become a member",
  });
}

export async function postMemberForm(req, res) {
  const { member_code } = req.body;
  const correctCode = process.env.MEMBER_PASSCODE;

  if (member_code === correctCode) {
    try {
      await makeUserMember(req.user.id);
      req.user.is_member = true; // update session copy of user
      return res.redirect("/");
    } catch (error) {
      console.error("Something went wrong"), error;
      return res.status(500).render("member-form", {
        title: "Become a member",
        errorList: [{ msg: "Try again, the correct answer is dogs." }],
      });
    }
  } else {
    return res.status(400).render("member-form", {
      title: "Become a member",
      errorList: [{ msg: "The correct answer is dogs." }],
    });
  }
}

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

  const { id } = res.locals.currentUser;

  await createMessage(id, req.body.title, req.body.body);

  res.redirect("/");
}

export async function postLeaveClub(req, res) {
  try {
    await removeMembership(req.user.id);
    req.user.is_member = false;
    res.redirect("/");
  } catch (error) {
    console.error("Error removing membership", error);
    res.redirect("/");
  }
}

export async function deleteMessage(req, res) {
  const { messageId } = req.params;

  try {
    await deleteMessageById(messageId);
  } catch (error) {
    console.error("Error removing message", error);
    res.redirect("/");
  }
  res.redirect("/");
}
