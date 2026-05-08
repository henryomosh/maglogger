import postgres from "postgres";

// const sql = postgres(process.env.POSTGRES_URL!, {
//   // uncomment if using local database
//   // ssl: process.env.NODE_ENV === "production" ? "require" : false,
// });

const isDev = process.env.NODE_ENV === "development";

let primarySql: any = isDev
  ? postgres(process.env.POSTGRES_URL!)
  : postgres(process.env.POSTGRE_BACKUP_URL!);

let readSql: any = isDev
  ? postgres(process.env.POSTGRES_URL!)
  : postgres(process.env.POSTGRE_BACKUP_URL!);

export { primarySql, readSql };
