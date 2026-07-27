import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";


function titleFor(service: string) {
    if (service === "boarding") return "Boarding Dashboard";
    if (service === "baggage") return "Baggage Dashboard";
    if (service === "security") return "Security Dashboard";

    return "Dashboard";
}


const prefixFor: Record<string, string> = {
    boarding: "P",
    baggage: "B",
    security: "S"
};


type Row = {
    ticket: string;
    status: "Waiting" | "Serving" | "Completed";
    issued: string;
};


function Dashboard() {

    const { service = "boarding" } = useParams();

    const nav = useNavigate();


    const [rows, setRows] = useState<Row[]>(() =>
        Array.from({ length: 6 }, (_, i) => ({
            ticket: `${prefixFor[service]}${100 + i}`,
            status: i === 0 ? "Serving" : "Waiting",
            issued: new Date(
                Date.now() - (6 - i) * 60000
            ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
            }),
        }))
    );


    useEffect(() => {

        const auth =
            localStorage.getItem("skyqueue_auth");

        if (auth !== "1") {
            nav("/login");
        }

    }, [nav]);


    const waiting =
        rows.filter(r => r.status === "Waiting").length;

    const serving =
        rows.filter(r => r.status === "Serving").length;

    const completed =
        rows.filter(r => r.status === "Completed").length;


    const current =
        rows.find(r => r.status === "Serving")
            ?.ticket ?? "-";



    function callNext() {

        setRows(prev => {

            const next = [...prev];

            const servingIndex =
                next.findIndex(
                    r => r.status === "Serving"
                );


            if (servingIndex >= 0) {
                next[servingIndex].status = "Completed";
            }


            const waitingIndex =
                next.findIndex(
                    r => r.status === "Waiting"
                );


            if (waitingIndex >= 0) {
                next[waitingIndex].status = "Serving";
            }


            return next;

        });

    }



    function complete() {

        setRows(prev =>
            prev.map(r =>
                r.status === "Serving"
                    ? { ...r, status: "Completed" }
                    : r
            )
        );

    }



    return (

        <div className="container">


            <button
                className="btn btn-outline-secondary"
                onClick={() => nav("/staff")}
            >
                ← Back
            </button>


            <h1 className="dashboard-title">
                {titleFor(service)}
            </h1>



            <div className="row mt-5">


                <div className="col-md-4">
                    <div className="card stat-card">
                        <h4>Waiting</h4>
                        <div className="display-6">
                            {waiting}
                        </div>
                    </div>
                </div>



                <div className="col-md-4">
                    <div className="card stat-card">
                        <h4>Serving</h4>
                        <div className="display-6">
                            {serving}
                        </div>
                    </div>
                </div>



                <div className="col-md-4">
                    <div className="card stat-card">
                        <h4>Completed</h4>
                        <div className="display-6">
                            {completed}
                        </div>
                    </div>
                </div>


            </div>



            <div className="card current-card">

                <h3>
                    Now Serving
                </h3>


                <p>
                    Queue Number:
                    <b>{current}</b>
                </p>


                <p>
                    Estimated Time: 5 mins
                </p>


            </div>



            <div className="row mb-4">


                <div className="col-6">

                    <button
                        className="btn btn-primary action-btn"
                        onClick={callNext}
                    >
                        Call Next Passenger
                    </button>

                </div>



                <div className="col-6">

                    <button
                        className="btn btn-success action-btn"
                        onClick={complete}
                    >
                        Complete Current
                    </button>

                </div>


            </div>



            <table className="table table-striped">

                <thead>

                    <tr>
                        <th>Ticket</th>
                        <th>Status</th>
                        <th>Issued</th>
                    </tr>

                </thead>


                <tbody>

                    {
                        rows.map(r => (

                            <tr key={r.ticket}>

                                <td>{r.ticket}</td>
                                <td>{r.status}</td>
                                <td>{r.issued}</td>

                            </tr>

                        ))
                    }

                </tbody>


            </table>



        </div>

    );

}


export default Dashboard;