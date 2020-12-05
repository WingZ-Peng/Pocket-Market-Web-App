import express from 'express';
import p_market from '../models/p_market.js';
import Comment from '../models/comment.js';
import middleware from "../middleware/index.js";
import multer from 'multer';
import cloudinary from 'cloudinary';

const { isLoggedIn, checkAccountOwnership} = middleware;
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
        p_market.find({name: regex}, function(err, allp_markets){
           if(err){
              console.log(err);
           } else {
              res.render("p_markets/index", { p_markets: allp_markets });
           }
        });
    } else {
        p_market.find({}, function(err, allp_markets){
           if(err){
               console.log(err);
            } else {
                res.render("p_markets/index",{ p_markets: allp_markets});
              }
        });
    }
  });

  cloudinary.config({ 
    cloud_name: 'pocket-market', 
    api_key: process.env.apiKey, 
    api_secret: process.env.apiSecret
  });

  router.post("/", isLoggedIn, upload.single('image'), function(req, res) {
    console.log(req.body);
    cloudinary.uploader.upload(req.file.path, function(result) {
      req.body.p_market.image = result.secure_url;
      req.body.p_market.author = {
        id: req.user._id,
        username: req.user.username
      }

      p_market.create(req.body.p_market, function(err, p_market) {
        if (err || !p_market) {
          req.flash('error', err.message);
          return res.redirect('/p_markets');
        }
        res.redirect('/p_markets/' + p_market.id);
      });
    });
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("p_markets/new");
});

router.get("/:id", function(req, res) {
    p_market.findById(req.params.id).populate("comments").exec(function(err, foundp_market) {
        if (err || !foundp_market) {
            req.flash("error","The pocket market doesn't exit.");
            res.redirect("/p_markets");
        }
        else {
            res.render("p_markets/show", { p_market : foundp_market });
        }
    });
});

router.get("/:id/edit", checkAccountOwnership, function(req, res) {
    p_market.findById(req.params.id, function(err, foundp_market ) {
        if (err || !foundp_market) {
             req.flash("error","You don't own this post");
             res.redirect("/p_markets");
        } 
        else {
            res.render("p_markets/edit",  { p_market: foundp_market }); 
        }
    });
});

router.put("/:id", checkAccountOwnership, upload.single('image'), function(req, res) {
    if(req.file){
        cloudinary.uploader.upload(req.file.path, function(result) {
          req.body.p_market.image = result.secure_url;
          req.body.p_market.body = req.sanitize(req.body.p_market.body);
          p_market.findByIdAndUpdate(req.params.id, req.body.p_market, function(err, updatedp_market) {
                if (err || !updatedp_market) {
                    res.redirect("/p_markets");
                }
                else {
                    req.flash("success","Successfully updated!");
                    res.redirect("/p_markets/" + req.params.id);
                }
            });
        });

    } else {
        req.body.p_market.body = req.sanitize(req.body.p_market.body);
        p_market.findByIdAndUpdate(req.params.id, req.body.p_market, function(err, updatedp_market) {
            if (err || !updatedp_market) {
                res.redirect("/p_markets");
            }
            else {
                req.flash("success","Successfully updated!");
                res.redirect("/p_markets/" + req.params.id);

            }
        });
    }
});

router.delete("/:id", checkAccountOwnership, function(req, res) {
    p_market.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/p_markets");

        }
        else {
            req.flash("success","Successfully deleted.");
            res.redirect("/p_markets");
        }
    });
});

export default router;