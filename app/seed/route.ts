import bcrypt from "bcryptjs";
import postgres from "postgres";
import { primarySql } from "@/lib/db";

async function seedUsers() {
  await primarySql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await primarySql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      role VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone VARCHAR(255),
      specialities VARCHAR(255),
      status VARCHAR(255) NOT NULL,
      bio VARCHAR(5000),
      login VARCHAR(5000),
      logout VARCHAR(5000),
      password TEXT NOT NULL
    );
  `;

  return;
}

async function seedSheduling() {
  await primarySql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await primarySql`
    CREATE TABLE IF NOT EXISTS scheduling (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      standin VARCHAR(255),
      description VARCHAR(255),
      days JSONB,
      color VARCHAR(255) NOT NULL,
      start VARCHAR(255) NOT NULL,
      ends VARCHAR(255) NOT NULL,
      recurring BOOLEAN,
      created TIMESTAMP NOT NULL,
      date DATE,
      staff UUID NOT NULL   
    );
  `;
}

async function seedLogs() {
  await primarySql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await primarySql`
    CREATE TABLE IF NOT EXISTS logs (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      staff UUID NOT NULL,
      show UUID NOT NULL,
      segments JSONB,
      guests JSONB,
      adverts JSONB,
      status VARCHAR(255) NOT NULL,
      created TIMESTAMPTZ NOT NULL,
      ads JSONB
    );
  `;
}

async function seedRequests() {
  await primarySql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await primarySql`
    CREATE TABLE IF NOT EXISTS requests (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      staff_id UUID NOT NULL,
      type VARCHAR(255) NOT NULL,
      reason VARCHAR(255) NOT NULL,
      start_date VARCHAR(255) NOT NULL,
      end_date VARCHAR(255) NOT NULL,
      stand_in VARCHAR(255),
      status VARCHAR(255) NOT NULL,
      notes VARCHAR(10000),
      created TIMESTAMPTZ NOT NULL
    );
  `;
}

async function seedAdverts() {
  await primarySql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await primarySql`
    CREATE TABLE IF NOT EXISTS adverts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      slot VARCHAR(255) NOT NULL,
      shows JSONB,
      created TIMESTAMPTZ NOT NULL
    );
  `;
}

async function seedCommunications() {
  await primarySql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await primarySql`
    CREATE TABLE IF NOT EXISTS communications (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      sender_id UUID NOT NULL,
      sender_name VARCHAR(250) NOT NULL,
      subject VARCHAR(40000) NOT NULL,
      user_status JSONB NOT NULL,
      content TEXT,
      created TIMESTAMPTZ NOT NULL
    );
  `;
}

async function seedNotificatications() {
  await primarySql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await primarySql`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      type VARCHAR(250) NOT NULL,
      title VARCHAR(250) NOT NULL,
      message VARCHAR(250) NOT NULL,
      priority VARCHAR(250) NOT NULL,
      read BOOLEAN NOT NULL,
      user_status JSONB NOT NULL,
      time TIMESTAMPTZ NOT NULL
    );
  `;
}

async function seedAttendance() {
  await primarySql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await primarySql`
    CREATE TABLE IF NOT EXISTS attendance (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      staff UUID NOT NULL,
      clock_in_time TIMESTAMPTZ NOT NULL,
      clock_out_time TIMESTAMPTZ,
      clocked_in BOOLEAN,
      clocked_out BOOLEAN DEFAULT FALSE,
      created TIMESTAMPTZ
    );
  `;
}
export async function GET() {
  try {
    const result = await primarySql.begin((primarySql: any) => [
      seedUsers(),
      seedSheduling(),
      seedLogs(),
      seedRequests(),
      seedAdverts(),
      seedCommunications(),
      seedNotificatications(),
      seedAttendance(),
    ]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
