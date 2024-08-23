import { Input } from "antd";
import React, { useEffect, useState } from "react";

function Searchbar({ arrOfObj, displayField, onClickHandler }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const results = arrOfObj.filter((item) =>
      item[displayField].toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (results.length > 7) {
      setSearchResults(results.slice(0, 7));
    } else {
      setSearchResults(results);
    }
  }, [arrOfObj, searchQuery, displayField]);

  return (
    <div style={{ position: "relative", zIndex: "999", width: "100%" }}>
      <Input.Search
        placeholder="Search"
        allowClear
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: "100%" }}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
      />
      {hasFocus && searchResults.length > 0 && (
        <ul
          className="search-results"
          style={{
            position: "absolute",
            width: "100%",
            backgroundColor: "white",
            padding: "5px",
          }}
        >
          {searchResults.map((item, index) => (
            <li key={index} onMouseDown={() => onClickHandler(item._id)}>
              {item[displayField]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Searchbar;
