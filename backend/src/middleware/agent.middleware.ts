import { Request, Response, NextFunction } from "express";
import { getServerIdByAgentToken } from "../services/agent-token.service";

export interface AgentAuthenticatedRequest extends Request {
    agent?: {
        serverId: string;
        userId: string;
    };
}

export async function agentMiddleware( req: AgentAuthenticatedRequest, res: Response, next: NextFunction ): Promise<void> {

    const authorization = req.headers.authorization;

    if (!authorization) {
        res.status(401).json({
            success: false,
            message: "Agent authentication required"
        });
        return;
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        res.status(401).json({
            success: false,
            message: "Invalid agent authorization"
        });
        return;
    }

    try{
        const result = await getServerIdByAgentToken(token);

        if(!result){
            throw new Error("Invalid agent token or server not found")
        }

       const {id: serverId, user_id: userId} = result;
    
        if (!serverId) {
            res.status(401).json({
                success: false,
                message: "Invalid agent credentials"
            });
            return;
        }
    
        req.agent = {serverId, userId};
    
        next();

    } catch(error){
        console.error("Agent authentication failed:", error);

        res.status(500).json({
            success:false,
            message: "Agent authentication failed"
        });
    }

}



