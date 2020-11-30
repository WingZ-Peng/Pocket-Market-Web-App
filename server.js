import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import seedDB from './seed.js';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import localPassport from 'passport-local';
import flash from 'connect-flash';
import PocketMarket from './models/pocketMarket.js';
import Comment from './models/comment.js';
import UserInformation from './models/userInformation.js';
import commentRoutes from './routes/comments.js';
import pocketMarketRoutes from './routes/pockectMarket.js';
import userRouters from './routes/user.js';

const app = express();
dotenv.config();
app.set("view engine", "ejs");

app.use(cors());
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
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

app.use('/posts', postRoutes);
app.use('/users', usersControllers); 
app.use('/', userRouters);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log('Server running on port: ${PORT}')))
    .catch((error) => console. log(error.message));  

mongoose.set('useFindAndModify', false);
