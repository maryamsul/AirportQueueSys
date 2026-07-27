import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";


export function Navbar() {

    const { isAuthed, logout } = useAuth();

    const location = useLocation();


    const path = location.pathname;


    // Hide navbar on standalone pages
    const hide =
        path === "/flight-check" ||
        path === "/ticket";


    if (hide)
        return null;



    return (

        <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">

            <div className="container">


                <Link
                    to="/"
                    className="navbar-brand fw-bold skyqueue-logo"
                >

                    <i className="fa-solid fa-plane" />

                    {" "}SkyQueue

                </Link>



                <div className="ms-auto d-flex gap-2 align-items-center">


                    <Link
                        to="/display"
                        className="btn btn-outline-dark btn-sm"
                    >
                        Live Display
                    </Link>



                    {
                        isAuthed ? (

                            <>

                                <Link
                                    to="/staff"
                                    className="btn btn-outline-primary btn-sm"
                                >
                                    Dashboard
                                </Link>



                                <button
                                    onClick={logout}
                                    className="btn btn-danger btn-sm"
                                >
                                    Logout
                                </button>

                            </>

                        ) : (

                            <Link
                                to="/login"
                                className="btn btn-primary btn-sm"
                            >
                                Staff Login
                            </Link>

                        )

                    }


                </div>


            </div>


        </nav>

    );

}