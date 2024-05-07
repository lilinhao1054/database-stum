export const pageQueryStudent = (pageSize, page, sname) => fetch(`/api/students?pageSize=${pageSize}&page=${page}${sname ? `&sname=${sname}` : ''}`)
  .then(res => res.json());

export const createStudent = (data) => fetch('/api/students', { method: 'POST', body: JSON.stringify(data) })
  .then(res => res.json())
  .then(res => {
    if (!res.success) throw new Error();
  });

export const updateStudent = (snum, data) => fetch(`/api/students/${snum}`, { method: 'PUT', body: JSON.stringify(data) })
  .then(res => res.json())
  .then(res => {
    if (!res.success) throw new Error();
  });

export const removeStudent = (snum) => fetch(`/api/students/${snum}`, { method: 'DELETE' })
  .then(res => res.json())
  .then(res => {
    if (!res.success) throw new Error();
  });

export const getStudentBySnum = (snum) => fetch(`/api/students/${snum}`)
  .then(res => res.json());