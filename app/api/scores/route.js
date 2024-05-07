import connection from "@/lib/db";

const getCount = (sql) => new Promise((resolve, reject) => {
  connection.query(sql, (err, results) => {
    if (err) {
      reject(err.message);
    }
    else resolve(results[0]['COUNT(*)']);
  })
})

const pageQueryCourse = (pageSize, page, snum, cnum) => new Promise(async (resolve, reject) => {
  let sql = "SELECT * FROM student_course";
  let res = {};
  if (snum !== null && cnum !== null) {
    sql += ` WHERE snum = ${snum} AND cnum = ${cnum}`;
  } else if (snum !== null) {
    sql += ` WHERE snum = ${snum}`;
  } else if (cnum !== null) {
    sql += ` WHERE cnum = ${cnum}`;
  }
  const count = await getCount(sql);
  res.total = count;
  if (pageSize !== null && page !== null) {
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

const addScore = (data) => new Promise((resolve, reject) => {
  connection.query(`INSERT INTO sc SET ?`, data, (err, results) => {
    if (err) {
      reject(err.message);
    } else resolve();
  })
})

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const pageSize = searchParams.get('pageSize');
  const page = searchParams.get('page');
  const snum = searchParams.get('snum');
  const cnum = searchParams.get('cnum');
  const result = await pageQueryCourse(pageSize, page, snum, cnum);
  return Response.json(result);
}

export async function POST(request) {
  const data = await request.json();
  try {
    await addScore(data);
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false });
  }
}