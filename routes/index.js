import express from "express";
const router = express.Router();
import * as controller from "../controllers/controller.js";
import { signUpValidator } from "../validators/userValidator.js";
import passport from "passport";

router.get("/", controller.getHome);

router.get("/sign-up", controller.getSignUpForm);
router.post("/sign-up", signUpValidator, controller.postSignUpForm);

router.get("/log-in", controller.getLogInForm);
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: false,
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});
router.get("/become-member", controller.getMemberForm)
router.post("/become-member", controller.postMemberForm)

// router.get("/become-admin", controller.getAdminForm)
// router.post("/become-admin", controller.postAdminForm)

export function mountRoutes(app) {
  app.use("/", router);
}
