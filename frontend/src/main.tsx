import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import store from "./redux/store.ts";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

//Config env

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);


root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
