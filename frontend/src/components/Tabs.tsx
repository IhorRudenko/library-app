// src/components/Tabs.tsx
import React from "react";
import "../css/Tabs.css";

type TabsProps = {
  activeTab: "all" | "readingList";
  setActiveTab: React.Dispatch<React.SetStateAction<"all" | "readingList">>;
};

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tabs">
      <button
        className="tabs__btn tabs__btn--left"
        onClick={() => setActiveTab("all")}
        style={{
          backgroundColor: activeTab === "all" ? "#0054f5" : "#d2d2d2",
          color: activeTab === "all" ? "#fff" : "#1445b8",
        }}
      >
        Gesamte Liste
      </button>

      <button
        className="tabs__btn tabs__btn--right"
        onClick={() => setActiveTab("readingList")}
        style={{
          backgroundColor: activeTab === "readingList" ? "#0054f5" : "#d2d2d2",
          color: activeTab === "all" ? "#1445b8" : "#fff",
        }}
      >
        <img className="tabs__btn-icon" src="/images/star.png" alt="Star"/>

        Favoriten
      </button>
    </div>
  );
};

export default Tabs;
