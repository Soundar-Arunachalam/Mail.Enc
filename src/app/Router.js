import React from "react";
import ReactDOM from "react-dom";
import {HashRouter} from "react-router-dom"
import App from "./app"

document.addEventListener('DOMContentLoaded',init);
function init(){

    const root=document.createElement("div");
    ReactDOM.render((

        <HashRouter>
            <App/>
        </HashRouter>
    ),document.body.appendChild(root)
    );
}