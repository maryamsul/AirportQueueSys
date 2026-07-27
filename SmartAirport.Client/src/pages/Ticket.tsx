import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const serviceMap: Record<string, string> = {
    checkin: "Check-in",
    security: "Security",
    boarding: "Boarding",
};

type TicketResponse = {
    ticketNumber: string;
    serviceType: string;
    status: string;
    estimatedTime: number;
};

function Ticket() {
    const [searchParams] = useSearchParams();
    const nav = useNavigate();

    const service = searchParams.get("service") ?? "checkin";
    const flightNumber = searchParams.get("flight") ?? "";
    const flightCode = searchParams.get("code") ?? "";

    const [ticket, setTicket] = useState<TicketResponse | null>(null);
    const [cancelled, setCancelled] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function createTicket() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Ticket`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        flightNumber,
                        flightCode,
                        serviceType: serviceMap[service],
                    }),
                }
            );

            const data: TicketResponse & { message?: string } =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create ticket"
                );
            }

            setTicket(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to create ticket");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        createTicket();
    }, []);

    async function cancelTicket() {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/Ticket/cancel`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flightCode,
                }),
            }
        );

        const data: { message?: string } =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Cancel failed"
            );
        }

        setCancelled(true);
    } catch (error: unknown) {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError("Cancel failed");
        }
    }
}
    if (loading) {
        return (
            <h3 className="text-center mt-5">
                Creating ticket...
            </h3>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-5">
                <h3>Error</h3>

                <p className="text-danger">
                    {error}
                </p>

                <button
                    className="mini-btn"
                    onClick={() => nav("/")}
                >
                    Back
                </button>
            </div>
        );
    }

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
                        <h2>Ticket Cancelled</h2>

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
                        <h2>SkyQueue Ticket</h2>

                        <p className="mini-subtitle">
                            Smart Airport Queue System
                        </p>
                    </div>

                    <div className="ticket-wrapper">
                        <div className="now-label">
                            Your Queue Number
                        </div>

                        <div className="now">
                            {ticket?.ticketNumber}
                        </div>
                    </div>

                    <div className="ticket-panel">
                        <div className="ticket-row">
                            <span className="ticket-label-inline">
                                Service Type
                            </span>

                            <span className="ticket-value">
                                {ticket?.serviceType}
                            </span>
                        </div>

                        <div className="ticket-row">
                            <span className="ticket-label-inline">
                                Estimated Wait
                            </span>

                            <span className="ticket-value">
                                {ticket?.estimatedTime} mins
                            </span>
                        </div>

                        <div className="ticket-row">
                            <span className="ticket-label-inline">
                                Status
                            </span>

                            <span className="ticket-value">
                                {ticket?.status}
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
                            onClick={cancelTicket}
                        >
                            Cancel Ticket
                        </button>

                        <p
                            style={{
                                fontSize: 13,
                                color: "#64748b",
                                marginTop: 8,
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