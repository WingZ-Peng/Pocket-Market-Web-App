import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import localPassport from 'passport-local';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import expressSanitizer from 'express-sanitizer';
import session from "express-session";
import User from './models/user.js';
import indexRoutes from './routes/index.js';
import commentRoutes from "./routes/comments.js";
import p_marketRoutes from "./routes/p_markets.js";

const app = express();
dotenv.config();
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(process.cwd()+ "/public")); //CSS files
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));

app.use(session({
    secret: "emacs",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use(indexRoutes);
app.use("/p_markets", p_marketRoutes);
app.use("/p_markets/:id/comments", commentRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log('Server running on port: ${PORT}')))
    .catch((error) => console. log(error.message));  