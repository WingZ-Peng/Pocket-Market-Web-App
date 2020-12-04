import Comment from '../models/comment.js';
import p_market from '../models/p_market.js';

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
    p_market.findById(req.params.id, function(err, foundp_market) {
      if(err || !foundp_market){
          req.flash("error", "Post do not exit!");
          res.redirect("/p_markets");
      } else {
        if(foundp_market.author.id.equals(req.user._id)){
        next();
        } else {
          req.flash("error", "Permission denied!");
          res.redirect("Go back");
        }
      }})
    }else{
      req.flash("error","Please login");
      res.redirect("Go back"); 
    }
  }

middlewareObj.checkCommentOwnership = function (req, res, next){
  if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment){
         if(err || !foundComment){
             req.flash("error", "Comment do not exist!");
             res.redirect("/p_markets");
         } else {
           p_market.findById(req.params.id, function(err, foundp_market){
             if (err || !foundp_market){
               req.flash("error", "Post do not exit!");
               res.redirect("/p_markets");
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
          res.redirect("Go back"); 
        }}

export default middlewareObj;