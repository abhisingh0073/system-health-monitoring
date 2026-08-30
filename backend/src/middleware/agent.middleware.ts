// import {Request, Response, NextFunction} from "express"
// import { getAgentToken, getServerIdByAgentToken } from "../services/agent-token.service";


// export interface AgentAuthenticatedRequest extends Request {
//     agent?: {
//         serverId: string;
//     };
// }



// export function agentMiddleware(req: AgentAuthenticatedRequest, res:Response, next:NextFunction){
//     const authorization = req.headers.authorization;

//     if(!authorization){
//         res.status(401).json({success: true, message: "Agent authentication required"});
//         return;
//     }

//     const [scheme, token] = authorization?.split(" ");

//     if(scheme !== "Bearer" || !token){
//         res.status(401).json({
//             success: false,
//             message: "Invalid agent authorization",
//         });

//         return;
//     }

//     const serverId = req.body.serverId;

//     if(!serverId){
//         res.status(400).json({
//             success: false,
//             message: "serverId is required",
//         });
//         return;
//     }


//     const storedToken = getAgentToken(serverId);
//     // const serverId = getServerIdByAgentToken(token);

//     if(!storedToken){
//         res.status(401).json({
//             success: false,
//             message: "Invalid agent credentials",
//         });

//         return;
//     }

//     if(token != storedToken){
//         res.status(401).json({
//             success: false,
//             message: "Invalid agent credentials",
//         });
//         return;
//     }

//     req.agent = {serverId};

//     next();
// }



import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    getServerIdByAgentToken
} from "../services/agent-token.service";

export interface AgentAuthenticatedRequest extends Request {
    agent?: {
        serverId: string;
    };
}

export function agentMiddleware(
    req: AgentAuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {

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

    const serverId = getServerIdByAgentToken(token);
console.log("from agenmiddleware ", serverId);
    if (!serverId) {
        res.status(401).json({
            success: false,
            message: "Invalid agent credentials"
        });
        return;
    }

    req.agent = {serverId};

    next();
}



