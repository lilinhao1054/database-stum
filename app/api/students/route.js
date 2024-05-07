import connection from "@/lib/db";

const getCount = (sql) => new Promise((resolve, reject) => {
  connection.query(sql, (err, results) => {
    if (err) {
      reject(err.message);
    }
    else resolve(results[0]['COUNT(*)']);
  })
})

const pageQueryStudent = (pageSize, page, sname) => new Promise(async (resolve, reject) => {
  let sql = `SELECT * FROM student`;
  let res = {};
  if (sname) {
    sql += ` WHERE sname LIKE '${sname}%'`;
  }
  const count = await getCount(sql);
  res.total = count;
  if (pageSize && page) {
    sql += ` LIMIT ${+pageSize} OFFSET ${(+page - 1) * +pageSize}`;
  }
  connection.query(sql, (err, results) => {
    if (err) {
      reject(err.message);
    }
    else resolve({ ...res, records: results });
  }
  )
})

const createStudent = (data) => new Promise((resolve, reject) => {
  connection.query(`INSERT INTO student SET ?`, data, (err, results) => {
    if (err) {
      reject(err.message);
    } else resolve();
  })
})

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const pageSize = searchParams.get('pageSize');
  const page = searchParams.get('page');
  const sname = searchParams.get('sname');
  const result = await pageQueryStudent(pageSize, page, sname);
  return Response.json(result);
}

export async function POST(request) {
  const data = await request.json();
  try {
    await createStudent(data);
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false });
  }
}