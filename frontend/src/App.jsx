import React, {
    useEffect,
    useState
} from "react";

import {
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom";

import api from "./api";

import ReminderForm
    from "./components/ReminderForm";

import MapView
    from "./components/MapView";


function sendNotification(
    title,
    message
) {

    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            title,
            {
                body: message
            }
        );

    }

}


function Login({
    onLogin
}) {

    const navigate =
        useNavigate();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");


    async function login(e) {

        e.preventDefault();

        setError("");

        try {

            const response =
                await api.post(
                    "/token/",
                    {
                        username,
                        password
                    }
                );

            localStorage.setItem(
                "access",
                response.data.access
            );

            localStorage.setItem(
                "refresh",
                response.data.refresh
            );

            onLogin();

            navigate("/");

        }

        catch {

            setError(
                "Invalid username or password."
            );

        }

    }


    return (

        <div className="auth-page">

            <form
                className="auth-card"
                onSubmit={login}
            >

                <h1>
                    📍 ReachMe
                </h1>

                <p>
                    Smart Location Reminder
                </p>

                {error && (

                    <div className="error">
                        {error}
                    </div>

                )}

                <input
                    placeholder="Username"
                    value={username}
                    onChange={
                        e =>
                            setUsername(
                                e.target.value
                            )
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={
                        e =>
                            setPassword(
                                e.target.value
                            )
                    }
                    required
                />

                <button>
                    Login
                </button>

                <p>

                    Don't have an account?

                    {" "}

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </form>

        </div>

    );

}


function Register() {

    const navigate =
        useNavigate();

    const [form, setForm] =
        useState({
            username: "",
            email: "",
            password: ""
        });

    const [error, setError] =
        useState("");


    async function register(e) {

        e.preventDefault();

        setError("");

        try {

            const response =
                await api.post(
                    "/register/",
                    form
                );

            localStorage.setItem(
                "access",
                response.data.access
            );

            localStorage.setItem(
                "refresh",
                response.data.refresh
            );

            navigate("/");

        }

        catch (error) {

            setError(
                error.response?.data?.detail ||
                "Registration failed."
            );

        }

    }


    return (

        <div className="auth-page">

            <form
                className="auth-card"
                onSubmit={register}
            >

                <h1>
                    Create Account
                </h1>

                {error && (

                    <div className="error">
                        {error}
                    </div>

                )}

                <input
                    placeholder="Username"
                    value={form.username}
                    onChange={
                        e =>
                            setForm({
                                ...form,
                                username:
                                    e.target.value
                            })
                    }
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={
                        e =>
                            setForm({
                                ...form,
                                email:
                                    e.target.value
                            })
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={
                        e =>
                            setForm({
                                ...form,
                                password:
                                    e.target.value
                            })
                    }
                    required
                />

                <button>
                    Create Account
                </button>

                <p>

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </form>

        </div>

    );

}


function Dashboard() {

    const navigate =
        useNavigate();


    const [reminders, setReminders] =
        useState([]);

    const [position, setPosition] =
        useState(null);

    const [editing, setEditing] =
        useState(null);

    const [message, setMessage] =
        useState("");


    async function loadReminders() {

        try {

            const response =
                await api.get(
                    "/reminders/"
                );

            setReminders(
                response.data
            );

        }

        catch {

            localStorage.clear();

            navigate("/login");

        }

    }


    useEffect(() => {

        loadReminders();


        if (
            "Notification" in window &&
            Notification.permission === "default"
        ) {

            Notification.requestPermission();

        }


        if (
            !navigator.geolocation
        ) {

            setMessage(
                "GPS is not supported."
            );

            return;

        }


        const watch =
            navigator.geolocation.watchPosition(

                location => {

                    setPosition({

                        latitude:
                            location.coords.latitude,

                        longitude:
                            location.coords.longitude

                    });

                },

                () => {

                    setMessage(
                        "Please allow location permission."
                    );

                },

                {

                    enableHighAccuracy: true,

                    maximumAge: 10000,

                    timeout: 15000

                }

            );


        return () => {

            navigator.geolocation.clearWatch(
                watch
            );

        };

    }, []);


    function calculateDistance(
        lat1,
        lon1,
        lat2,
        lon2
    ) {

        const R = 6371000;


        const radians =
            degrees =>
                degrees *
                Math.PI /
                180;


        const dLat =
            radians(
                lat2 - lat1
            );


        const dLon =
            radians(
                lon2 - lon1
            );


        const a =
            Math.sin(
                dLat / 2
            ) ** 2 +

            Math.cos(
                radians(lat1)
            ) *

            Math.cos(
                radians(lat2)
            ) *

            Math.sin(
                dLon / 2
            ) ** 2;


        return (

            R *

            2 *

            Math.atan2(

                Math.sqrt(a),

                Math.sqrt(
                    1 - a
                )

            )

        );

    }


    useEffect(() => {

        if (!position) return;


        reminders
            .filter(
                reminder =>
                    reminder.is_active &&
                    !reminder.is_triggered
            )
            .forEach(
                async reminder => {

                    const distance =
                        calculateDistance(

                            position.latitude,

                            position.longitude,

                            Number(
                                reminder.latitude
                            ),

                            Number(
                                reminder.longitude
                            )

                        );


                    if (
                        distance <=
                        reminder.radius
                    ) {

                        sendNotification(

                            "📍 You've reached your location!",

                            `${reminder.title} — ${reminder.location_name}`

                        );


                        try {

                            await api.post(

                                `/reminders/${reminder.id}/trigger/`

                            );

                            setReminders(
                                previous =>

                                    previous.map(
                                        item =>

                                            item.id ===
                                            reminder.id

                                                ? {
                                                    ...item,

                                                    is_active:
                                                        false,

                                                    is_triggered:
                                                        true
                                                }

                                                : item

                                    )
                            );

                        }

                        catch {

                            console.log(
                                "Trigger failed"
                            );

                        }

                    }

                }
            );

    }, [
        position,
        reminders
    ]);


    async function saveReminder(
        data
    ) {

        try {

            if (editing) {

                await api.put(

                    `/reminders/${editing.id}/`,

                    data

                );

            }

            else {

                await api.post(

                    "/reminders/",

                    data

                );

            }


            setEditing(null);

            loadReminders();

        }

        catch (error) {

            alert(
                JSON.stringify(
                    error.response?.data ||
                    "Something went wrong"
                )
            );

        }

    }


    async function deleteReminder(
        id
    ) {

        if (
            !window.confirm(
                "Delete this reminder?"
            )
        ) return;


        await api.delete(
            `/reminders/${id}/`
        );


        loadReminders();

    }


    function logout() {

        localStorage.clear();

        navigate("/login");

    }


    const active =
        reminders.filter(
            r =>
                r.is_active &&
                !r.is_triggered
        );


    const completed =
        reminders.filter(
            r =>
                r.is_triggered
        );


    return (

        <div className="app">

            <header>

                <div>

                    <strong>
                        📍 ReachMe
                    </strong>

                    <span>
                        Smart Location Reminder
                    </span>

                </div>

                <button
                    className="secondary"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>


            <main>

                <section className="hero">

    <div>

        <h1>
            Never forget when you arrive.
        </h1>

        <p>
            Set a location and ReachMe will
            automatically notify you when you
            enter the selected area.
        </p>

    </div>

    <div className="gps">

        {position ? (
            <>
                🟢 GPS Active

                <br />

                <small>
                    {position.latitude.toFixed(5)}
                    {" , "}
                    {position.longitude.toFixed(5)}
                </small>
            </>
        ) : (
            "🟡 Waiting for GPS..."
        )}

    </div>

</section>


                {message && (

                    <div className="notice">
                        {message}
                    </div>

                )}


                <section className="grid">

                    <div>

                        <ReminderForm

                            onSave={
                                saveReminder
                            }

                            editing={
                                editing
                            }

                            onCancel={
                                () =>
                                    setEditing(null)
                            }

                        />


                        <div className="card">

                            <h2>
                                Active Reminders
                                {" "}
                                ({active.length})
                            </h2>


                            {active.length === 0

                                ?

                                <p className="muted">
                                    No active reminders.
                                </p>

                                :

                                active.map(
                                    reminder => (

                                        <ReminderCard

                                            key={
                                                reminder.id
                                            }

                                            reminder={
                                                reminder
                                            }

                                            onEdit={
                                                setEditing
                                            }

                                            onDelete={
                                                deleteReminder
                                            }

                                        />

                                    )
                                )

                            }

                        </div>


                        <div className="card">

                            <h2>
                                Completed
                                {" "}
                                ({completed.length})
                            </h2>


                            {completed.map(
                                reminder => (

                                    <ReminderCard

                                        key={
                                            reminder.id
                                        }

                                        reminder={
                                            reminder
                                        }

                                        completed

                                        onDelete={
                                            deleteReminder
                                        }

                                    />

                                )
                            )}

                        </div>

                    </div>


                    <MapView

                        reminders={
                            reminders
                        }

                        position={
                            position
                        }

                    />

                </section>

            </main>

        </div>

    );

}


function ReminderCard({
    reminder,
    completed,
    onEdit,
    onDelete
}) {

    return (

        <article
            className={
                `reminder ${
                    completed
                        ? "done"
                        : ""
                }`
            }
        >

            <div>

                <h3>
                    {reminder.title}
                </h3>

                <p>
                    {
                        reminder.description ||
                        "No description"
                    }
                </p>

                <b>
                    📍 {reminder.location_name}
                </b>

                <small>
                    Alert radius:
                    {" "}
                    {reminder.radius}
                    {" "}
                    meters
                </small>

            </div>


            <div className="actions">

                {completed

                    ?

                    <span className="badge">
                        ✓ Reached
                    </span>

                    :

                    <button
                        className="secondary"
                        onClick={() =>
                            onEdit(reminder)
                        }
                    >
                        Edit
                    </button>

                }


                <button
                    className="danger"
                    onClick={() =>
                        onDelete(reminder.id)
                    }
                >
                    Delete
                </button>

            </div>

        </article>

    );

}


export default function App() {

    const [loggedIn, setLoggedIn] =
        useState(
            Boolean(
                localStorage.getItem(
                    "access"
                )
            )
        );


    return (

        <Routes>

            <Route
                path="/login"
                element={
                    <Login
                        onLogin={() =>
                            setLoggedIn(true)
                        }
                    />
                }
            />


            <Route
                path="/register"
                element={
                    <Register />
                }
            />


            <Route
                path="*"
                element={
                    loggedIn

                        ?

                        <Dashboard />

                        :

                        <Login
                            onLogin={() =>
                                setLoggedIn(true)
                            }
                        />
                }
            />

        </Routes>

    );

}