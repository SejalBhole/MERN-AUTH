import userModel from "../models/usermodel.js";

export const getuserData = async (req, res)=>{
    try{

        const {userId} = req.body;    //get userid

        //find user in the db using this userid
        const user = await userModel.findById(userId);
        
        if(!user){
            return res.json({success: false, message: "User not found"});
        } 

        //send user data to client
        res.json({success: true, 
                  userData: {
                    name: user.name,
                    isAccountVerified: user.isAccountVerified
                  } });



    }catch(error){
        return res.json({success: false, message: error.message});
    }
}