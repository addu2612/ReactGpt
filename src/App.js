import { useState, useEffect } from 'react';

function App() {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState([]);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }

  useEffect(() => {
    const getMessages = async () => {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-type": "application/json"
        }
      };
      try {
        const response = await fetch('http://localhost:8000/completions', options);
        const data = await response.json();
        setMessage(data.choices[0].message);
      } catch (error) {
        console.error(error);
      }
    };

    getMessages();
  }, [value]); // Trigger effect when value changes

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => ([
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        }
      ]))
    }
  }, [message, currentTitle, value]);

  const currentChat = previousChats.filter(chat => chat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(chat => chat.title)));

  return (
    <div className="App">
      <section className="sidebar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Adz</p>
        </nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1>CollegeGPT</h1>}
        <ul className='feed'>
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              {chatMessage.content}
            </li>
          ))}
        </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id='submit'>➢</div>
          </div>
          <p className='info'>Adzzz</p>
        </div>
      </section>
    </div>
  );
}

export default App;
