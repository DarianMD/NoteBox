import User from "../models/user.model.js";

export const register = async (req, res) => {
    const{email, username, password} = req.body

    
    try{
        const newUser = new User({
            email,
            username,
            password
        })
    
        await newUser.save()
    

    } catch(error)
    {
        console.log(error)
    }

   
    res.send('registred')

};
export const login = (req, res) => res.send('login');