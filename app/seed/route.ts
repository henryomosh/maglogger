import bcrypt from "bcryptjs";
import postgres from "postgres";
import sql from "@/lib/db";
import { users } from "@/lib/placeholder-data";

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      role VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone VARCHAR(255),
      specialities VARCHAR(255),
      status VARCHAR(255) NOT NULL,
      bio VARCHAR(5000),
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, role, name, email, phone, specialities, status, bio, password)
        VALUES (${user.id},${user.role}, ${user.name}, ${user.email},${user.phone},${user.specialities}, ${user.status}, ${user.bio}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedSheduling() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS scheduling (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(255),
      description VARCHAR(255),
      day INT NOT NULL,
      host VARCHAR(255) NOT NULL,
      color VARCHAR(255) NOT NULL,
      start VARCHAR(255) NOT NULL,
      ends VARCHAR(255) NOT NULL,
      recurring BOOLEAN,
      created TIMESTAMP NOT NULL,
      date DATE,
      status VARCHAR(255) NOT NULL,
      staff UUID NOT NULL   
    );
  `;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [seedSheduling()]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
