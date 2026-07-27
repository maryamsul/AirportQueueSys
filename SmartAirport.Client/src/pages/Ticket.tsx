import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";


const serviceMap: Record<
    string,
    { label: string; prefix: string; wait: string }
> = {

    checkin: {
        label: "Baggage Drop",
        prefix: "B",
        wait: "18 mins"
    },

    security: {
        label: "Security",
        prefix: "S",
        wait: "9 mins"
    },

    boarding: {
        label: "Boarding",
        prefix: "P",
        wait: "3 mins"
    }

};



function Ticket() {


    const [searchParams] = useSearchParams();

    const nav = useNavigate();


    const service =
        searchParams.get("service") ?? "checkin";


    const [cancelled, setCancelled] =
        useState(false);



    const info =
        serviceMap[service] ??
        serviceMap.checkin;



    const ticket =
        useMemo(
            () =>
                `${info.prefix}${Math.floor(100 + Math.random() * 900)}`,
            [info.prefix]
        );


    const issued =
        useMemo(
            () =>
                new Date()
                    .toLocaleTimeString(
                        "en-US",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),
            []
        );



    if (cancelled) {

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
                        Passenger Ticket Portal
                    </div>

                </div>



                <div className="mini-page">

                    <div className="mini-dashboard text-center">

                        <h2>
                            Ticket Cancelled
                        </h2>


                        <p className="mini-subtitle">
                            Your queue ticket has been cancelled.
                        </p>



                        <button
                            className="mini-btn"
                            onClick={() => nav("/")}
                        >
                            Back to Home
                        </button>


                    </div>


                </div>


            </div>

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
                    Passenger Ticket Portal
                </div>


            </div>



            <div className="mini-page">


                <div className="mini-dashboard">


                    <div className="mini-header">

                        <h2>
                            SkyQueue Ticket
                        </h2>


                        <p className="mini-subtitle">
                            Smart Airport Queue System
                        </p>


                    </div>



                    <div className="ticket-wrapper">


                        <div className="now-label">
                            Your Queue Number
                        </div>


                        <div className="now">
                            {ticket}
                        </div>


                    </div>




                    <div className="ticket-panel">


                        <div className="ticket-row">

                            <span className="ticket-label-inline">
                                Service Type
                            </span>


                            <span className="ticket-value">
                                {info.label}
                            </span>


                        </div>



                        <div className="ticket-row">

                            <span className="ticket-label-inline">
                                Estimated Wait
                            </span>


                            <span className="ticket-value">
                                {info.wait}
                            </span>


                        </div>



                        <div className="ticket-row">

                            <span className="ticket-label-inline">
                                Issued
                            </span>


                            <span className="ticket-value">
                                {issued}
                            </span>


                        </div>


                    </div>




                    <div className="mini-actions">


                        <button
                            className="mini-btn"
                            onClick={() => window.print()}
                        >
                            Print Ticket
                        </button>



                        <button
                            className="mini-btn ticket-cancel"
                            onClick={() => setCancelled(true)}
                        >
                            Cancel Ticket
                        </button>



                        <p
                            style={{
                                fontSize: 13,
                                color: "#64748b",
                                marginTop: 8
                            }}
                        >
                            Thank you for using SkyQueue
                        </p>


                    </div>



                </div>


            </div>


        </div>

    );


}


export default Ticket;