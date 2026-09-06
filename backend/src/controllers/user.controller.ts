import { comparePassword, hashPassword } from "../lib/password";
import { userExistsByEmail, registerUser, getUserByEmail, getUserById } from "../services/user.service";
import { LoginUserSchema, RegisterUserSchema } from "../utils/validators";
import { Request, Response } from "express";
import { generateAccessToken } from "../lib/jwt";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { success } from "zod";

export async function UserRegisterController(req: Request, res: Response):Promise<void>{
   
    const result = RegisterUserSchema.safeParse(req.body);
    
    if(!result.success){
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.flatten().fieldErrors,
        })

        return;
    }
            
    const { name, email, password } = result.data;

    try{

        // check if user with the same email already exist or not
        const existingUser = await userExistsByEmail(email);
        if(existingUser){
            res.status(409).json({
                success: false, 
                message: "User with this email Already exists"
                });

            return;
        }
    
        // if(!validateEmail(email)){
        //     res.status(400).json({ success: false, message: "Invalid email format" });
        //     return;
        // }


        // hashing password
        const hashedPassword = await hashPassword(password);

        // creating new user
        const user = await registerUser(name, email, hashedPassword);

        res.status(201).json({
            success: true, 
            message: "User registered successfully", 
            data: { 
                user: { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email}}});

    } catch(error){
        console.error(error);
        res.status(500).json({success: false, message: "Failed to register user"});
    }

}



export async function userLoginController(req: Request, res: Response):Promise<any> {
    const result = LoginUserSchema.safeParse(req.body);
    
    if(!result.success){
        res.status(400).json({
            success: false,
            message: "Email does not exist",
            error:  result.error.flatten().fieldErrors,
        })
        return;
    }

    const {email, password} = result.data;
    
    try{
        const user = await getUserByEmail(email);
        if(!user){
            res.status(401).json({success: false, message: "Email or Password is Not Correct"});
            return;
        }
        
        const isMatched = await comparePassword(password, user.password);

        if(!isMatched){
            res.status(401).json({
                success: false,
                message: "Email or Password is not Correct",
            });
            return;
        }


        /// generating token using jwt
        const token = generateAccessToken(user.id);

        // setup of cookies for validation
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        }
    );


    res.status(200).json({
        success: true,
        message: "Login Successful",

        data:{
            user:{
                id:user.id,
                name:user.name,
                email: user.email,
            }
        }
    });



    } catch(error){
        console.log("Login error", error);
        res.status(500).json({
            success: false,
            message: "Failed to login",
        })

    }
}



export async function getCurrentUserController(req: AuthenticatedRequest, res:Response): Promise<void> {
    const userId = req.user!.userId;

    try{
        const user = await getUserById(userId);
        if(!user){
            res.status(404).json({
                success: false,
                message: "User not found",
            });

            return;
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            }
        });

    } catch(error){
        console.log("Get current user error: ", error);

        res.status(500).json({
            success: false,
            message: "Failed to get current user",
        })
    }

}