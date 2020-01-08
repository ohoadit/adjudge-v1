require('dotenv').config();
const express = require('express');
const dashboardRouter = express.Router();
const jwt = require('jsonwebtoken');
const checkAuth = require('../Authentication/userAuth');
const pool = require('../Database/Connection');




dashboardRouter.post('/student',checkAuth,(req,res,next) => {

    
        const vote = {
            fid : req.body.fid,
            enroll : req.body.username,
            know : req.body.knowledge,
            teach : req.body.teaching,
            punc : req.body.punctuality,
            comm : req.body.communication,
            speed : req.body.speed,
            gift : req.body.optional
        }
        
        console.log(vote);
            if( vote.fid!=0 && vote.know!=0 && vote.teach!=0 && vote.punc!=0 && vote.comm!=0 && vote.speed!=0){

                    
                    pool.query("Update faculty set know=$2 , qot=$3 , punc=$4 , comm = $5 , speed = $6 , gift = $7 where enrollment = $1 and fid = $8" ,
                        [vote.enroll , vote.know , vote.teach ,
                            vote.punc , vote.comm , vote.speed ,vote.gift , vote.fid ] , (error , results) =>{
                                if(error){
                                    res.status(300).json({
                                        message : "Problem with the database"
                                    })
                                }else if(results.rowCount === 1){
                                    res.status(200).json({
                                        message : "Reponse Recorded"
                                    })
                                }
                        })
                        
            }else{
                res.status(300).json({
                    message : "Problem with the data"
                })
            }
})



dashboardRouter.post('/faculty',checkAuth,(req,res,next) => {
    
        pool.query('Select * from faculty where know !=0',null , (err , reply) =>{
            if(err){
                res.status(404).json({
                    message : "Error with the request"
                })
            }else{
                if(reply.rowCount > 0){

                    
                    console.log(reply.rows);

                    res.status(201).send(reply.rows);
                    
                }else{
                    res.status(501).json({
                        message : "Nothing to show"
                    })
                }
            }
        })
        
        
})





module.exports = (dashboardRouter);
