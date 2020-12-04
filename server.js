import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import localPassport from 'passport-local';
import flash from 'connect-flash';
import moment from 'moment';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import expressSanitizer from 'express-sanitizer';
import session from "express-session";
<<<<<<< HEAD
import p_market from './models/p_market.js';
import Comment from './models/comment.js';
=======
>>>>>>> dc91df450211922493cfdc161c06cede356f9d3d
import User from './models/user.js';
import indexRouters from './routes/index.js';
import commentRoutes from "./routes/comments.js";
import p_marketRoutes from "./routes/p_market.js";




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
app.use(cookieParser('serect'));
app.use(express.static(process.cwd()+ "/public"));
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
<<<<<<< HEAD
=======
app.locals.moment = moment;
>>>>>>> dc91df450211922493cfdc161c06cede356f9d3d

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

app.use("/", indexRouters);
app.use("/p_markets", p_marketRoutes); 
app.use("/p_market/:id/comments", commentRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log('Server running on port: ${PORT}')))
    .catch((error) => console. log(error.message));  


