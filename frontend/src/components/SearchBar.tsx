import React from "react";
import "../css/SearchBar.css";

type SearchBarProps = {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchInput, setSearchInput, setSearchTerm }) => {
  return (
    <div className="search__block">
      <div className="search__inner">
        <input
          className="search__input input"
          type="text"
          placeholder="🔍 Suche nach Titel oder Autor"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button
          className="search__btn search__btn--find btn btn-accent"
          onClick={() => setSearchTerm(searchInput)}
          style={{ padding: "8px 16px" }}
        >
          <img className="search__img" src="../images/search.png" alt="Deco" />
         
          <span>Suche</span>
        </button>

        <button
          className="search__btn search__btn--reset btn"
          onClick={() => {
            setSearchInput("");
            setSearchTerm("");
          }}
        >
          Suchfilter löschen
        </button>
      </div>

      {/* <div className="search__reset">

        <button
          className="search__btn search__btn--reset btn"
          onClick={() => {
            setSearchInput("");
            setSearchTerm("");
          }}
        >
          Suchfilter löschen
        </button>
      </div> */}
    </div>
  );
};

export default SearchBar;
