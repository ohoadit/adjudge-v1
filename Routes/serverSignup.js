require('dotenv').config();
const express = require('express');
const signupRouter = express.Router();
const bcrypt = require('bcrypt-nodejs');
const checkAuth = require('../Authentication/userAuth');
const dBAuth = require('../Authentication/databaseAuth');
const jwt = require('jsonwebtoken');
const pool = require('../Database/Connection');
const nodemailer = require('nodemailer');
let globToken = "";


const crossCheckUser = (userDetails) => {

    setTimeout(()=>{

        pool.query('Select password from authenticate where username=$1',[userDetails.enroll],(prob,results)=>{
            if (prob) console.log(prob);
            else {
                if ( results.rows[0].password === null){
                    pool.query('Delete from authenticate where username = $1',[userDetails.enroll],(pain,grade)=>{
                        if ( pain ) console.log(pain);
                        else console.log(grade);
                    })
                }else {
                    return;
                }
            }
        })
        
    },180000)
}

const sendToken = (req , cred , res) =>{

        const payload = {
            userId : cred.enroll,
            email : cred.email,
            branch : cred.branch
        }

        const resetToken = jwt.sign(payload , process.env.JWT_KEY ,{
            expiresIn : 180
        })

        globToken = resetToken;
      const sender = nodemailer.createTransport({
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : process.env.email,
            pass : process.env.pass
        } 
    });

    const mailOptions = {
        from : 'Adjudge <'+ process.env.email+'>',
        to : cred.email,
        subject : "Password Reset",
        html : '<p style="font-size : 18px">We have received a request to reset your adjudge password if it was not you just let us know.</p>'+
                '<p style="font-size : 18px">Reset link is as follows and expires in 30 minutes.<p> <br/>'+'http://localhost:3000/signup/reset/' + resetToken
    }

    sender.sendMail(mailOptions , (err) => {
        if(err){
            console.log(err)
            return  res.status(301).json({
                message : "Mail not sent"
            })
        }else{
            console.log("Cool your message  has been sent");

            pool.query('Insert into authenticate (username , token) values ( $1 , $2 )',[ cred.enroll , resetToken] , (prob , result) => {
                    if(prob) {
                        console.log("Problem"+prob);
                    } else {
                        console.log("Done");
                    }
            });
            return res.status(201).json({
                message : 'An email has been sent to the given email address.'
          })
        }
    })
}

const validate = ( req , signupRequest , res) => {

    const rex = /^[a-z]{5,30}\.1[6-9]{1}\.it@iite\.indusuni\.ac\.in$/

                if(signupRequest.enroll === "" || signupRequest.email === "" || signupRequest.branch ==="" ){
                    return res.status(422).json({
                        message : 'Empty Fields Not allowed'
                    })

                }else if(signupRequest.enroll.length !==10){
                    return res.status(422).json({
                        message : 'Invalid Username'
                    })

                }else if(!rex.test(signupRequest.email)){
                    return res.status(422).json({
                        message : 'Invalid Email'
                    })

                }else{
                    pool.query('Select * from authenticate where username = $1',[signupRequest.enroll] , (error ,results)=>{
                        
                        if(error) {
                            console.log(error)
                        }else {
                            if(results.rowCount === 0){
                                sendToken(req , signupRequest ,res);
                                crossCheckUser(signupRequest);
                                console.log(globToken);
                            }else {
                                return res.status(409).json({
                                    message : 'User already exists'
                                })
                            }
                        }

                    })
                    
                }
}


signupRouter.post('/',dBAuth,(req,res,next) =>{

    

        const signupRequest = {
            enroll : req.body.enroll,
            email : req.body.email,
            branch : req.body.branch
        }
        validate(req , signupRequest , res)        
})



signupRouter.post('/reset', checkAuth,(req,res,next) => {

    const register = {
        pass : req.body.pass,
        confirm : req.body.confirm
    }

    console.log(register)

     if(register.pass === "" || register.confirm === ""){
         return res.status(422).json({
             message : 'Empty Fields Not allowed'
         })
     }else if(register.pass.length < 7 || register.confirm.length < 7){
         return res.status(422).json({
             message : 'Password not upto the semantics'
         })
     }else if(register.pass != register.confirm){
         return res.status(422).json({
             message : 'Password doesn\'t match'
         })
     }else{
         console.log(req.decodedToken);
         pool.query('Select * from authenticate where username = $1',[req.decodedToken.userId],(err,results) =>{
             if(err){
                 console.log(err)
             }else{

                const genSalts = bcrypt.genSalt(10 , (error , result) => { })
                    bcrypt.hash(register.pass , genSalts, null ,  (prob, hash) => {
                        if(prob){
                            console.log(prob);
                        }
                     
                        else{

                            if(results.rowCount == 0){
                                console.log("Yes");
                                
                                pool.query('Insert into authenticate values ($1 ,$2 , $3 , $4 ,$5)',
                                            [req.decodedToken.userId , hash , req.decodedToken.branch , req.decodedToken.email , "0"] , (error , final) => {
                                                if(error){
                                                    console.log(error)
                                                    res.status(401).json({
                                                        message : "Not created"
                                                    })
                                                }else{
                                                    if(final.rowCount == 1){
                                                        res.status(201).json({
                                                            message : "Successful Redirecting to login .."
                                                        })
                                                    }
                                                }
                                            });
                            } else if (results.rowCount == 1) {
                                console.log("One Finally");
                                console.log(req.decodedToken);
                                pool.query('Update authenticate set password = $2 , token = $4 , email = $5 , branch = $3 where username = $1',
                                            [req.decodedToken.userId , hash , req.decodedToken.branch ,"0",req.decodedToken.email] , (error , final) => {
                                                if(error){
                                                    console.log(error);
                                                    res.status(401).json({
                                                        message : "Not created"
                                                    })
                                                }else{
                                                    console.log("Inside Else");
                                                    if(final.rowCount == 1){
                                                        res.status(201).json({
                                                            message : "Reset Successful Redirecting login .."
                                                        })
                                                    }
                                                }
                                });
                            }
                        }            
                    });
                }
    });
}
})



module.exports = signupRouter;