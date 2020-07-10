import React from "react";
import logo from "./logo-niaefeup.png";
import { Provider } from "react-redux";

import configureStore from "./configureStore";

import "./App.scss";
import "./styles/global.scss";
import "element-theme-chalk";
import SchedulePage from "./components/SchedulePage";

const store = configureStore();

const App = () => (
    <Provider store={store}>
        <div id="app">
            <header>
                <img
                    src={logo}
                    className="logo"
                    alt="logo"
                />
                <span>Timetable Selector</span>
            </header>
            <main>
                <SchedulePage />
            </main>
        </div>
    </Provider>
);

export default App;
