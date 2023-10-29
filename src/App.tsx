import {useEffect , useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "./components/navbar";
import './Dashboard.css';
const NAME = "Chicky";

export default function App() { 
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
<div className="app">

<Navbar />
  <div className="wrapper">
    
    <section className="instructions">
    <h2>How to Use ChickyAI Chat</h2>
<p>Welcome to ChickyAI chat assistance! This chatbot is designed to help you understand your medical report better. Here's how to make the most of it:</p>
<ul>
    <li>For clarity on medical terms, simply ask "What does [term] mean?"</li>
    <li>If there are parts of the physician's opinion you don't understand, ask for a simpler explanation.</li>
    <li>For insights on next steps or any related health topics, let the chatbot know what you're looking for.</li>
</ul>
<p>Remember, while ChickyAI provides guidance and explanations, always consult with a healthcare professional for any serious concerns or decisions.</p>
    </section>
    <section className="chat">
      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.author === NAME ? "message-mine" : ""}
        >
          <div>{message.author}</div>
          <p>{message.body}</p>
        </article>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({ body: newMessageText, author: NAME });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Write a message…"
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>
    </section>
  </div>
</div>
  );
}


