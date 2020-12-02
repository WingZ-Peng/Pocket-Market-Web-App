import express from 'express';
import Comment from '../models/comment.js';
import pocketMarket from '../models/pocketMarket.js';
import middlewareObj from "../middleware/index.js";
import moment from "moment";

const router = express.Router({ mergeParams: true });
const { isLoggedIn, checkCommentOwnership} = middlewareObj;

//get new comment
router.get("/new", isLoggedIn, function(req, res) {
    pocketMarket.findById(req.param.id, function(err, pocketMarket){
        if (err || !pocketMarket){
            req.flash("error", "Please try it later");
            return res.redirect("/PocketMarket");
        }else {
            res.render("comments/new", {pocketMarket: pocketMarket });
        }
    });
});

//create comments
router.post("/", isLoggedIn, function(req, res) {
    pocketMarket.findById(req.params.id, function(err, foundpocketMarket) {
        if (err || !foundpocketMarket) {
            req.flash("error","Please try it again!");
            return res.redirect("/PocketMarket");
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
                    foundpocketMarket.comments.push(comment._id);
                    foundpocketMarket.save();
                    req.flash("success","Comment successfully added.");
                    res.redirect('/PocketMarket/' + foundpocketMarket._id);
                }
            });
        }
    });
});

//update comments
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.param.comment_id, req.body.comment, function(err, updateComment){
        if (err) {
            req.flash("error","Please try it later!");
            res.redirect(" Go back");
        } else{
            req.flash("success", "Comment successfully updated!")
            res.redirect("/PocketMarket" + req.params.id);
        }
    });
});

//edit comments
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
    pocketMarket.findById(req.params.id, function(err, foundpocketMarket) {
        if(err || !foundpocketMarket){
            req.flash("error", "Please try it later!")
            return res.redirect("/PocketMarket");
        } Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error","Please try it again!");
                res.redirect("/PocketMarket");
            } else {
              res.render("comments/edit", {pocketMarket_id: req.params.id, comment: foundComment}); 
            }
        });
    });
});

//delete comments
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error","Please try it later!");
            res.redirect("/PocketMarket");
        } else {
            req.flash("success","Comment deleted.");
            res.redirect("/PocketMarket/" + req.params.id);
        }
    });
});

export default router;