import { apiRequest } from "./client";


export function createTicket(data:{
    flightNumber:string;
    flightCode:string;
    serviceType:string;
})
{
    return apiRequest(
        "/api/Ticket",
        {
            method:"POST",
            body:JSON.stringify(data)
        }
    );
}



export function cancelTicket(
    flightCode:string
)
{
    return apiRequest(
        "/api/Ticket/cancel",
        {
            method:"PUT",

            body:JSON.stringify({
                flightCode
            })
        }
    );
}