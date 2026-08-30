
// const agentTokens = new Map<string, string>();

// export function saveAgentToken(serverId: string, agentToken: string): void{
//     agentTokens.set(agentToken, serverId);
// }


// export function getAgentToken(serverId: string): string | undefined{
//     return agentTokens.get(serverId);
// }

// // export function getServerIdByAgentToken(
// //     agentToken: string
// // ): string | undefined {
// //     for (const [serverId, token] of agentTokens.entries()) {
// //         if (token === agentToken) {
// //             return serverId;
// //         }
// //     }

// //     return undefined;
// // }


// export function removeAgentToken(serverId: string): void{
//     agentTokens.delete(serverId);
// }




const agentTokens = new Map<string, string>();

export function saveAgentToken(serverId: string,agentToken: string): void {
            console.log("serverId: ", serverId, "agenttoken: ", agentToken);

    agentTokens.set(agentToken, serverId);
}


export function getServerIdByAgentToken( agentToken: string): string | undefined {
    return agentTokens.get(agentToken);
}


export function removeAgentToken( agentToken: string): void {
    agentTokens.delete(agentToken);
}