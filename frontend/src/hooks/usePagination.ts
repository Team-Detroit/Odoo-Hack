import { useState } from 'react';

export const usePagination = (total: number, pageSize = 10) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / pageSize);
  return { page, setPage, totalPages, pageSize, offset: (page - 1) * pageSize };
};
