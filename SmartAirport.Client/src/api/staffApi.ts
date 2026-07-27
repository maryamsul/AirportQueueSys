import { apiRequest } from "./client";


export function login(data:{
    email:string;
    password:string;
})
{
    return apiRequest(
        "/api/Auth/login",
        {
            method:"POST",
            body:JSON.stringify(data)
        }
    );
}



export function selectService(data:{
    serviceType:string;
    counterId:number;
})
{
    return apiRequest(
        "/api/Staff/select-service",
        {
            method:"POST",
            body:JSON.stringify(data)
        }
    );
}



export function getQueue()
{
    return apiRequest(
        "/api/Staff/queue"
    );
}



export function nextPassenger()
{
    return apiRequest(
        "/api/Staff/next",
        {
            method:"PUT"
        }
    );
}



export function completeTicket(ticketId:number)
{
    return apiRequest(
        `/api/Staff/complete/${ticketId}`,
        {
            method:"PUT"
        }
    );
}



export function getStats()
{
    return apiRequest(
        "/api/Staff/stats"
    );
}