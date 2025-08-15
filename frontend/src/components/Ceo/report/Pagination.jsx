import React from "react";

const Pagination = ({ currentPage, nextPage, prevPage, totalPages = 10 }) => {
  return (
    <div className="professional-pagination">
      <div className="pagination-info">
        <span className="page-indicator">
          📄 Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
      </div>

      <div className="pagination-controls">
        <button
          className="btn btn-pagination btn-prev"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <span className="btn-icon">←</span>
          <span className="btn-text">Previous</span>
        </button>

        <div className="page-numbers">
          {[...Array(Math.min(5, totalPages))].map((_, index) => {
            const pageNum = Math.max(1, currentPage - 2) + index;
            if (pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                className={`btn btn-page ${pageNum === currentPage ? 'active' : ''}`}
                onClick={() => {
                  // This would need to be passed as a prop
                  console.log(`Go to page ${pageNum}`);
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          className="btn btn-pagination btn-next"
          onClick={nextPage}
          disabled={currentPage >= totalPages}
        >
          <span className="btn-text">Next</span>
          <span className="btn-icon">→</span>
        </button>
      </div>

      <div className="pagination-summary">
        <span className="summary-text">
          Navigate through executive reports efficiently
        </span>
      </div>
    </div>
  );
};

export default Pagination;
