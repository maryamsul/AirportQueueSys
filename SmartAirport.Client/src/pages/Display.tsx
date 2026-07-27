import { useEffect, useState } from "react";


type Card = {
    title: string;
    icon: string;
    image: string;
    current: string;
    next: string;
    wait: string;
    waitClass: "wait-high" | "wait-medium" | "wait-low";
};


const initial: Card[] = [
    {
        title: "Baggage Drop",
        icon: "fa-luggage-cart",
        image:
            "https://www.etihad.com/content/dam/eag/etihadairways/etihadcom/2025/global/products/manage/manage-check-in-airport-self-service-kiosks.jpg",
        current: "B102",
        next: "B103",
        wait: "18 Mins",
        waitClass: "wait-high",
    },

    {
        title: "Security",
        icon: "fa-user-shield",
        image:
            "https://tse1.mm.bing.net/th/id/OIP.duvy-HPyawDsnEnHrCD3awHaHa",
        current: "S205",
        next: "S206",
        wait: "9 Mins",
        waitClass: "wait-medium",
    },

    {
        title: "Boarding",
        icon: "fa-plane-departure",
        image:
            "https://tse4.mm.bing.net/th/id/OIP.KTKc2_lYWY0sfnEwy4YILAHaEK",
        current: "P320",
        next: "P321",
        wait: "3 Mins",
        waitClass: "wait-low",
    },
];


function Display() {

    const [now, setNow] = useState("");

    const [cards, setCards] = useState<Card[]>(initial);



    useEffect(() => {

        const tick = () => {

            setNow(
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }
                )
            );

        };


        tick();

        const timer = setInterval(tick, 1000);


        return () => clearInterval(timer);


    }, []);



    useEffect(() => {

        const timer = setInterval(() => {


            setCards(prev =>
                prev.map(card => {

                    const prefix = card.current[0];

                    const number =
                        parseInt(card.current.slice(1), 10) + 1;


                    return {
                        ...card,
                        current: `${prefix}${number}`,
                        next: `${prefix}${number + 1}`
                    };

                })
            );


        }, 30000);


        return () => clearInterval(timer);


    }, []);



    return (

        <div className="display-page">


            <div className="display-header">

                <h1>
                    ✈ SkyQueue Live Monitor
                </h1>


                <p>
                    Please proceed to your assigned station when your ticket number is called
                </p>


                <div className="live-clock">
                    {now || "Loading live updates..."}
                </div>


            </div>



            <div className="container">

                <div className="row g-4">


                    {
                        cards.map(card => (

                            <div className="col-md-4" key={card.title}>


                                <div className="status-card">


                                    <div className="category-title">

                                        <i className={`fa-solid ${card.icon} text-primary`} />

                                        {" "}{card.title}

                                    </div>



                                    <div className="now-serving-box">


                                        <div className="image-box">

                                            <img
                                                src={card.image}
                                                alt={card.title}
                                            />

                                        </div>



                                        <span className="ticket-label">
                                            Now Serving
                                        </span>


                                        <span className="ticket-number">
                                            {card.current}
                                        </span>


                                    </div>




                                    <div className="queue-details">


                                        <div className="detail-item">

                                            <span className="detail-label">
                                                Next Ticket
                                            </span>


                                            <span className="detail-value">
                                                {card.next}
                                            </span>


                                        </div>



                                        <div className="detail-item">

                                            <span className="detail-label">
                                                Next in Queue
                                            </span>


                                            <span className={`detail-value ${card.waitClass}`}>
                                                {card.wait}
                                            </span>


                                        </div>


                                    </div>



                                </div>


                            </div>


                        ))
                    }


                </div>



                <div className="footer-note">

                    SkyQueue Airport Management System © 2026

                </div>


            </div>


        </div>

    );

}


export default Display;