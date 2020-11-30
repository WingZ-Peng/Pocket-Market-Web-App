var Comment = require('../models/comment');
var PocketMarket = require('../models/pocketMarket');
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
  return next();
}
req.flash("error","Please login first!");
res.redirect("/login");
}

middlewareObj.isAdmin = function (req, res, next) {
  if(req.user.isAdmin) {
    next();
  }else{
    req.flash('error', 'Please login to make action!')
    res.redirect('Go back');
  }
},

middlewareObj.checkAccountOwnership = function (req, res, next){
  if (req.isAuthenticated()) {
    PocketMarket.findById(req.params.id, function(err, foundPocketMarket) {
      if(err || !foundPocketMarket){
          console.log(err);
          req.flash('error', 'Post do not exit!');
          res.redirect('/pocketMarket');
      } else if(foundPocketMarket.author.id.equals(req.user._id) || req.user.isAdmin){
        req.pocketMarket = foundPocketMarket;
        next();
      } else {
          req.flash('error', 'Permission denied!');
          res.redirect("Go back");
        }
      });
    }},

middlewareObj.checkCommentOwnership = function (req, res, next){
  if (req.isAuthenticated()) {
      Comment.findById(req.params.commentId, function(err, foundComment){
         if(err || !foundComment){
             console.log(err);
             req.flash('error', 'Comment do not exist!');
             res.redirect('/pocketMarket');
         } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
              req.comment = foundComment;
              next();
         } else {
             req.flash('error', 'Permission denied!');
             res.redirect("Go back");
         }
      });
    }},

module.exports = middlewareObj;