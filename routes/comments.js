import express from 'express';
import Comment from '../models/comment.js';
import p_market from '../models/p_market.js';
import middleware from "../middleware/index.js";
import moment from "moment";

const router = express.Router({ mergeParams: true });
const { isLoggedIn, checkCommentOwnership} = middleware;

//get new comment
router.get("/new", isLoggedIn, function(req, res) {
    p_market.findById(req.param.id, function(err, p_market){
        if (err || !p_market){
            req.flash("error", "Please try it later");
            return res.redirect("/p_markets");
        }else {
            res.render("comments/new", {p_market: p_market });
        }
    });
});

//create comments
router.post("/", isLoggedIn, function(req, res) {
    p_market.findById(req.params.id, function(err, foundp_market) {
        if (err || !foundp_market) {
            req.flash("error","Please try it again!");
            return res.redirect("/p_markets");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                }
                //add/save comment
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.dateAdded = moment(Date.now()).format("DD/MM/YYYY");
                    comment.save();
                    foundp_market.comments.push(comment._id);
                    foundp_market.save();
                    req.flash("success","Comment successfully added.");
                    res.redirect('/p_markets/' + foundp_market._id);
                }
            });
        }
    });
});

//update comments
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.param.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            req.flash("error","Please try it later!");
            res.redirect(" Go back");
        } else{
            req.flash("success", "Comment successfully updated!")
            res.redirect("/p_markets" + req.params.id);
        }
    });
});

//edit comments
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
    p_market.findById(req.params.id, function(err, foundp_market) {
        if(err || !foundp_market){
            req.flash("error", "Please try it later!")
            return res.redirect("/p_markets");
        } Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error","Please try it again!");
                res.redirect("/p_markets");
            } else {
              res.render("comments/edit", {p_market_id: req.params.id, comment: foundComment}); 
            }
        });
    });
});

//delete comments
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error","Please try it later!");
            res.redirect("/p_markets");
        } else {
            req.flash("success","Comment deleted.");
            res.redirect("/p_markets/" + req.params.id);
        }
    });
});

export default router;