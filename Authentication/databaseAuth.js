require('dotenv').config();
const pool = require('../Database/Connection');
const jwt = require('jsonwebtoken');

module.exports = (req , res , next) => {
    
    
    
        pool.connect((err,client,done) =>{
            if(err){
                return res.status(404).json({
                    message : "Couldn't connect to DB :/"
                })
            }
        });

        pool.query('Select token from authenticate where username = $1',[req.body.enroll],(problem,result) => {
            if ( problem ) {
                console.log(problem)
            } else {

                    if (result.rowCount == 1 ) {
                        const dBToken = result.rows[0].token;
                        dBToken == '0' ? console.log(dBToken) : console.log("Not zero"+dBToken); 
                        try{
                                const decode = jwt.verify(dBToken,process.env.JWT_KEY);
                                return res.status('300').json({
                                    message : 'A link has already been sent to the given email address'
                                })
                        }catch(e){
                                
                            if ( e.message == 'jwt expired'){
                                console.log("yes")

                                pool.query('Delete from authenticate where username = $1',[req.body.enroll],(problem,results)=>{
                                    if(problem) {
                                        console.log(problem+"prob");
                                    }else {
                                        console.log(results);
                                    }
                                });
                            }else{
                                console.log("something else"+e.message);
                            }
                        }        
                     
                    } else {
                        next();
                    }          
                }
        });
    }
