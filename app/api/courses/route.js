import connection from "@/lib/db";

const getCount = (sql) => new Promise((resolve, reject) => {
  connection.query(sql, (err, results) => {
    if (err) {
      reject(err.message);
    }
    else resolve(results[0]['COUNT(*)']);
  })
})

const pageQueryCourse = (pageSize, page, cname) => new Promise(async (resolve, reject) => {
  let sql = `SELECT * FROM course`;
  let res = {};
  if (cname != null) {
    sql += ` WHERE cname LIKE '${cname}%'`;
  }
  const count = await getCount(sql);
  res.total = count;
  if (page != null && pageSize != null) {
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

const createCourse = (data) => new Promise((resolve, reject) => {
  connection.query(`INSERT INTO course SET ?`, data, (err, results) => {
    if (err) {
      reject(err.message);
    } else resolve();
  })
})

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const pageSize = searchParams.get('pageSize');
  const page = searchParams.get('page');
  const cname = searchParams.get('cname');
  const result = await pageQueryCourse(pageSize, page, cname);
  return Response.json(result);
}

export async function POST(request) {
  const data = await request.json();
  try {
    await createCourse(data);
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false });
  }
}