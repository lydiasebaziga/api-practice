// useState stores the data we get back; useEffect runs the fetches on page load
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // One state variable per API. Each starts empty so we can show "Loading..."
  const [books, setBooks] = useState([]);
  const [advice, setAdvice] = useState(null);
  const [weather, setWeather] = useState(null);
  const [articles, setArticles] = useState([]);

  // 1. Google Books: runs once, when the user arrives at the site
  useEffect(() => {
    fetch(
      "https://www.googleapis.com/books/v1/volumes?q=harry+potter&maxResults=5",
    )
      // Convert the raw response into a JavaScript object
      .then((response) => response.json())
      // The books are in data.items
      .then((data) => setBooks(data.items || []))
      .catch((error) => console.error("Books error:", error));
  }, []); // [] = run only once

  // 2. Advice Slip: runs once
  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then((response) => response.json())
      // The result looks like { slip: { id: 12, advice: "..." } }
      .then((data) => setAdvice(data.slip))
      .catch((error) => console.error("Advice error:", error));
  }, []);

  // 3. Weather: runs once
  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=37.77&longitude=-122.42&current_weather=true",
    )
      .then((response) => response.json())
      // The values we need are inside data.current_weather
      .then((data) => setWeather(data.current_weather))
      .catch((error) => console.error("Weather error:", error));
  }, []);

  // 4. News API (VS Code only): runs once.
  // The key comes from the .env file; Vite exposes it as import.meta.env.VITE_...
  useEffect(() => {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`,
    )
      .then((response) => response.json())
      // The stories are in data.articles
      .then((data) => setArticles(data.articles || []))
      .catch((error) => console.error("News error:", error));
  }, []);

  return (
    <div className="App">
      <h1>API Practice</h1>

      {/* 1. Google Books section */}
      <section className="api-section">
        <h2>Harry Potter Books</h2>
        {books.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {/* Map over the 5 results; each book's id works as the key */}
            {books.map((book) => (
              <li key={book.id}>
                <strong>{book.volumeInfo.title}</strong>
                <br />
                {/* authors is an array and can be missing, so check first */}
                by{" "}
                {book.volumeInfo.authors
                  ? book.volumeInfo.authors.join(", ")
                  : "Unknown author"}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 2. Advice Slip section */}
      <section className="api-section">
        <h2>Advice</h2>
        {advice ? (
          <>
            <p>ID: {advice.id}</p>
            <p>{advice.advice}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </section>

      {/* 3. Weather section */}
      <section className="api-section">
        <h2>Current Weather (San Francisco)</h2>
        {weather ? (
          <>
            {/* Open-Meteo returns Celsius and km/h by default */}
            <p>Temperature: {weather.temperature}°C</p>
            <p>Wind speed: {weather.windspeed} km/h</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </section>

      {/* 4. News section */}
      <section className="api-section">
        <h2>Tech News</h2>
        {articles.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {/* Articles have no id, so use the index as the key */}
            {articles.map((article, index) => (
              <li key={index}>
                <strong>{article.title}</strong>
                <br />
                {/* author can be null, so show a fallback */}
                by {article.author || "Unknown author"}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
