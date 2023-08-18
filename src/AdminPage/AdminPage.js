import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import AddButton from "../Addbutton/AddButton";
import AddButtonSections from "../Addbutton/AddButtonSections";

import axios from "axios";



const AdminPage = () => {


    return (
        <div>

            <h1>Адмика Е*ать</h1>
            <AddButton />
            <AddButtonSections />
        </div>
    );
}

export default AdminPage;
