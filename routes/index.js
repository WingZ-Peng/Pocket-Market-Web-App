import express from 'express';
import User from '../models/user.js';
import passport from 'passport';
import pocketMarket from '../models/pocketMarket.js';

const router = express.Router();

//show register form
router.get("/register", function(req, res) {
  res.render("register");
});

/**
 * User registration
 * Registration logic
 */

 //Sign up logic
router.post('/register', function (req, res, next) {

    // console.log(req.body);
    var newUser = new User ({
          username: req.body.username, 
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
    });
    User.register(newUser, req.body.password, function(err, user){
      if(err){
          req.flash("error", "Please try it again")
          res.redirect('/register');
      }else {
          passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to Pocket Market! Nice to meet you " + user.username);
          res.redirect("/PocketMarket"); 
      });
    }});
});

router.get("/", function(req, res){
  res.render("landing");
});

//show login form
router.get("/login", function(req, res){
  res.render("login"); 
});

//login logic
router.post("/login", passport.authenticate("local",{
    successRedirect: "/PocketMarket",
    failureRedirect: "/login",
    successFlash: " Welcome "
  }), 
  function(req, res) {});

// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/PocketMarket");
});

//User Profile
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser){
     if(err){
         req.flash("error", "Please try it angin!");
         res.redirect("/PocketMarket");
     } else {
         pocketMarket.find().where('author.id').equals(foundUser._id).exec(function(err, founder){
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

export default router;







  
    