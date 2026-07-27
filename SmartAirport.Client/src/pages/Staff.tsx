import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";


const counters: Record<string, string[]> = {

    Security: [
        "Lane 1",
        "Lane 2",
        "Lane 3"
    ],

    Boarding: [
        "Gate A1",
        "Gate A2",
        "Gate B1"
    ],

    "Check-in": [
        "Counter 1",
        "Counter 2",
        "Counter 3",
        "Counter 4"
    ],

};



const serviceRouteKey: Record<string, string> = {

    Security: "security",

    Boarding: "boarding",

    "Check-in": "baggage",

};



function Staff() {

    const nav = useNavigate();


    const [service, setService] = useState("");

    const [counter, setCounter] = useState("");

    const [error, setError] = useState("");



    useEffect(() => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            nav("/login");

        }


    }, [nav]);





    const availableCounters = useMemo(
        () => counters[service] ?? [],
        [service]
    );



    async function openDashboard() {
    if (!service || !counter) return;

    try {
        setError("");

        const counterId =
            availableCounters.indexOf(counter) + 1;

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/Staff/select-service`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    serviceType: service,
                    counterId,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to select service"
            );
        }

        // Replace normal JWT with Staff Context JWT
        localStorage.setItem("token", data.token);

        localStorage.setItem(
            "staffContext",
            JSON.stringify(data)
        );

        nav(`/dashboard/${serviceRouteKey[service]}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError("Failed to select service");
        }
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("staffContext");

    nav("/");
}



    return (


        <div className="container">



            <h1 className="dashboard-title">

                Staff Dashboard

            </h1>




            <p className="text-center text-muted">

                Choose service area and counter

            </p>






            <div className="card dashboard-card">






                <label className="form-label">

                    Service

                </label>




                <select

                    className="form-select"

                    value={service}

                    onChange={(e)=>{

                        setService(
                            e.target.value
                        );

                        setCounter("");

                    }}

                >


                    <option value="">

                        Select Service

                    </option>



                    <option value="Security">

                        Security

                    </option>



                    <option value="Boarding">

                        Boarding

                    </option>



                    <option value="Check-in">

                        Baggage Drop

                    </option>



                </select>







                <br />







                <label className="form-label">

                    Counter

                </label>






                <select


                    className="form-select"


                    value={counter}


                    onChange={(e)=>

                        setCounter(
                            e.target.value
                        )

                    }


                    disabled={!service}


                >



                    <option value="">


                        {

                            service

                            ?

                            "Select Counter"

                            :

                            "Select service first"

                        }


                    </option>




                    {

                        availableCounters.map(c => (


                            <option

                                key={c}

                                value={c}

                            >

                                {c}

                            </option>


                        ))

                    }



                </select>








                <br />







                {

                    error &&


                    <div className="text-danger mb-3">

                        {error}

                    </div>

                }









                <button


                    className="btn btn-primary w-100"


                    onClick={openDashboard}


                    disabled={!service || !counter}


                >

                    Open Dashboard


                </button>








                <button


                    className="btn btn-danger logout-btn"


                    onClick={logout}


                >

                    Logout


                </button>






            </div>





        </div>


    );

}


export default Staff;