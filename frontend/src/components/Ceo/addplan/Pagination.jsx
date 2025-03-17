import React from "react";

const Pagination = ({ currentPage, nextPage, prevPage }) => {
  return (
    <div className="pagination-controls">
      <button onClick={prevPage} disabled={currentPage === 1}>
        &#8592; {/* Left arrow */}
      </button>
      <button onClick={nextPage}>
        &#8594; {/* Right arrow */}
      </button>
    </div>
  );
};

export default Pagination;
