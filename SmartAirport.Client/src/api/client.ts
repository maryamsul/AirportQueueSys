const API_URL = 'https://smartairport-api-f2bnc3e6drhdg6gr.koreacentral-01.azurewebsites.net';

export async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
) {

    const token =
        localStorage.getItem("token");


    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                ...(token
                    ? {
                        Authorization:
                            `Bearer ${token}`
                    }
                    : {}),

                ...options.headers
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {
        throw new Error(
            data.message || "API Error"
        );
    }


    return data;
}
