require('dotenv').config();
const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const pool = require('../Database/Connection');
const checkAuth = require('../Authentication/userAuth');


 
const validateUsers = (user , res) => {
    if(user.password.length < 8 ){
        console.log(user.password.length);
       return res.status(409).json({
            message : "Password length less than 7 characters "
        })
    }else if(user.username.length !=10 && user.branch != 'FID'){
      return  res.status(409).json({
            message : "Improper username"
        })
    }else if(user.branch ==='FID' && user.username.length !=6){
        return res.status(409).json({
            message : "Improper username"
        })
    }else{
       

            pool.connect((err,client,done)=>{
                if(err){
                    console.log(err  + "\n" + client);
                 return  res.status(404).json({
                        message : "Couldn't connect to DB :/"
                    })
                }
     

            pool.query("Select * from authenticate where username = $1 and branch = $2" ,[user.username , user.branch] , (error, results)=>{
                done();
                if(error){   return;     }else{
                    if(results.rowCount === 0){
                        
                        return res.status(455).json({
                            message : "User Out Of Bounds xD"
                        })
                        
                    }else{
                            hash = results.rows[0].password;

                            bcrypt.compare(user.password , hash , (err ,reply)=>{

                                    if(reply){

                                        const payload = {
                                            userId : results.rows[0].username,
                                            binCheck : user.branch
                                        }
                                        const usertoken = jwt.sign(payload , process.env.JWT_KEY , {
                                            expiresIn : 1800
                                        })

                                      return res.status(200).json({
                                          usertoken : usertoken
                                        });
                                          
                    
                                        
                                    }else{
                                       return  res.status(422).json({
                                            message : "Password mismatch"
                                        })
                                    }
                            })
                        }
                }
            })
        })
        }
    }


loginRouter.post('/',(req,res,next)=>{
    
    const user = { 
        username : req.body.name,
        password : req.body.pass,
        branch : req.body.branch
    };

    console.log(user); 

    validateUsers(user , res);
    
});


module.exports = (loginRouter);