import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState({});
  const [errText, setErrAnswer] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  function setFont(font) {
    console.log(document.body.style.fontFamily);
    document.body.style.fontFamily = font;
  }

  async function searchLogic(e) {
    e.preventDefault();
    console.log("Searching for:", text);

    const search = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
    )
      .then((res) => res.json())
      .then((finalData) => {
        if (finalData[0]) {
          setAnswer(finalData[0]);
          setErrAnswer({});
        } else {
          setErrAnswer(finalData);
          setAnswer({});
        }
      });
  }

  function playSound() {
    let audioUrl = answer.phonetics?.[0]?.audio;
    if (audioUrl) {
      let music = new Audio(audioUrl);
      music.play();
      console.log("Playing sound from:", audioUrl);
    }
  }

  return (
    <div className="App">
      <button
        className={darkMode ? "button dark-mode" : "button light-mode"}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <button onClick={() => setFont("cursive")}>Cursive</button>
      <button onClick={() => setFont("monospace")}>Monospace</button>
      <button onClick={() => setFont("fantasy")}>Fantasy</button>

      <form onSubmit={searchLogic}>
        <input
          className={`search ${darkMode ? "dark-mode" : ""}`}
          onChange={(e) => setText(e.target.value)}
          type="text"
        />
        <button>Search</button>
      </form>

      {answer.word ? (
        <div>
          <h1 className="searchbutton">{answer.word}</h1>
          <h1 className="phonetic">
            {answer.phonetics?.[0]?.text ? answer.phonetics[0].text : ""}
          </h1>
          <button className="sound" onClick={playSound}>
            <img src="play-solid.svg" className="button-logo" />
          </button>
          <h1 className="source">
            {answer.sourceUrls?.[0] ? (
              <a
                href={answer.sourceUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {answer.sourceUrls[0]}
              </a>
            ) : (
              ""
            )}
          </h1>

          <div>
            <h3>Definitions:</h3>
            <ul>
              {answer.meanings?.[0]?.definitions?.map((def, index) => (
                <li key={index}>{def.definition}</li>
              ))}
            </ul>

            <h3>Synonyms:</h3>
            <ul>
              {answer.meanings?.[0]?.synonyms?.map((syn, index) => (
                <li key={index}>{syn}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="error-message">
          <h1>{errText.title ? errText.title : "Word Not Found"}</h1>
          <h2>
            {errText.message ? errText.message : "Please check the spelling."}
          </h2>
        </div>
      )}
    </div>
  );
}

export default App;
