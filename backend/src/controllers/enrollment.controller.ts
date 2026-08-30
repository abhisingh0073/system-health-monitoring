import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { connectServerWithEnrollmentToken, createEnrollmentToken } from "../services/enrollmentToken.service";
import { success } from "zod";

export async function generateEnrollmentTokenConroller(req: AuthenticatedRequest, res: Response): Promise<void>{
    try{
        const userId = req.user!.userId;

        const result = await createEnrollmentToken(userId);

        res.status(201).json({
            success: true,
            message: "Enrollment token generated",
            data: {
                token: result.token,
                expiresAt: result.expiresAt,
            }
        })
    } catch(error){
        console.error("Failed to generate enrollement token");

        res.status(500).json({
            success: false,
            message: "Failed to generate enrollment token",
        })
    }
}



export async function connectServerController(req:Request, res:Response): Promise<void> {
    
    const {token, hostname, ipAddress, osName, agentVersion} = req.body;

    if(!token || !hostname || !ipAddress || !osName || !agentVersion){
        res.status(400).json({success:false, message: "Missing required fields"});
        return;
    }

    try{
        const result = await connectServerWithEnrollmentToken({
            token, hostname, ipAddress, osName, agentVersion,
        });

        res.status(201).json({success: true,
                             message: "Server enrolled successfully",
                             data: {
                                serverId: result.server.id,
                                agentToken: result.agentToken,
                             }
                        });
        
    } catch(error){
        console.log("server enrollement failed:", error);

        res.status(400).json({success: false, 
            message: 
                error instanceof Error 
                ? error.message 
                : "Server enrollment failed"});
    }
}