import connection from "@/lib/db";

const getStudentBySnum = (snum) => new Promise((resolve, reject) => {
  const sql = `SELECT * FROM student WHERE snum = ?`;
  const values = [snum];
  connection.query(sql, values, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result[0]);
    }
  })
})

const deleteStudent = (snum) => new Promise((resolve, reject) => {
  connection.query(`DELETE FROM student WHERE snum = ?`, snum, (err, results) => {
    if (err) {
      reject(err.message);
    } else resolve();
  })
})

const updateStudent = (snum, data) => new Promise((resolve, reject) => {
  connection.query(`UPDATE student SET ? WHERE snum = ?`, [data, snum], (err, results) => {
    if (err) {
      reject(err.message);
    } else resolve();
  })
})

export async function GET(request, { params }) {
  const snum = params.snum;
  const result = await getStudentBySnum(snum);
  return Response.json(result);
}

export async function DELETE(request, { params }) {
  const snum = params.snum;
  try {
    await deleteStudent(snum);
    return Response.json({ success: true });

  } catch (e) {
    console.log(e);
    return Response.json({ success: false });
  }
}

export async function PUT(request, { params }) {
  const snum = params.snum;
  const data = await request.json();
  try {
    await updateStudent(snum, data);
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false });
  }
}