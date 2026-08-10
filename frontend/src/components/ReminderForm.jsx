import React, {
    useEffect,
    useState
} from "react";


const emptyForm = {

    title: "",

    description: "",

    location_name: "",

    latitude: "",

    longitude: "",

    radius: 100,

    remind_at: ""

};


export default function ReminderForm({
    onSave,
    editing,
    onCancel
}) {

    const [form, setForm] =
        useState(emptyForm);

    const [error, setError] =
        useState("");


    useEffect(() => {

        if (editing) {

            setForm({

                title:
                    editing.title,

                description:
                    editing.description || "",

                location_name:
                    editing.location_name,

                latitude:
                    editing.latitude,

                longitude:
                    editing.longitude,

                radius:
                    editing.radius,

                remind_at:
                    editing.remind_at
                        ? editing.remind_at
                            .slice(0, 16)
                        : ""

            });

        }

        else {

            setForm(
                emptyForm
            );

        }

    }, [editing]);


    function useCurrentLocation() {

        setError("");


        if (
            !navigator.geolocation
        ) {

            setError(
                "GPS is not supported."
            );

            return;

        }


        navigator.geolocation.getCurrentPosition(

            location => {

                setForm(
                    previous => ({

                        ...previous,

                        latitude:
                            location.coords.latitude
                                .toFixed(7),

                        longitude:
                            location.coords.longitude
                                .toFixed(7)

                    })
                );

            },

            () => {

                setError(
                    "Location permission denied."
                );

            },

            {
                enableHighAccuracy: true
            }

        );

    }


    function submit(e) {

        e.preventDefault();

        setError("");


        if (
            !form.latitude ||
            !form.longitude
        ) {

            setError(
                "Please select a location."
            );

            return;

        }


        if (
            !form.location_name
        ) {

            setError(
                "Enter the location name."
            );

            return;

        }


        onSave({

            title:
                form.title,

            description:
                form.description,

            location_name:
                form.location_name,

            latitude:
                Number(
                    form.latitude
                ),

            longitude:
                Number(
                    form.longitude
                ),

            radius:
                Number(
                    form.radius
                ),

            remind_at:
                form.remind_at
                    ? new Date(
                        form.remind_at
                    ).toISOString()

                    : null

        });


        if (!editing) {

            setForm(
                emptyForm
            );

        }

    }


    return (

        <form
            className="card form"
            onSubmit={submit}
        >

            <h2>
                {editing
                    ? "Edit Reminder"
                    : "Create Reminder"
                }
            </h2>


            {error && (

                <div className="error">
                    {error}
                </div>

            )}


            <label>

                Reminder Title

                <input

                    placeholder="Buy groceries"

                    value={
                        form.title
                    }

                    onChange={
                        e =>
                            setForm({

                                ...form,

                                title:
                                    e.target.value

                            })
                    }

                    required

                />

            </label>


            <label>

                Description

                <textarea

                    placeholder="Don't forget milk"

                    value={
                        form.description
                    }

                    onChange={
                        e =>
                            setForm({

                                ...form,

                                description:
                                    e.target.value

                            })
                    }

                />

            </label>


            <label>

                Location Name

                <input

                    placeholder="KPHB Supermarket"

                    value={
                        form.location_name
                    }

                    onChange={
                        e =>
                            setForm({

                                ...form,

                                location_name:
                                    e.target.value

                            })
                    }

                    required

                />

            </label>


            <div className="two">

                <label>

                    Latitude

                    <input

                        value={
                            form.latitude
                        }

                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    latitude:
                                        e.target.value

                                })
                        }

                        required

                    />

                </label>


                <label>

                    Longitude

                    <input

                        value={
                            form.longitude
                        }

                        onChange={
                            e =>
                                setForm({

                                    ...form,

                                    longitude:
                                        e.target.value

                                })
                        }

                        required

                    />

                </label>

            </div>


            <button
                type="button"
                className="secondary"
                onClick={
                    useCurrentLocation
                }
            >

                📍 Use My Current Location

            </button>


            <label>

                Alert Radius:
                {" "}
                {form.radius}
                {" "}
                meters

                <input

                    type="range"

                    min="20"

                    max="1000"

                    step="10"

                    value={
                        form.radius
                    }

                    onChange={
                        e =>
                            setForm({

                                ...form,

                                radius:
                                    e.target.value

                            })
                    }

                />

            </label>


            <label>

                Optional Date & Time

                <input

                    type="datetime-local"

                    value={
                        form.remind_at
                    }

                    onChange={
                        e =>
                            setForm({

                                ...form,

                                remind_at:
                                    e.target.value

                            })
                    }

                />

            </label>


            <div className="row">

                <button>
                    {editing
                        ? "Update Reminder"
                        : "Save Reminder"
                    }
                </button>


                {editing && (

                    <button
                        type="button"
                        className="secondary"
                        onClick={
                            onCancel
                        }
                    >
                        Cancel
                    </button>

                )}

            </div>

        </form>

    );

}