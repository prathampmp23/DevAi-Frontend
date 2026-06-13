import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

function MarkdownMessage({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }

    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(reply.slice(0, idx + 1));

      idx++;

      if (idx >= reply.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [reply]);

  return (
    <>
      {newChat && <h1 className="newChatHeading">Start a New Chat!</h1>}

      <div className="chats">
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <MarkdownMessage content={chat.content} />
            )}
          </div>
        ))}

        {prevChats.length > 0 && (
          <div className="gptDiv">
            <MarkdownMessage
              content={latestReply ?? prevChats[prevChats.length - 1].content}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
