import React, {
    useEffect
} from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap
} from "react-leaflet";

import L from "leaflet";


const markerIcon =
    new L.Icon({

        iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

        shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

        iconSize:
            [25, 41],

        iconAnchor:
            [12, 41]

    });


function Recenter({
    position
}) {

    const map =
        useMap();


    useEffect(() => {

        if (position) {

            map.setView(

                [
                    position.latitude,
                    position.longitude
                ],

                15

            );

        }

    }, [
        position,
        map
    ]);


    return null;

}


export default function MapView({
    reminders,
    position
}) {

    const defaultLocation = {

        latitude:
            17.3850,

        longitude:
            78.4867

    };


    const center =
        position ||
        (
            reminders.length

                ?

                {
                    latitude:
                        Number(
                            reminders[0].latitude
                        ),

                    longitude:
                        Number(
                            reminders[0].longitude
                        )
                }

                :

                defaultLocation
        );


    return (

        <div className="card map-card">

            <h2>
                📍 Location Map
            </h2>


            <MapContainer

                center={[
                    center.latitude,
                    center.longitude
                ]}

                zoom={13}

                style={{
                    height: "520px",
                    width: "100%"
                }}

            >

                <TileLayer

                    attribution='&copy; OpenStreetMap contributors'

                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                />


                <Recenter
                    position={position}
                />


                {position && (

                    <Marker

                        position={[
                            position.latitude,
                            position.longitude
                        ]}

                        icon={
                            markerIcon
                        }

                    >

                        <Popup>

                            📍 You are here

                        </Popup>

                    </Marker>

                )}


                {reminders.map(
                    reminder => (

                        <React.Fragment
                            key={
                                reminder.id
                            }
                        >

                            <Marker

                                position={[
                                    Number(
                                        reminder.latitude
                                    ),

                                    Number(
                                        reminder.longitude
                                    )
                                ]}

                                icon={
                                    markerIcon
                                }

                            >

                                <Popup>

                                    <b>
                                        {
                                            reminder.title
                                        }
                                    </b>

                                    <br />

                                    {
                                        reminder.location_name
                                    }

                                    <br />

                                    Radius:
                                    {" "}
                                    {
                                        reminder.radius
                                    }
                                    m

                                </Popup>

                            </Marker>


                            <Circle

                                center={[
                                    Number(
                                        reminder.latitude
                                    ),

                                    Number(
                                        reminder.longitude
                                    )
                                ]}

                                radius={
                                    reminder.radius
                                }

                            />

                        </React.Fragment>

                    )
                )}

            </MapContainer>

        </div>

    );

}