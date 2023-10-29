import {useEffect , useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Outlet, Link, useLoaderData } from "react-router-dom";
// import getExtractedText from "./Upload"
// For demo purposes. In a real app, you'd have real user data.
const NAME = "Chicky";

// export async function loader() {
//   const extractedText = await getExtractedText();
//   return { extractedText };
// }
export default function App() { 
  // const extractedText  = useLoaderData();
  // const chatSummary = useAction(api.messages.summarizeChat)
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // useEffect(() => {
  //   const text = localStorage.getItem('extractedText'); 
  //   console.log(text)
  //   // if (text) setExtractedText(text);
  // }, []);
  
  return (
  <section className="chat">
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
          // chatSummary();
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
  );
}


