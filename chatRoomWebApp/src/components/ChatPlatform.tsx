import { useEffect, useState } from "react";

const ChatPlatform = () => {
  const [socket, setSocket] = useState();
  const [currMessage, setCurrMessage] = useState("");
  const [msg, setMsg] = useState([]);
  const [sentMsg, setSentMsg] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [userCount, setUserCount] = useState("0");
  console.log(currMessage);
  console.log(msg);
  console.log(sentMsg);

  const handleKeyDown = (event: any) => {
    if (event.key == "Enter") {
      // console.log("hi there");
      connectToSocket();
    }
  };

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
      console.log(ev.data);
      const joinJsonMessage = JSON.parse(ev.data);
      console.log(joinJsonMessage);
      if (joinJsonMessage.users) {
        setIsJoined(true);
        setUserCount(joinJsonMessage.users);
      }
      //@ts-ignore
      // else
      //   setMsg((prevVal) => {
      //     return [...prevVal, ev.data];
      //   });
    };
  }, []);

  return (
    <div className="flex font-mono gap-5 flex-col relative bg-black justify-center items-center   h-screen w-screen">
      <div className="border-gray-500 shadow-sm shadow-gray-400 gap-5  h-[80%] flex flex-col rounded-md w-[35%] bg-black  p-3 ">
        <div className="h-[10%]   flex border-white">
          <div className="text-white p-1 px-2 text-sm flex items-center w-[70%]">
            {isJoined ? "Room Joined!" : "Join The Room To Send Messages"}
          </div>
          <div className="text-white w-[30%]">
            {!isJoined ? (
              <div
                className="p-2 bg-white text-black rounded-md flex items-center justify-center cursor-pointer"
                onClick={joinRoom}
              >
                Join
              </div>
            ) : (
              <div>Users Connected:{userCount}</div>
            )}
          </div>
        </div>
        <div className="flex border overflow-y-auto border-gray-500 shadow-sm shadow-gray-400  rounded-xl h-[80%] w-full">
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
        <div className="flex h-[10%] p-1 justify-between border-white">
          <input
            value={currMessage}
            type="text"
            placeholder="Type Your Message..."
            onKeyDown={handleKeyDown}
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
            className="border py-1 px-2 cursor-pointer w-[20%] text-center flex items-center justify-center  bg-white duration-200 rounded-md select-none"
          >
            Send
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPlatform;
