import express from 'express';
import UserInformation from '../models/userInformation.js';
import passport from 'passport';
import PocketMarket from '../models/pocketMarket.js';

const router = express.Router();

//User Profile
router.get("/users/:id", function(req, res) {
  UserInformation.findById(req.params.id, function(err, foundUser){
     if(err){
         req.flash("error", "Please try it angin!");
         res.redirect("/PocketMarket");
     } else {
         PocketMarket.find().where('author.id').equals(foundUser._id).exec(function(err, founder){
             if(err) {
                 req.flash("error", "Please try it later!");
                 res.redirect("/PocketMarket");
             } else {
                 res.render("users/show", {user: foundUser, PocketMarket: founder});
             }
         });
     }
  }); 
});

//root route
router.get("/", function(req, res){
  res.render("landing");
});

//show register form
router.get("/register", function(req, res) {
  res.render("register");
});

/**
 * User registration
 * Registration logic
 */

 //Sign up logic
router.post('/user/register', function (req, res, next) {

    // console.log(req.body);
    var newUser = new UserInformation ({
          username: req.body.username, 
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
    });
    UserInformation.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register", {error: err.message});
      }else {
          passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to Pocket Market! Nice to meet you " + user.username);
          res.redirect("/PocketMarket"); 
      });
    }});
});

//show login form
router.get("/login", function(req, res){
  res.render("login"); 
});

//login logic
router.post("/login", function(req, res, next) {
  passport.authenticate("local",{
    successRedirect: "/PocketMarket",
    failureRedirect: "login",
    successFlash: " Welcome " + req.body.username + "!"
  })(req, res);
});

// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/PocketMarket");
});

export default router;







  
    