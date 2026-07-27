import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../lib/auth";


function Login() {

    const { login } = useAuth();

    const nav = useNavigate();


    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");



    function submit(e: React.FormEvent) {

        e.preventDefault();


        if (!email || !password) {

            setError(
                "Please enter both email and password."
            );

            return;
        }


        login();


        nav("/staff");

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

                        onChange={(e) =>
                            setEmail(e.target.value)
                        }

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

                        onChange={(e) =>
                            setPassword(e.target.value)
                        }

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



                    {
                        error &&
                        <div className="text-danger">
                            {error}
                        </div>
                    }



                </form>



            </div>


        </div>

    );


}


export default Login;