import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwrite.Config";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2 } from "react-feather";

const Room = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create",
          )
        ) {
          console.log("A MESSAGE WAS CREATED");
          setMessages((prevState) => [response.payload, ...prevState]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete",
          )
        ) {
          console.log("A MESSAGE WAS DELETED!!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id),
          );
        }
      },
    );

    console.log("UNSUBSCRIBE: ", unsubscribe);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    let permissions = [
      Permission.write(user.$id),
      Permission.read(Role.member),
    ];

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permissions,
    );

    setMessageBody("");
  };

  const getMessages = async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc("$createdAt")],
      Query.limit(10),
    );

    setMessages(response.documents);
  };

  const deleteMessage = async (message_id) => {
    databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form className="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              cols="30"
              rows="4"
              maxLength="1000"
              placeholder="Type your message here..."
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
            ></textarea>
            <div className="btn btn--wrapper">
              <input
                type="submit"
                value="Send"
                className="btn btn--secondary"
              />
            </div>
          </div>
        </form>
        <div>
          <h2>Messages</h2>
          <ul>
            {messages.map((message) => (
              <div key={message.$id} className="message--wrapper">
                <div className="message--header">
                  <p>
                    {message?.username ? (
                      <span className="message--username">
                        {message.username}
                      </span>
                    ) : (
                      <span className="message--username">Anonymous</span>
                    )}{" "}
                    <small className="message-timestamp">
                      {new Date(message.$createdAt).toLocaleTimeString()}
                    </small>
                  </p>
                  {message.$permissions.includes(
                    `delete(\"user:${user.$id}\")`,
                  ) && (
                    <Trash2
                      className="delete--btn"
                      onClick={() => {
                        deleteMessage(message.$id);
                      }}
                    />
                  )}
                </div>
                <div className="message--body">
                  <span>{message.body}</span>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Room;
