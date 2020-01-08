require('dotenv').config();
const jwt = require('jsonwebtoken');

 module.exports = (req , res , next) => {
     try {
        const token =  req.body.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.decodedToken = decoded;
        next();
     }catch(error) {

        console.log("Middleware Error : " + error);
         return res.status(401).json({
             message : "Invalid Token"
         })
     }
 }