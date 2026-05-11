import { useEffect, useState } from "react";
import ImageInput from "./ImageInput";
import "./styles.css";
import logo from "./assets/image1.png";

export default function App() {
  const [image, setImage] = useState(null);
  const [language, setLanguage] = useState("English");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(13);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (done || !quiz) return;
    if (time === 0) next();

    const t = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(t);
  }, [time, quiz]);

  const resetQuiz = () => {
    setAnswers({});
    setCurrent(0);
    setDone(false);
    setTime(13);
  };

  const goHome = () => {
    setQuiz(null);
    setAnswers({});
    setCurrent(0);
    setDone(false);
    setTime(13);
    setImage(null);
    setErrorMsg("");
  };

  const upload = async () => {
    if (!image) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("image", image);
      fd.append("language", language);
      fd.append("num_questions", String(numQuestions));

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/generate-quiz`,
        { method: "POST", body: fd }
      );

      const data = await res.json();

      // Check if backend returned an error
      if (data.error) {
        setErrorMsg(data.error);
        return;
      }

      const parsed = JSON.parse(data.quiz.replace(/```json|```/g, ""));

      if (!Array.isArray(parsed) || parsed.length === 0) {
        setErrorMsg("Could not generate quiz. Please upload an image with clear, readable text.");
        return;
      }

      setQuiz(parsed);
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMsg("Something went wrong. Please try again with a different image.");
    } finally {
      setLoading(false);
    }
  };

  const select = (opt) => setAnswers({ ...answers, [current]: opt });

  const next = () => {
    setTime(13);
    if (current + 1 < quiz.length) setCurrent(c => c + 1);
    else setDone(true);
  };

  // --- Score Screen ---
  if (done) {
    const score = quiz.filter((q, i) => answers[i] === q.answer).length;
    const total = quiz.length;
    const percent = Math.round((score / total) * 100);

    return (
      <div className="card">
        <div className="header">📸 Picto Quiz AI</div>
        <div className="score-section">
          <div className="score-emoji">
            {percent >= 80 ? "🏆" : percent >= 50 ? "👏" : "💪"}
          </div>
          <div className="score-title">Quiz Completed!</div>
          <div className="score-text">
            {score} / {total}
          </div>
          <div className="score-label">
            {percent >= 80
              ? "Outstanding performance!"
              : percent >= 50
              ? "Good effort, keep practicing!"
              : "Don't give up, try again!"}
          </div>
          <div className="score-buttons">
            <button className="retry" onClick={resetQuiz}>
              🔁 Retry Quiz
            </button>
            <button className="new-quiz" onClick={goHome}>
              🏠 New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Screen ---
  return (
    <div className="card">
      <div className="header">📸 Picto Quiz AI</div>
      <div className="subtitle">Turn any picture into a fun quiz!</div>

      {/* Upload & Config — shown when no quiz is active */}
      {!quiz && (
        <>
          <ImageInput setImage={setImage} />

          <div className="config-row">
            <div className="language">
              🌐
              <select onChange={(e) => setLanguage(e.target.value)} value={language}>
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
            </div>

            <div className="num-questions">
              📝
              <input
                type="number"
                min={1}
                max={20}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, Number(e.target.value))))}
              />
              <span className="num-label">questions</span>
            </div>
          </div>

          <button className="generate" onClick={upload} disabled={loading}>
            {loading ? "Generating..." : "Generate Quiz"}
          </button>

          <img
            src={logo}
            alt="Logo"
            className={`logo ${loading ? "logo-spin" : ""}`}
          />

          {loading && <div className="loading-text">Analyzing your image with AI...</div>}

          {errorMsg && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <p>{errorMsg}</p>
              <button className="error-dismiss" onClick={() => setErrorMsg("")}>Try Again</button>
            </div>
          )}
        </>
      )}

      {/* Quiz — all contained within the card */}
      {quiz && (
        <>
          <div className="timer">
            {String(Math.floor(time / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
          </div>

          <div className="question-counter">
            QUESTION {current + 1} OF {quiz.length}
          </div>

          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${((current + 1) / quiz.length) * 100}%` }}
            />
          </div>

          <div className="question">{quiz[current].question}</div>

          <div className="options-container">
            {quiz[current].options.map((o, i) => {
              const letter = o[0];
              const correct = quiz[current].answer;
              const selected = answers[current];

              return (
                <div
                  key={i}
                  className={`option ${
                    selected
                      ? letter === correct
                        ? "correct"
                        : letter === selected
                        ? "wrong"
                        : ""
                      : ""
                  }`}
                  onClick={() => !selected && select(letter)}
                >
                  <span>{o}</span>
                  {selected && (
                    <span className="check-icon">
                      {letter === correct ? "✔" : letter === selected ? "✖" : ""}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {answers[current] && (
            <button className="generate" onClick={next}>
              {current + 1 < quiz.length ? "Next →" : "See Results"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
