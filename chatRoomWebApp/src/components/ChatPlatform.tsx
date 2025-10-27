import { useEffect, useState } from "react";

const ChatPlatform = () => {
  const [socket, setSocket] = useState();
  const [currMessage, setCurrMessage] = useState("");
  const [msg, setMsg] = useState([]);
  const [sentMsg, setSentMsg] = useState([]);

  console.log(currMessage);
  console.log(msg);
  console.log(sentMsg);

  function connectToSocket() {
    if (!socket) return;
    const JsonMessage = JSON.parse(`{
      "type":"chat",
      "payload":{
        "roomId":"123",
        "message":"${currMessage.toString()}"
        }
        }`);
    //@ts-ignore
    socket.send(JSON.stringify(JsonMessage));
    //@ts-ignore
    setSentMsg((prevVal) => {
      return [...prevVal, currMessage];
    });
    setCurrMessage("");
  }
  function joinRoom() {
    if (!socket) return;
    const JsonMessage = JSON.parse(`{
      "type":"join",
      "payload":{
        "roomId":"123"
         
        }
        }`);
    //@ts-ignore
    socket.send(JSON.stringify(JsonMessage));
    //@ts-ignore
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    //@ts-ignore
    setSocket(ws);
    ws.onmessage = (ev) => {
      //@ts-ignore
      setMsg((prevVal) => {
        return [...prevVal, ev.data];
      });
    };
  }, []);

  return (
    <div className="flex gap-5 flex-col relative bg-black justify-center items-center   h-screen w-screen">
      <div className="border h-[80%] flex flex-col rounded-md w-[35%] bg-black border-gray-300 overflow-hidden">
        <div className="flex h-[90%] w-full">
          <div className="w-1/2 items-start   flex flex-col-reverse gap-1 p-2 ">
            {msg.map((elem) => {
              return (
                <div className="text-black bg-white flex justify-center items-center text-wrap max-w-full w-auto min-h-[2rem] rounded-sm p-2 overflow-x-auto px-3">
                  {elem}
                </div>
              );
            })}
          </div>
          <div className="w-1/2 items-end  flex flex-col-reverse gap-1 p-2">
            {sentMsg.map((elem) => {
              return (
                <div className=" text-black bg-white flex justify-center items-center text-wrap max-w-full w-auto min-h-[2rem] rounded-sm p-2 overflow-x-auto px-3">
                  {elem}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex   h-[10%] p-1 justify-between border-white">
          <input
            value={currMessage}
            type="text"
            placeholder="Type Your Message..."
            className="outline-none   w-[80%] text-white    h-full p-1 px-2 "
            onChange={(e) => {
              const { value } = e.target;
              //@ts-ignore
              // console.log(value);
              setCurrMessage(value);
            }}
          />
          <div
            onClick={connectToSocket}
            className="border py-1 px-2 cursor-pointer w-[20%] text-center flex items-center justify-center  bg-white duration-200 rounded-md"
          >
            Send
          </div>
        </div>
      </div>
      <div
        onClick={joinRoom}
        className="absolute right-80 bottom-17 border py-1 px-2 cursor-pointer hover:bg-amber-100 duration-200 rounded-sm"
      >
        Join
      </div>
    </div>
  );
};

export default ChatPlatform;
