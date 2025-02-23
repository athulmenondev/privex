// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import CryptoJS from "crypto-js";

const socket = io("http://localhost:5000");
const SECRET_KEY = "supersecretkey"; // Same as in the backend

const App = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            const decryptedMessage = CryptoJS.AES.decrypt(data.message, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            setMessages((prev) => [...prev, { user: data.user, message: decryptedMessage }]);
        });
    }, []);

    const sendMessage = () => {
        if (message) {
            socket.emit("send_message", { user: "User1", message });
            setMessage("");
        }
    };

    return (
        <div>
            <h1>Secure Messenger</h1>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        <strong>{msg.user}: </strong> {msg.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
