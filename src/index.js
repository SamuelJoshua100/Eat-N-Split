import React from "react"; // Importing the React library
import ReactDOM from "react-dom/client"; // Importing the ReactDOM library for rendering the app
import "./index.css"; // Importing the CSS file for global styles
import App from "./App"; // Importing the main App component

// Creating the root element to render the React app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Rendering the App component inside the root element within React.StrictMode
root.render(
  <React.StrictMode>
    <App /> {/* The main application component */}
  </React.StrictMode>
);
