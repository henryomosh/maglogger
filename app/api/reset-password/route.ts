import bcrypt from "bcryptjs";
import postgres from "postgres";
import { primarySql } from "@/lib/db";
import { users } from "@/lib/placeholder-data";

async function resetPassword() {
  const pass = "Invalid@68";
  const hashed_pass: any = await bcrypt.hash(pass, 10);
  const email = "henryomosh7@gmail.com";

  //   await sql`INSERT INTO users (role, name, email, phone, specialities, status, bio, password)
  //     VALUES ('admin', 'henry', ${email}, '037773773773', 'news', 'active', 'None', ${hashed_pass})`;
  await primarySql`UPDATE users SET password=${hashed_pass} WHERE email=${email}`;
}

export async function GET() {
  try {
    const result = await primarySql.begin((sql) => [resetPassword()]);

    return Response.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
