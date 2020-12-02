import express from 'express';
import pocketMarket from '../models/pocketMarket.js';
import Comment from '../models/comment.js';
import middlewareObj from "../middleware/index.js";
import multer from 'multer';
import cloudinary from 'cloudinary';

const router = express.Router();

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
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        pocketMarket.find({name: regex}, function(err, allPocketMarket){
           if(err){
              console.log(err);
           } else {
              res.render("PocketMarket/index", { PocketMarket: allPocketMarket });
           }
        });
    } else {
        pocketMarket.find({}, function(err, allPocketMarket){
           if(err){
               console.log(err);
            } else {
                res.render("PocketMarket/index",{ PocketMarket: allPocketMarket});
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
      req.body.pocketMarket.image = result.secure_url;
      req.body.pocketMarket.author = {
        id: req.user._id,
        username: req.user.username
      }
      
      pocketMarket.create(req.body.pocketMarket, function(err, pocketMarket) {
        if (err || !pocketMarket) {
          req.flash('error', err.message);
          return res.redirect('/PocketMarket');
        }
        res.redirect('/PocketMarket/' + pocketMarket.id);
      });
    });
});

router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    res.render("PocketMarket/new");
});

router.get("/:id", function(req, res) {
    pocketMarket.findById(req.params.id).populate("comments").exec(function(err, foundpocketMarket) {
        if (err || !foundpocketMarket) {
            req.flash("error","The pocket market doesn't exit.");
            res.redirect("/PocketMarket");
        }
        else {
            res.render("PocketMarket/show", { pocketMarket : foundpocketMarket });
        }
    });
});

router.get("/:id/edit", middlewareObj.checkAccountOwnership, function(req, res) {
    pocketMarket.findById(req.params.id, function(err, foundpocketMarket ) {
        if (err || !foundpocketMarket) {
             req.flash("error","You don't own this post");
             res.redirect("/PocketMarket");
        } 
        else {
            res.render("PocketMarket/edit",  { pocketMarket: foundpocketMarket }); 
        }
    });
});

router.put("/:id", middlewareObj.checkAccountOwnership, upload.single('image'), function(req, res) {
    if(req.file){
        cloudinary.uploader.upload(req.file.path, function(result) {
          req.body.pocketMarket.image = result.secure_url;
          req.body.pocketMarket.body = req.sanitize(req.body.pocketMarket.body);
          pocketMarket.findByIdAndUpdate(req.params.id, req.body.pocketMarket, function(err, updatedpocketMarket) {
                if (err || !updatedpocketMarket) {
                    res.redirect("/PocketMarket");
                }
                else {
                    req.flash("success","Successfully updated!");
                    res.redirect("/PocketMarket/" + req.params.id);
                }
            });
        });

    } else {
        req.body.pocketMarket.body = req.sanitize(req.body.pocketMarket.body);
        pocketMarket.findByIdAndUpdate(req.params.id, req.body.pocketMarket, function(err, updatedpocketMarket) {
            if (err || !updatedpocketMarket) {
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
    pocketMarket.findByIdAndRemove(req.params.id, function(err) {
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