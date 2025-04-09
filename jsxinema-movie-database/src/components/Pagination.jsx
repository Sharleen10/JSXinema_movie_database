import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Calculate which page numbers to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  
  // Ensure we always show 5 pages if available
  if (endPage - startPage < 4 && totalPages > 5) {
    if (startPage === 1) {
      endPage = Math.min(5, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 4);
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="pagination">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="pagination-btn"
      >
        &laquo;
      </button>
      
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="pagination-btn"
      >
        &lt;
      </button>
      
      {startPage > 1 && (
        <>
          <button 
            onClick={() => onPageChange(1)}
            className="pagination-btn"
          >
            1
          </button>
          {startPage > 2 && <span className="ellipsis">...</span>}
        </>
      )}
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="ellipsis">...</span>}
          <button 
            onClick={() => onPageChange(totalPages)}
            className="pagination-btn"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="pagination-btn"
      >
        &gt;
      </button>
      
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="pagination-btn"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;