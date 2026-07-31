import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../lib/auth";

function Login() {
    const { login } = useAuth();
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function submit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
console.log("API URL:", import.meta.env.VITE_API_URL);
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/Auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // Save JWT using AuthContext
        login(data.token);

        // Optional: store user details
        localStorage.setItem("user", JSON.stringify(data));

        nav("/staff");
    } catch (error: unknown) {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError("Login failed");
        }
    }
}

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="text-center mb-4">
                    Staff Login
                </h2>

                <form onSubmit={submit}>
                    <label className="form-label">
                        Email
                    </label>

                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <br />

                    <label className="form-label">
                        Password
                    </label>

                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <br />

                    <button
                        type="submit"
                        className="btn btn-primary btn-login"
                    >
                        Login
                    </button>

                    <br />
                    <br />

                    {error && (
                        <div className="text-danger">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Login;
