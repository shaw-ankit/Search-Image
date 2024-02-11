import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";

const API_URL = "https://api.unsplash.com/search/photos";
const GET_IMAGE_PER_PAGE = 20;

function App() {
  // console.log('key',import.meta.env.VITE_API_KEY);
  const searchInput = useRef(null);

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error , setError] = useState('')

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setError("");
        const { data } = await axios.get(`${API_URL}?query=${
          searchInput.current.value
        }
        &page=${page}
        &per_page=${GET_IMAGE_PER_PAGE}
        &client_id=${import.meta.env.VITE_API_KEY}`);
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setError("Error fetching images. Try again later.")
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const searchHandler = (event) => {
    event.preventDefault();
    console.log(searchInput.current.value);
    resetSearch();
  };

  const selectionHandler = (selected) => {
    searchInput.current.value = selected;
    resetSearch();
  };

  console.log("page:", page);
  return (
    <div className="container">
      <h1 className="title">Search down Image</h1>
      {/* error message */}
      {error && <p className="error-msg">{error}</p>}
      {/* seaching area */}
      <div className="search-section">
        <Form onSubmit={searchHandler}>
          <Form.Control
            type="search"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>
      {/* customs image searching buttons */}
      <div className="filters">
        <div onClick={() => selectionHandler("Boy")}>Boy</div>
        <div onClick={() => selectionHandler("Girl")}>Girl</div>
        <div onClick={() => selectionHandler("Nature")}>Nature</div>
        <div onClick={() => selectionHandler("Cats")}>Cats</div>
        <div onClick={() => selectionHandler("Puppy")}>Puppy</div>
      </div>
      {/* rendering the search image */}
      <div className="images">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="image"
          />
        ))}
      </div>
      {/* pagination */}
      <div className="buttons">
        {page > 1 && (
          <Button onClick={() => setPage(page - 1)}> Previous </Button>
        )}
        {page < totalPages && (
          <Button onClick={() => setPage(page + 1)}> Next </Button>
        )}
      </div>
    </div>
  );
}

export default App;
