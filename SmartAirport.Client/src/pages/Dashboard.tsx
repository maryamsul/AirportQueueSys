import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function titleFor(service: string) {
    if (service === "boarding") return "Boarding Dashboard";
    if (service === "baggage") return "Baggage Dashboard";
    if (service === "security") return "Security Dashboard";

    return "Dashboard";
}

type Row = {
    ticketId: number;
    ticket: string;
    status: "Waiting" | "Served" | "Completed" | "Cancelled";
    issued: string;
};

type Stats = {
    waiting: number;
    served: number;
    completed: number;
    cancelled: number;
};

type QueueItem = {
    ticketId: number;
    queueNumber: string;
    status: "Waiting" | "Served" | "Completed" | "Cancelled";
    createdAt: string;
};

function Dashboard() {
    const { service = "boarding" } = useParams();

    const nav = useNavigate();

    const [rows, setRows] = useState<Row[]>([]);
    const [stats, setStats] = useState<Stats>({
        waiting: 0,
        served: 0,
        completed: 0,
        cancelled: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadQueue() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Staff/queue`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = (await response.json()) as {
                    message?: string;
                };

                throw new Error(errorData.message || "Failed to load queue");
            }

            const data: QueueItem[] = await response.json();

            setRows(
                data.map((item) => ({
                    ticketId: item.ticketId,
                    ticket: item.queueNumber,
                    status: item.status,
                    issued: new Date(item.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    ),
                }))
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to load queue");
            }
        }
    }

    async function loadStats() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Staff/stats`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = (await response.json()) as {
                    message?: string;
                };

                throw new Error(errorData.message || "Failed to load statistics");
            }

            const data: Stats = await response.json();

            setStats(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to load statistics");
            }
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            nav("/login");
            return;
        }

        async function init() {
            await loadQueue();
            await loadStats();
            setLoading(false);
        }

        init();

        const timer = setInterval(() => {
            loadQueue();
            loadStats();
        }, 5000);

        return () => clearInterval(timer);
    }, [nav]);

    async function callNext() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Staff/next`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = (await response.json()) as {
                    message?: string;
                };

                throw new Error(
                    errorData.message || "Failed to call next passenger"
                );
            }

            await loadQueue();
            await loadStats();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to call next passenger");
            }
        }
    }

    async function complete() {
        const current = rows.find((r) => r.status === "Served");

        if (!current) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Staff/complete/${current.ticketId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = (await response.json()) as {
                    message?: string;
                };

                throw new Error(
                    errorData.message || "Failed to complete ticket"
                );
            }

            await loadQueue();
            await loadStats();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to complete ticket");
            }
        }
    }

    const current =
        rows.find((r) => r.status === "Served")?.ticket ?? "-";

    if (loading) {
        return (
            <h3 className="text-center">
                Loading queue...
            </h3>
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

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="row mt-5">
                <div className="col-md-4">
                    <div className="card stat-card">
                        <h4>Waiting</h4>
                        <div className="display-6">
                            {stats.waiting}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card stat-card">
                        <h4>Serving</h4>
                        <div className="display-6">
                            {stats.served}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card stat-card">
                        <h4>Completed</h4>
                        <div className="display-6">
                            {stats.completed}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card current-card">
                <h3>Now Serving</h3>

                <p>
                    Queue Number: <b>{current}</b>
                </p>

                <p>Estimated Time: 5 mins</p>
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
                    {rows.map((row) => (
                        <tr key={row.ticketId}>
                            <td>{row.ticket}</td>
                            <td>{row.status}</td>
                            <td>{row.issued}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;