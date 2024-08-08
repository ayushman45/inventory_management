import { Input } from "antd";
import React, { useEffect, useState } from "react";

function Searchbar({ arrOfObj, displayField, onClickHandler }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const results = arrOfObj.filter((item) =>
      item[displayField].toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }, [arrOfObj, searchQuery, displayField]);

  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <Input.Search
        placeholder="Search"
        allowClear
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: 200 }}
      />
      {searchResults.length > 0 && (
        <ul
          style={{
            position: "absolute",
            width: "200px",
            backgroundColor: "white",
            padding: "5px",
          }}
        >
          {searchResults.map((item, index) => (
            <li key={index} onClick={() => onClickHandler(item._id)}>
              {item[displayField]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Searchbar;
