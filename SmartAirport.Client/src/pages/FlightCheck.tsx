import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";


function FlightCheck() {

    const nav = useNavigate();

    const [searchParams] = useSearchParams();


    const service =
        searchParams.get("service") ?? "checkin";


    const [flightNumber, setFlightNumber] =
        useState("");

    const [flightCode, setFlightCode] =
        useState("");

    const [step, setStep] =
        useState<1 | 2>(1);


    const [message, setMessage] =
        useState<{
            text: string;
            ok: boolean;
        } | null>(null);



    function verifyFlight() {

        if (!flightNumber.trim()) {

            setMessage({
                text: "Please enter a flight number.",
                ok: false
            });

            return;
        }


        setMessage({
            text: `Flight ${flightNumber.toUpperCase()} found. Enter your flight code to continue.`,
            ok: true
        });


        setStep(2);

    }




    function continueToTicket() {

        if (!flightCode.trim()) {

            setMessage({
                text: "Please enter your flight code.",
                ok: false
            });

            return;
        }



        nav(

 `/ticket?service=${service}&flight=${flightNumber}&code=${flightCode}`

        );

    }





    return (

        <div className="standalone-page">


            <div className="mini-navbar">


                <Link
                    to="/"
                    className="mini-logo"
                >
                    SkyQueue
                </Link>


                <div className="mini-nav-text">
                    Flight Verification
                </div>


            </div>




            <div className="mini-page">


                <div className="mini-dashboard">


                    <div className="mini-header">

                        <h2>
                            Verify Flight
                        </h2>


                        <p className="mini-subtitle">
                            Please enter your details to verify your booking status
                        </p>


                    </div>




                    <div className="mini-form-group">

                        <label className="mini-input-label">
                            Enter Flight Number
                        </label>


                        <input

                            className="mini-form-control"

                            placeholder="ex., QR301"

                            value={flightNumber}

                            onChange={(e) =>
                                setFlightNumber(e.target.value)
                            }

                            disabled={step === 2}

                        />


                    </div>





                    {step === 1 && (

                        <div className="mini-actions">

                            <button
                                className="mini-btn"
                                onClick={verifyFlight}
                            >
                                Verify Flight
                            </button>

                        </div>

                    )}






                    {message && (

                        <div

                            className="mini-message"

                            style={{
                                background:
                                    message.ok
                                        ? "#ecfdf5"
                                        : "#fef2f2",

                                color:
                                    message.ok
                                        ? "#065f46"
                                        : "#991b1b"
                            }}

                        >

                            {message.text}

                        </div>

                    )}






                    {step === 2 && (

                        <>


                            <hr
                                style={{
                                    margin: "20px 0",
                                    border: "1px solid #e5edf5"
                                }}
                            />




                            <div className="mini-form-group">


                                <label className="mini-input-label">
                                    Enter Flight Code
                                </label>



                                <input

                                    className="mini-form-control"

                                    placeholder="e.g., FLIGHT-AX91"

                                    value={flightCode}

                                    onChange={(e) =>
                                        setFlightCode(e.target.value)
                                    }

                                />


                            </div>




                            <div className="mini-actions">

                                <button

                                    className="mini-btn"

                                    onClick={continueToTicket}

                                >

                                    Continue

                                </button>


                            </div>


                        </>

                    )}





                </div>


            </div>


        </div>

    );

}


export default FlightCheck;