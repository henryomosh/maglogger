import postgres from "postgres";

// const sql = postgres(process.env.POSTGRES_URL!, {
//   // uncomment if using local database
//   // ssl: process.env.NODE_ENV === "production" ? "require" : false,
// });

const primarySql = postgres(process.env.POSTGRES_URL!);
const readSql = postgres(process.env.POSTGRES_READ_REPLICA_URL!);

export { primarySql, readSql };
