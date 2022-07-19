import React, { useEffect, useState } from "react";
import "./App.css";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios
      .get("/messages/sync")
      .then((response) => {
        console.log(messages);
        setMessages(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [messages]);

  useEffect(() => {
    const pusher = new Pusher("173b41f57833c737c9be", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);

  return (
    <div className="app">
      <div className="app__body">
        {/* sidebar */}
        <Sidebar />

        {/* chat component */}
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
