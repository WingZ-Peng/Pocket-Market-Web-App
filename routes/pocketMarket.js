import express from 'express';
import PocketMarket from '../models/pocketMarket.js';
import Comment from '../models/comment.js';
import middlewareObj from "../middleware/index.js";
import multer from 'multer';
import cloudinary from 'cloudinary';

var router = express.Router();

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, callingback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return callingback(new Error('Upload image format(eg. jpg, jpeg, png, gif), please!'), false);
    }
    callingback(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", function(req, res){
    if(req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        PocketMarket.find({name: regex}, function(err, allPocketMarket){
           if(err){
              console.log(err);
           } else {
              res.render("PocketMarket/index", { pocketMarket: allPocketMarket });
           }
        });
    } else {
        PocketMarket.find({}, function(err, allPocketMarket){
           if(err){
               console.log(err);
           } else if(req.xhr) {
                res.json(allPocketMarket);
            } else {
                res.render("PocketMarket/index",{ pocketMarket: allPocketMarket});
              }
        });
    }
  });

  cloudinary.config({ 
    cloud_name: 'pocket-market', 
    api_key: process.env.apiKey, 
    api_secret: process.env.apiSecret
  });

  router.post("/", middlewareObj.isLoggedIn, upload.single('image'), function(req, res) {
    console.log(req.body);
    cloudinary.uploader.upload(req.file.path, function(result) {
      req.body.PocketMarket.image = result.secure_url;
      req.body.PocketMarket.author = {
        id: req.userInformation._id,
        username: req.userInformation.username
      }
      
      PocketMarket.create(req.body.PocketMarket, function(err, PocketMarket) {
        if (err || !PocketMarket) {
          req.flash('error', err.message);
          return res.redirect('/PocketMarket');
        }
        res.redirect('/PocketMarket/' + PocketMarket.id);
      });
    });
});

router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    res.render("PocketMarket/new");
});

router.get("/:id", function(req, res) {
    PocketMarket.findById(req.params.id).populate("comments").exec(function(err, foundPocketMarket) {
        if (err || !foundPocketMarket) {
            req.flash("error","The pocket market doesn't exit.");
            res.redirect("/PocketMarket");
        }
        else {
            res.render("PocketMarket/show", { pocketMarket : foundPocketMarket });
        }
    });
});

router.get("/:id/edit", middlewareObj.checkAccountOwnership, function(req, res) {
    PocketMarket.findById(req.params.id, function(err, foundPocketMarket ) {
        if (err || !foundPocketMarket) {
             req.flash("error","You don't own this post");
             res.redirect("/PocketMarket");
        } 
        else {
            res.render("PocketMarket/edit",  { pocketMarket: foundPocketMarket }); 
        }
    });
});

router.put("/:id", middlewareObj.checkAccountOwnership, upload.single('image'), function(req, res) {
    if(req.file){
        cloudinary.uploader.upload(req.file.path, function(result) {
          req.body.PocketMarket.image = result.secure_url;
          req.body.PocketMarket.body = req.sanitize(req.body.PocketMarket.body);
          PocketMarket.findByIdAndUpdate(req.params.id, req.body.PocketMarket, function(err, updatedPocketMarket) {
                if (err || !updatedPocketMarket) {
                    res.redirect("/PocketMarket");
                }
                else {
                    req.flash("success","Successfully updated!");
                    res.redirect("/PocketMarket/" + req.params.id);
                }
            });
        });

    } else {
        req.body.PocketMarket.body = req.sanitize(req.body.PocketMarket.body);
        PocketMarket.findByIdAndUpdate(req.params.id, req.body.PocketMarket, function(err, updatedPocketMarket) {
            if (err || !updatedPocketMarket) {
                res.redirect("/PocketMarket");
            }
            else {
                req.flash("success","Successfully updated!");
                res.redirect("/PocketMarket/" + req.params.id);
    
            }
        });
    }
});

router.delete("/:id", middlewareObj.checkAccountOwnership, function(req, res) {
    PocketMarket.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/PocketMarket");

        }
        else {
            req.flash("success","Successfully deleted.");
            res.redirect("/PocketMarket");
        }
    });
});

export default router;