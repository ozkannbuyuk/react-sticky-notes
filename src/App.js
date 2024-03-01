import { useRef, useState, useEffect } from "react";
import "./App.css";
import MainContext from "./MainContext";
import Note from "./components/Note";
import NoteBox from "./components/NoteBox";
import LeaveCommentText from "./components/LeaveCommentText";

function App() {
  const screenRef = useRef(null);
  const [mode, setMode] = useState(false);
  const [notes, setNotes] = useState(
    localStorage.getItem("notes")
      ? JSON.parse(localStorage.getItem("notes"))
      : []
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [boxVisible, setBoxVisible] = useState(false);
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    screenRef.current.focus();
    document.title = "React Sticky Notes";
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleKeyUp = (e) => {
    if (e.key === "c") {
      setMode((prevMode) => !prevMode);
      setBoxVisible(false);
    }
    if (e.key === "Escape") {
      setBoxVisible(false);
    }
  };

  const handleMouseMove = (e) => {
    setPosition({ x: e.pageX, y: e.pageY });
  };

  const handleClick = () => {
    if (mode) {
      setBoxPosition({ x: position.x, y: position.y });
      setBoxVisible(true);
    }
  };

  const contextData = {
    position,
    boxPosition,
    setMode,
    setNotes,
    setBoxVisible,
    notes,
  };

  return (
    <MainContext.Provider value={contextData}>
      <div
        ref={screenRef}
        tabIndex={0}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onKeyUp={handleKeyUp}
        className={`screen${mode ? " editable" : ""}`}
        style={{
          backgroundImage: `url("https://cdn.pixabay.com/photo/2016/12/17/17/44/presents-1913987_1280.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          filter: "brightness(80%)",
        }}
      >
        {mode && <LeaveCommentText />}

        {notes.map((note, index) => (
          <Note key={index} {...note} />
        ))}

        {boxVisible && <NoteBox />}
      </div>
      <div className="sticky-bar">
        <button
          onClick={() => setMode((prevMode) => !prevMode)}
          className={mode ? "active" : ""}
        >
          Comment Mode <code>c</code>
        </button>
        {boxVisible && (
          <button onClick={() => setBoxVisible(false)} className="active">
            Close <code>Esc</code>
          </button>
        )}
      </div>
    </MainContext.Provider>
  );
}

export default App;
