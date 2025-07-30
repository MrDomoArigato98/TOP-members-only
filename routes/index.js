import express from "express";
const router = express.Router();
import * as controller from "../controllers/controller.js";
import { signUpValidator } from "../validators/userValidator.js";
import { messageValidator } from "../validators/messageValidator.js";
import passport from "passport";

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
}

router.get("/", controller.getHome);

router.get("/sign-up", controller.getSignUpForm);
router.post("/sign-up", signUpValidator, controller.postSignUpForm);

router.get("/log-in", controller.getLogInForm);
router.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).render("log-in-form", {
        title: "Login",
        errorList: [{ msg: "Invalid username or password" }],
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

router.get(
  "/new-message",
  ensureAuthenticated,
  messageValidator,
  controller.getNewMessageForm
);
router.post(
  "/new-message",
  ensureAuthenticated,
  messageValidator,
  controller.postNewMessageForm
);

router.post("/leave-club", ensureAuthenticated, controller.postLeaveClub);

router.get("/become-member", ensureAuthenticated, controller.getMemberForm);
router.post("/become-member", ensureAuthenticated, controller.postMemberForm);

router.post(
  "/delete-message/:messageId",
  ensureAuthenticated,
  controller.deleteMessage
);

router.post(
  "/become-admin/:userId",
  ensureAuthenticated,
  controller.postBecomeAdmin
);
router.post(
  "/remove-admin/:userId",
  ensureAuthenticated,
  controller.postRemoveAdmin
);

export function mountRoutes(app) {
  app.use("/", router);
}
