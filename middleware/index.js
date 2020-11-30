var Comment = require('../models/comment');
var PocketMarket =('../models/pocketMarket');

module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'You need to sign in first!');
        res.redirect('/login');
    },

    checkAccountOwnership: function(req, res, next){
      PocketMarket.findById(req.params.id, function(err, foundPocketMarket){
        if(err || !foundPocketMarket){
            console.log(err);
            req.flash('error', 'Sorry, the post dosen\'t exit!');
            res.redirect('/pocketMarket');
        } else if(foundPocketMarket.author.id.equals(req.user._id) || req.user.isAdmin){
            req.pocketMarket = foundPocketMarket;
            next();
        } else {
            req.flash('error', 'You don\'t have permission!');
            res.redirect('/pocketMarket/' + req.params.id);
        }
      });
    },

    checkCommentOwnership: function(req, res, next){
      Comment.findById(req.params.commentId, function(err, foundComment){
         if(err || !foundComment){
             console.log(err);
             req.flash('error', 'Sorry, the comment doesn\'t exist!');
             res.redirect('/pocketMarket');
         } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
              req.comment = foundComment;
              next();
         } else {
             req.flash('error', 'You don\'t have permission to do that!');
             res.redirect('/pocketMarket/' + req.params.id);
         }
      });
    },

    isAdmin: function(req, res, next) {
      if(req.user.isAdmin) {
        next();
      } else {
        req.flash('error', 'Your don\'t have perssion to edit it.');
        res.redirect('back');
      }
    },
}