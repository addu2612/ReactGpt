import { useState, useEffect } from 'react';
import {AiFillCodepenCircle,AiFillSmile} from "react-icons/ai";

function App() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null); // Should be null initially

  const createNewChat = () => {
    const newTitle = `Chat-${new Date().getTime()}`; // Create a unique title for the new chat
    setPreviousChats(prevChats => [...prevChats, { title: newTitle, role: "system"}]);
    setCurrentTitle(newTitle); // Set this new title as the current chat
    setMessage(null);
    setValue('');
  };
  
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue(''); // Directly use an empty string here
  };
  
  const handleSubmit = async () => {
    if (!value.trim()) return; // Prevents sending empty messages
  
    const newMessage = value;
    setValue(''); // Clear the input field
  
    // Optionally, immediately display the user's message in the chat
    setPreviousChats(prevChats => [...prevChats, { title: currentTitle, role: "user", content: newMessage }]);
  
    const options = {
      method: "POST",
      body: JSON.stringify({ message: newMessage }),
      headers: { "Content-type": "application/json" },
    };
  
    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message); // Assuming the response structure, adjust as needed
      
      // Update the chat with the response from the backend
      setPreviousChats(prevChats => [...prevChats, { title: currentTitle, role: "bot", content: data.choices[0].message.content }]);
    } catch (error) {
      console.error(error);
      // Here you can set an error state and display it to the user
    }
  };
  
  // Ensure effects and other logic are correctly implemented here

  useEffect(() => {
    const chatContainer = document.querySelector('.feed');
    if(chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [previousChats]);

  const currentChat = previousChats.filter(chat => chat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(chat => chat.title)));

  return (
    <div className="App">
      <section className="sidebar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className='history'>
          {uniqueTitles.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
      </section>
      <section className='main'>
        {!currentTitle && <h1>CollegeGPT</h1>}
        <ul className='feed'>
    {currentChat.map((chatMessage, index) => (
      <li key={index} className={`message ${chatMessage.role}`}>
        {chatMessage.role === "user" && <AiFillSmile className="icon" />}
        {chatMessage.role === "bot" && <AiFillCodepenCircle className="icon" />}
        <p>{chatMessage.content}</p>
      </li>
    ))}
  </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            {/* Use a button for submitting, and attach the handleSubmit function */}
            <button id='submit' onClick={handleSubmit}>➢</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
