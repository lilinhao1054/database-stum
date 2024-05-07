export const pageQuerySC = (pageSize, page, snum, cnum) => fetch(`/api/scores?pageSize=${pageSize}&page=${page}${snum ? `&snum=${snum}` : ''}${cnum ? `&cnum=${cnum}` : ''}`)
  .then(res => res.json());

export const createSC = (data) => fetch('/api/scores', { method: 'POST', body: JSON.stringify(data) })
  .then(res => res.json())
  .then(res => {
    if (!res.success) throw new Error();
  });

export const updateSC = (id, data) => fetch(`/api/scores/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  .then(res => res.json())
  .then(res => {
    if (!res.success) throw new Error();
  });

export const removeSC = (id) => fetch(`/api/scores/${id}`, { method: 'DELETE' })
  .then(res => res.json())
  .then(res => {
    if (!res.success) throw new Error();
  });

export const getSCByid = (id) => fetch(`/api/scores/${id}`)
  .then(res => res.json());