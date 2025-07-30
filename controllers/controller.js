import passport from "passport";
import bcrypt from "bcryptjs";
import { createUser } from "../db/queries.js";
import { validationResult } from "express-validator";

export async function getHome(req, res) {
  console.log("getHome");
  res.render("index", {
    title: "Message Board",
  });
  console.log(res.locals.currentUser);
  
}

export async function getSignUpForm(req, res) {
  res.render("sign-up-form");
}

export async function postSignUpForm(req, res, next) {
  const errors = validationResult(req);
  const { username, full_name, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up-form", {
      errorList: errors.array(),
      username,
      full_name,
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
    });
  }
}

export async function getLogInForm(req, res) {
  console.log("getLogInForm");

  res.render("log-in-form", {
    title: "Login"
  })
}

export async function postLogInForm(req, res) {
  console.log("postLogInForms");
}

export async function getMemberForm(req,res){
    
}
export async function postMemberForm(req,res){

}