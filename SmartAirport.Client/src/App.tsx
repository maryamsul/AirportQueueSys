import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Staff from "./pages/Staff";
import Dashboard from "./pages/Dashboard";
import Display from "./pages/Display";
import Ticket from "./pages/Ticket";
import FlightCheck from "./pages/FlightCheck";
import NotFound from "./pages/NotFound";

import { Navbar } from "./components/Navbar";

function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Passenger Home */}
                <Route
                    path="/"
                    element={<Home />}
                />


                {/* Staff Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* Staff Selection */}
                <Route
                    path="/staff"
                    element={<Staff />}
                />


                {/* Service Dashboard */}
                <Route
                    path="/dashboard/:service"
                    element={<Dashboard />}
                />


                {/* Verify Flight */}
                <Route
                    path="/flight-check"
                    element={<FlightCheck />}
                />


                {/* Live Airport Screen */}
                <Route
                    path="/display"
                    element={<Display />}
                />


                {/* Passenger Ticket */}
                <Route
                    path="/ticket"
                    element={<Ticket />}
                />


                {/* 404 */}
                <Route
                    path="*"
                    element={<NotFound />}
                />


            </Routes>

        </BrowserRouter>

    );

}

export default App;