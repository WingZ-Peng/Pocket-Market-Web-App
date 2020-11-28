import express from 'express';
import UserInformation from '../models/userInformation.js';
import passport from 'passport';

const router = express.Router();

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
    var newUser = new UserInformation ({username: req.body.username, 
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email,
    });
    if(req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
    }
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
  res.render("login", {page: 'login'}); 
});

//login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/PocketMarket",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to PocketMarket!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/PocketMarket");
});

//User Profile
/*router.get("/users/:id", function(req, res) {
  UserInformation.findById(req.params.id, function(err, foundUser){
     if(err){
         req.flash("error", "Please try it angin");
         res.redirect("/s");
     } else {
         Pock.find().where('author.id').equals(foundUser._id).exec(function(err, foodFound){
             if(err) {
                 req.flash("error", "Something went wrong...");
                 res.redirect("/s");
             } else {
                 res.render("users/show", {user: foundUser, s: foodFound});
             }
         })
     }
  }); 
});
*/

module.exports = router;







  
    