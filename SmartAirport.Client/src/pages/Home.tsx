import { useNavigate } from "react-router-dom";


function Home() {

    const nav = useNavigate();


    const services = [
        {
            key: "checkin",
            title: "Baggage Drop",
            desc: "Bag Drop & Check-in",
            icon: "fa-luggage-cart"
        },

        {
            key: "security",
            title: "Security",
            desc: "Carry-on & Passenger Screening",
            icon: "fa-user-shield"
        },

        {
            key: "boarding",
            title: "Boarding",
            desc: "Gate Boarding & Departure",
            icon: "fa-plane-departure"
        },
    ];



    return (

        <div className="home-page">


            <section className="hero">

                <div className="container hero-content">


                    <h1 className="display-4 fw-bold">

                        Seamless
                        <span style={{ color: "#ffca28" }}>
                            Journeys
                        </span>

                        <br />

                        Start Here

                    </h1>



                    <p className="lead opacity-75">

                        Don't stand in line. Secure your digital spot and enjoy the airport lounges while we hold your place.

                    </p>


                </div>

            </section>




            <section
                className="container"
                style={{
                    marginTop: "-80px",
                    position: "relative",
                    zIndex: 5
                }}
            >


                <div className="row g-4">


                    {
                        services.map((s) => (

                            <div
                                className="col-md-4"
                                key={s.key}
                            >


                                <div className="service-card">


                                    <div>


                                        <div className="icon-circle checkin-icon">

                                            <i
                                                className={`fa-solid ${s.icon}`}
                                            />


                                        </div>



                                        <h4>
                                            {s.title}
                                        </h4>



                                        <p className="text-muted small">

                                            {s.desc}

                                        </p>


                                    </div>




                                    <button

                                        className="btn btn-primary btn-action mt-3"

                                        onClick={() =>
                                            nav(
                                                `/flight-check?service=${s.key}`
                                            )
                                        }

                                    >

                                        Get Ticket

                                    </button>



                                </div>


                            </div>


                        ))

                    }


                </div>


            </section>



        </div>

    );


}


export default Home;