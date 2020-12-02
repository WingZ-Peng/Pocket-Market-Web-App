import Comment from '../models/comment.js';
import pocketMarket from '../models/pocketMarket.js';

const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {  
      return next();
  } else{
       req.flash("error","Please login!");
       res.redirect("/login");
 }}

middlewareObj.checkAccountOwnership = function (req, res, next){
  if (req.isAuthenticated()) {
    pocketMarket.findById(req.params.id, function(err, foundpocketMarket) {
      if(err || !foundpocketMarket){
          req.flash('error', 'Post do not exit!');
          res.redirect('/PocketMarket');
      } else {
        if(foundpocketMarket.author.id.equals(req.user._id)){
        next();
        } else {
          req.flash('error', 'Permission denied!');
          res.redirect("Go back");
        }
      }})
    }else{
      req.flash("error","Please login");
      res.redirect("back"); 
    }
  }

middlewareObj.checkCommentOwnership = function (req, res, next){
  if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment){
         if(err || !foundComment){
             req.flash('error', 'Comment do not exist!');
             res.redirect('/PocketMarket');
         } else {
           pocketMarket.findById(req.params.id, function(err, foundpocketMarket){
             if (err || !foundpocketMarket){
               req.flash("error", "Post do not exit!");
               res.redirect("PocketMarket");
             } else {
               if(foundComment.author.id.equals(req.user._id)){
               next();
              } else {
                req.flash('error', 'Permission denied!');
                res.redirect("Go back");
              }}})
            }
          })
        }else {
          req.flash("error","Please login");
          res.redirect("back"); 
        }}

export default middlewareObj;