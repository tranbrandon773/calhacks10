import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Outlet, Link } from "react-router-dom";
// For demo purposes. In a real app, you'd have real user data.
const NAME = "Chicky";

export default function App() {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const text = localStorage.getItem('extractedText');  // Get extractedText from local storage
    console.log(text)
    // if (text) setExtractedText(text);
  }, []);
  return (
    <main className="chat">
      <header>
        <h1>ChickyAI Cat</h1>
        <p>
          Connected as <strong>{NAME}</strong>
        </p>
      </header>
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
    </main>
  );
}