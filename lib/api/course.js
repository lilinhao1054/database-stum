export const pageQueryCourse = (pageSize, page, cname) => fetch(`/api/courses?pageSize=${pageSize}&page=${page}${cname ? `&cname=${cname}` : ''}`)
  .then(res => res.json());

export const createCourse = (data) => fetch('/api/courses', { method: 'POST', body: JSON.stringify(data) })
  .then(res => res.json())
  .then(res => {
    if (!res.success) throw new Error();
  });

export const updateCourse = (cnum, data) => fetch(`/api/courses/${cnum}`, { method: 'PUT', body: JSON.stringify(data) })
  .then(res => res.json())
  .then(res => {
    if (!res.success) throw new Error();
  });

export const removeCourse = (cnum) => fetch(`/api/courses/${cnum}`, { method: 'DELETE' })
  .then(res => res.json())
  .then(res => {
    if (!res.success) throw new Error();
  });

export const getCourseByCnum = (cnum) => fetch(`/api/courses/${cnum}`)
  .then(res => res.json());