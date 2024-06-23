import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req,res) =>{
    try {
        const {fullName,userName,password,confirmPassword,gender} = req.body;
        
        if(password!==confirmPassword){

            return res.status(400).json({error:"Passwords don't match"})

        }

        const user = await User.findOne({userName});

        if(user){
            return res.status(400).json({error:"User already exists"})
    
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${userName}`
        const girlProfile = `https://avatar.iran.liara.run/public/girl?username=${userName}`

        const newUser = new User({
            fullName:fullName,
            userName,
            password:hashedPassword,
            gender, 
            profilePic : gender === "male"  ? boyProfile : girlProfile
        })
        if(newUser){
        
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save()

        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            userName:newUser.userName,
            profilePic:newUser.profilePic
        })
        }else{
            res.status(400).json({error:"Invalid user data"})
        }
    } catch (error) {

        console.error(error);
        res.status(500).json({error:"internal Server error"})
        
    }
    
}


export const login = async (req,res) =>{
    try {
        const {userName,password} = req.body;
        // console.log("Request Body",req.body);
        const user = await User.findOne({userName}); 
        const isPasswordCorrect = await bcrypt.compare(password , user?.password || ""); 
        // If you send wrong credentials in the request body (such as an incorrect username or password), the User.findOne() method will likely return null because it won't find a user with the provided username in the database. In that case, user?.password will be null, and the expression user?.password || "" will evaluate to an empty string "".
        // console.log(isPasswordCorrect);
        if (!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid Username or password"});
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            userName:user.userName,
            profilePic:user.profilePic,
        });
        
    } catch (error) {
        console.error("Error in login controller",error.message);
        res.status(500).json({error:"INTErnal Server error"});
    }
    
}


export const logout  = (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge : 0});
        res.status(200).json({message : "Logged out successfully"});
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }
};



