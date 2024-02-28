import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const{email, username, password} = req.body

    const passwordhash = await bcrypt.hash(password, 10);
    
    try{
        const newUser = new User({
            email,
            username,
            password: passwordhash,
        });
    
        const userSaved = await newUser.save();

        jwt.sign({id:userSaved.id})
        res.json({id: userSaved.id, username: userSaved.username, email: userSaved.email})
        

    } catch(error)
    {
        console.log(error)
    }

   
};
export const login = (req, res) => res.send('login');