import express from 'express';
import UserInformation from '../models/userInformation.js';

const router = express.Router();

var responseData;

router.use(function (req, res, next) {
    responseData = {
        code: 0,
        messsage: ''
    }
    next();
});

/**
 * User registration
 * Registration logic
 * 
 * User name connot be empty
 * Password cnnnot be empty
 * Enter the same password twice
 * 
 * Check the user has been registered
 * Database query
 */

router.post('/user/register', function (req, res, next) {

    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var repassword = req.body.repassword;
  
    // check user name if empty
    if (username == '') {
      responseData.code = 1;
      responseData.message = 'User name cannot be empty';
      res.json(responseData);
      return;
    }

    // check user password if empty
    if (password == '') {
      responseData.code = 2;
      responseData.message = 'Password cannot be empty';
      res.json(responseData);
      return;
    }

    //check user real firstname if empty
    if (firstname == '') {
      responseData.code = 3;
      responseData.message = 'Please enter your firstname';
      res.json(responseData);
      return;
    }

    //check user real lastname if empty
    if (lastname == '') {
      responseData.code = 4;
      responseData.message = 'Please enter your lastname';
      res.json(responseData);
      return;
    }

    //check user email if empty
    if (email == '') {
      responseData.code = 5;
      responseData.message = 'Please enter your email';
      res.json(responseData);
      return;
    }

    //Enter the same password twice
    if (password != repassword) {
        responseData.code = 6;
        responseData.message = 'Passwords do not match';
        res.json(responseData);
        return;
      }

      //Check the user has been registered
      UserInformation.findOne({
        username: username
      }).then(function (userInfo) {
        // console.log(userInfo);
        if (userInfo) {
          //record exists in the database
          responseData.code = 7;
          responseData.message = 'User name has existed';
          res.json(responseData);
          return;
        }
        // Save user registration information to the database
        var user = new UserInformation({
          username: username,
          password: password,
          firstname: firstname,
          lastname: lastname,
          email: email
        });
        return user.save();
      }).then(function (newUserInfo) {
        // console.log(newUserInfo);
        responseData.message = 'Registered successfully';
        res.json(responseData);
      });
    });

    /**
     * Log in
     */
    router.post('/user/login', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
      
        if (username == '' || password == '') {
          responseData.code = 1;
          responseData.message = 'The username and password cannot be empty';
          res.json(responseData);
          return;
        }

        // Check record if exist
        UserInformation.findOne({
            username: username,
            password: password
        }).then(function (userInfo) {
            if (!userInfo) {
                responseData.code = 2;
                responseData.message = 'Please try it again';
                res.json(responseData);
                return;
            }

            //Correct username and password
            responseData.message = 'Welcome';
            responseData.userInfo = {
                _id: userInfo._id,
                username: UserInfo.username
            };
            res.json(responseData);
            return;
        })
    });

    export default router;


