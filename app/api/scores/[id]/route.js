import connection from "@/lib/db";

const getSCById = (id) => new Promise((resolve, reject) => {
  const sql = `SELECT * FROM student_course WHERE id = ?`;
  const values = [id];
  connection.query(sql, values, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result[0]);
    }
  })
})

const deleteScore = (id) => new Promise((resolve, reject) => {
  connection.query(`DELETE FROM sc WHERE id = ?`, id, (err, results) => {
    if (err) {
      reject(err.message);
    } else resolve();
  })
})

const updateScore = (id, data) => new Promise((resolve, reject) => {
  connection.query(`UPDATE sc SET ? WHERE id = ?`, [data, id], (err, results) => {
    if (err) {
      reject(err.message);
    } else resolve();
  })
})

export async function GET(request, { params }) {
  const id = params.id;
  const result = await getSCById(id);
  return Response.json(result);
}

export async function DELETE(request, { params }) {
  const id = params.id;
  try {
    await deleteScore(id);
    return Response.json({ success: true });

  } catch (e) {
    return Response.json({ success: false });
  }
}

export async function PUT(request, { params }) {
  const id = params.id;
  const data = await request.json();
  try {
    await updateScore(id, data);
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false });
  }
}