var express = require("express");
var router = express.Router();
var User = require("../models/user");

/* GET users listing. */
// router.get('/article', function(req, res, next) {
//   if(req.session && req.session.userId) {
//  return res.send('respond with a resource');
//   }else {
//     res.redirect("/")
//   }
// });

//register
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
});
//login

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;

  User.findOne({ email}, (err, user) => {
    if (err) return next(err);
    // console.log(user);
    if (!user || !user.verifyPassword(password)) {
      res.redirect("/users/login");
    }
    req.session.userId = user.id;
    console.log("User", user);
    res.redirect("/articles");
  });
});

//logout
router.get("/logout", (req, res, next) => {
  console.log("logout");
  req.session.destroy();
  res.redirect("/users/login");
});

module.exports = router;
