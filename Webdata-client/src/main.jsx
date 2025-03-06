import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app.jsx";
import "animate.css";
import { ToastContainer } from "react-toastify";
import DataProvider from "./Store/DataProvider.jsx";
//Import Register Licence from syncfusion
import { registerLicense } from "@syncfusion/ej2-base";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";
import "../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../node_modules/@syncfusion/ej2-notifications/styles/material.css";
import "../node_modules/@syncfusion/ej2-react-grids/styles/material.css";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXhdcHRVQmVeV0F3Wks="
);

fetch("/config.json")
  .then((response) => response.json())
  .then((config) => {
    console.log(config);
    window.APP_IP = config.APP_IP;
    window.SERVER_IP = config.SERVER_IP; // Store SERVER_IP globally
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <DataProvider>
          <App />
          <ToastContainer
            position="top-center"
            autoClose={500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </DataProvider>
      </React.StrictMode>
    );
  })
  .catch((error) => console.error("Error loading config:", error));
