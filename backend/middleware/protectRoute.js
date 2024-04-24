import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute =  async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if (!token){
            return res.status(401).json({error:"Unauthorised - No token provided"});   
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error : "UnAuthorised - Invalid Token "});

        }
        const user = await User.findById(decoded.userId).select("-password");
         // we call it userId because thats we call it in generateToken.js
         if (!user){
            return res.status(404).json({error : "User not found "});
         } 
         req.user = user 

         next(); // after this protectRoute function it will go to next sendMessage() in message.Routes.js take a look 
    } catch (error) {
        console.log("Error in protectROute middleware: ",error.message)
        res.status(500).json({error : "Internal Server error"});
    }
}

export default protectRoute;