import { HashRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";

// Import
import { Welcome } from "./views/Welcome";
import "./styles/globals.css";
import App from "./App";

// Render App in DOM
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="*" Component={App} />
          <Route path="/welcome" Component={Welcome} />
        </Routes>
      </HashRouter>
    </Provider>
  </>
);
