import connection from "@/lib/db";

const getCourseByCnum = (cnum) => new Promise((resolve, reject) => {
  const sql = `SELECT * FROM course WHERE cnum = ?`;
  const values = [cnum];
  connection.query(sql, values, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result[0]);
    }
  })
})

const deleteCourse = (cnum) => new Promise((resolve, reject) => {
  connection.query(`DELETE FROM course WHERE cnum = ?`, cnum, (err, results) => {
    if (err) {
      reject(err.message);
    } else resolve();
  })
})

const updateCourse = (cnum, data) => new Promise((resolve, reject) => {
  connection.query(`UPDATE course SET ? WHERE cnum = ?`, [data, cnum], (err, results) => {
    if (err) {
      reject(err.message);
    } else resolve();
  })
})

export async function GET(request, { params }) {
  const cnum = params.cnum;
  const result = await getCourseByCnum(cnum);
  return Response.json(result);
}

export async function DELETE(request, { params }) {
  const cnum = params.cnum;
  try {
    await deleteCourse(cnum);
    return Response.json({ success: true });

  } catch (e) {
    return Response.json({ success: false });
  }
}

export async function PUT(request, { params }) {
  const cnum = params.cnum;
  const data = await request.json();
  try {
    await updateCourse(cnum, data);
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false });
  }
}