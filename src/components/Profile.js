import React, { useContext } from 'react'
import noteContext from "../context/notes/noteContext"


const Profile = () => {
    const context = useContext(noteContext);
    const { notes } = context;

    return (
        <div>
            Total Notes: {notes.length}

        </div>
    )
}

export default Profile