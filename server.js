import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import localPassport from 'passport-local';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import expressSanitizer from 'express-sanitizer';
import session from "express-session";
import PocketMarket from './models/pocketMarket.js';
import Comment from './models/comment.js';
import User from './models/user.js';
import userRouters from './routes/index.js';
import commentRoutes from "./routes/comments.js";
import pocketMarketRoutes from "./routes/pocketMarket.js";

const app = express();
dotenv.config();
app.set("view engine", "ejs");

app.use(cors());
app.use(flash());
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser('secret'));
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Passport configuration
app.use(session({
    secret:"Pocket Market",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
 });

app.use("/", userRouters);
app.use('/pocketMarket', pocketMarketRoutes); 
app.use('/pocketMarket/:id/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log('Server running on port: ${PORT}')))
    .catch((error) => console. log(error.message));  



