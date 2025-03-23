import React from "react";
import "../css/ViewToggle.css"; // Якщо є стилі для перемикача

type ViewToggleProps = {
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
};

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="view-toggle">
      <button
        className={`view-btn ${viewMode === "list" ? "active" : ""}`}
        onClick={() => setViewMode("list")}
      >
        <img className="view-toggle__img view-toggle__list" src="/images/list.png" alt="List" />
      </button>

      <button
        className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
        onClick={() => setViewMode("grid")}
      >
        <img className="view-toggle__img view-toggle__grid" src="/images/grid.png" alt="Grid" />
      </button>
    </div>
  );
};

export default ViewToggle;
