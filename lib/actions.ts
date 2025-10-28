"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sql from "@/lib/db";
import bcrypt from "bcryptjs";
import {
  fetchUser,
  fetchUserById,
  fetchCommunicationById,
  fetchCommunicationUsers,
  fetchNoificationById,
} from "@/lib/data";
import { formatDateToLocal } from "./utils";
import { DateTime } from "luxon";
import { error } from "console";
import { json } from "stream/consumers";

export async function createStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const specialities = formData.get("specialities") as string;
  const status = formData.get("status") as string;
  const bio = formData.get("bio") as string;
  const login = formData.get("login") as string;
  const logout = formData.get("logout") as string;

  const password = formData.get("password") as string;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await fetchUser(email);
  if (user) {
    return { success: false, message: "A user with that email exists!" };
  }

  // Saving to a database

  try {
    await sql`
      INSERT INTO users (role, name, email, phone, specialities, status, bio, password, login, logout)
      VALUES (${role}, ${name}, ${email}, ${phone}, ${specialities}, ${status}, ${bio}, ${hashedPassword}, ${login}, ${logout})
    `;
  } catch (error: any) {
    if (error) {
      return { success: false, message: "Server error occured" };
    }
  }
  revalidatePath("/dashboard/staff");
  return { success: true, message: "" };
}

export async function updateStaff(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const specialities = formData.get("specialities") as string;
  const status = formData.get("status") as string;
  const bio = formData.get("bio") as string;
  const password = formData.get("password") as string;
  const login = formData.get("login") as string;
  const logout = formData.get("logout") as string;

  const user = await fetchUserById(id);
  let setPassword = user?.password;

  if (user.email !== email) {
    const checkEmail = await fetchUser(email);
    if (checkEmail) {
      return { success: false, message: "A user with that email exist!" };
    }
  }

  if (password !== "") {
    const hashedPassword = await bcrypt.hash(password, 10);
    setPassword = hashedPassword;
  }

  try {
    await sql`
      UPDATE users
      SET role = ${role}, name = ${name} , email = ${email} , phone = ${phone},
      specialities = ${specialities}, status = ${status}, bio = ${bio} , password=${setPassword}, login= ${login}, logout=${logout}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    if (error) {
      console.log(error);
      return { success: false, message: "Server error occured" };
    }
  }
  revalidatePath("/dashboard/staff");
  return { success: true, message: "Form submitted successfully!" };
}

export async function deleteStaff(id: string) {
  await sql`DELETE FROM users WHERE id = ${id}`;
  await sql`DELETE FROM scheduling WHERE staff = ${id}`;
  await sql`DELETE FROM logs WHERE staff = ${id}`;
  revalidatePath("/dashboard/staff");
}

export async function createScheduling(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const date = formData.get("date") as string;
  const recurring = formData.get("isRecurring");
  const staffId = formData.get("staffId") as string;
  let days = formData.get("days") as string;
  const standIn = formData.get("stand-in") as string;

  // Saving to a database

  const created = new Date();
  const isRecurring = recurring ? true : false;

  if (!isRecurring) {
    const daysParsed = JSON.parse(days);
    const dayValue = new Date(date).getDay();
    daysParsed[dayValue].value = true;
    days = JSON.stringify(daysParsed);
  }

  try {
    await sql` INSERT INTO scheduling (title, standin, description, days, color, start, ends, recurring, created, date,  staff)
    VALUES (${title}, ${standIn},  ${description}, ${days},  ${color}, ${startTime}, ${endTime}, ${isRecurring}, ${created}, ${date}, ${staffId} )
    `;
    revalidatePath("/dashboard/schedulindg");
  } catch (error: any) {
    if (error) {
      console.log(error);
      return { success: false, message: "Opps! Something went wrong." };
    }
  }
}

export async function updateScheduling(formData: FormData) {
  const title = formData.get("title") as string;
  const staffId = formData.get("staffId") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const date = formData.get("date") as string;
  const recurring = formData.get("isRecurring");
  const id = formData.get("id") as string;
  let days = formData.get("days") as string;
  const standIn = formData.get("stand-in") as string;

  // Saving to a database

  const isRecurring = recurring ? true : false;

  if (!isRecurring) {
    const daysParsed = JSON.parse(days);
    const dayValue = new Date(date).getDay();
    daysParsed[dayValue].value = true;
    days = JSON.stringify(daysParsed);
  }

  try {
    await sql` UPDATE 
     scheduling SET title=${title}, standin=${standIn}, description= ${description}, days=${days}, color=${color}, 
     start=${startTime}, ends=${endTime}, recurring=${isRecurring}, date = ${date}, staff = ${staffId}
     WHERE id= ${id}
    `;
  } catch (error) {
    if (error) {
      console.log(error);
      return { success: false, message: "Opss server error" };
    }
  }
  revalidatePath("/dashboard/scheduling");
  return { success: true, message: "Form submitted successfully!" };
}

export async function deleteSchedule(id: string) {
  try {
    await sql`DELETE FROM scheduling WHERE id = ${id}`;
    await sql`DELETE FROM logs WHERE show = ${id}`;
  } catch (error) {
    if (error) {
      return { success: false };
    }
  }
  revalidatePath("/dashboard/scheduling");
}

export async function createLog(formData: FormData) {
  const show = formData.get("show") as string;
  const segments = formData.get("segments") as string;
  const guests = formData.get("guests") as string;
  const adverts = formData.get("adverts") as string;
  const staff = formData.get("staff") as string;
  const ads = formData.get("ads") as string;
  const status = formData.get("status")
    ? (formData.get("status") as string)
    : "pending";

  const created = new Date();

  const user = await fetchUserById(staff);
  // Saving to a database
  const title = "Log approval pending";
  const message = `${user?.name} has created show log`;

  const userData: any = await fetchCommunicationUsers();
  try {
    await sql`
      INSERT INTO logs (staff, show, segments, guests, adverts, status, created, ads)
      VALUES (${staff}, ${show},  ${segments}, ${guests}, ${adverts}, ${status}, ${created}, ${ads} )
    `;
    await sql`INSERT INTO notifications (type, title, message, priority, read, user_status, time)
      VALUES ('logs',${title} , ${message}, 'high', 'false', ${JSON.stringify(
      userData
    )}, ${created})`;
  } catch (error: any) {
    if (error) {
      console.log(error);
    }
  }
  revalidatePath("/dashboard/logs");
}

export async function updateLog(formData: FormData) {
  const logId = formData.get("logId") as string;
  const segments = formData.get("segments") as string;
  const guests = formData.get("guests") as string;
  const adverts = formData.get("adverts") as string;
  const ads = formData.get("ads") as string;
  const status = formData.get("status")
    ? (formData.get("status") as string)
    : "pending";

  // Saving to a database

  try {
    await sql`
       UPDATE logs SET segments=${segments}, guests=${guests}, adverts = ${adverts}, status=${status}, ads=${ads} WHERE id=${logId}
    `;
  } catch (error: any) {
    if (error) {
    }
    throw error;
  }
  revalidatePath("/dashboard/logs");
}

export async function deleteLog(id: string) {
  try {
    await sql`DELETE FROM logs WHERE id = ${id}`;
  } catch (error) {
    if (error) {
      return { success: false };
    }
  }
  revalidatePath("/dashboard/scheduling");
}

export async function createRequest(formData: FormData) {
  const type = formData.get("type") as string;
  const reason = formData.get("reason") as string;
  const startDate = formData.get("startDate") as string;
  const endtDate = formData.get("endDate") as string;
  const standIn = formData.get("standIn") as string;
  const staffId = formData.get("staffId") as string;
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;

  const created = new Date();
  if (type === "initial") {
    return { success: false, message: "Please select type of request!" };
  }

  const user = await fetchUserById(staffId);
  const message = `${user?.name} has madae a request!`;

  const userData: any = await fetchCommunicationUsers();
  // Saving to a database

  try {
    await sql`
      INSERT INTO requests (staff_id, type, reason, start_date, end_date, stand_in, created, status, notes
      )
      VALUES (${staffId}, ${type}, ${reason},  ${startDate}, ${endtDate}, ${standIn}, ${created}, ${
      status ?? "pending"
    }, ${notes ?? ""})
    `;
    await sql`INSERT INTO notifications (type, title, message, priority, read, user_status, time)
      VALUES ('requests','Request pending approval' , ${message}, 'high', 'false', ${JSON.stringify(
      userData
    )},${created})`;

    revalidatePath("/dashboard/requests");
    return { success: true, message: "Request added successfully" };
  } catch (error: any) {
    if (error) {
      console.log(error);
      return { success: false, message: "Some error occured" };
    }
  }
}

export async function updateRequest(formData: FormData) {
  const type = formData.get("type") as string;
  const reason = formData.get("reason") as string;
  const startDate = formData.get("startDate") as string;
  const endtDate = formData.get("endDate") as string;
  const standIn = formData.get("standIn") as string;
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;

  // Saving to a database

  try {
    await sql`
       UPDATE requests SET type=${type}, reason=${reason}, start_date = ${startDate}, end_date=${endtDate}, stand_in=${standIn}, status =${
      status ?? "pending"
    }, notes=${notes} WHERE id=${id}
    `;
    revalidatePath("/dashboard/requests");
    return { success: true, message: "Request updated successfully" };
  } catch (error: any) {
    if (error) {
      console.log(error);
    }

    return { success: false, message: "Some error occured" };
  }
}

export async function deleteRequest(id: string) {
  try {
    await sql`DELETE FROM requests WHERE id = ${id}`;
    revalidatePath("/dashboard/scheduling");
    return { success: true, message: "Request Deleted!" };
  } catch (error) {
    if (error) {
      return { success: false };
    }
  }
}

export async function createAdvert(formData: FormData) {
  const title = formData.get("title") as string;
  const status = formData.get("status") as string;
  const slot = formData.get("slot") as string;
  const shows = formData.get("shows") as string;

  const created = new Date();

  if (status === "initial") {
    return { success: false, message: "Please select advert status!" };
  }

  if (slot === "initial") {
    return { success: false, message: "Please select advert slot!" };
  }
  // Saving to a database

  try {
    await sql`
      INSERT INTO adverts (title, status, slot, shows, created)
      VALUES (${title}, ${status}, ${slot},  ${shows},${created})
    `;
    revalidatePath("/dashboard/market");
    return { success: true, message: "Advert added successfully" };
  } catch (error: any) {
    if (error) {
      console.log(error?.detail);
      return { success: false, message: "Some error occured" };
    }
  }
}

export async function updateAdvert(formData: FormData) {
  const title = formData.get("title") as string;
  const status = formData.get("status") as string;
  const slot = formData.get("slot") as string;
  const shows = formData.get("shows") as string;
  const id = formData.get("id") as string;

  if (status === "initial") {
    return { success: false, message: "Please select advert status!" };
  }

  if (slot === "initial") {
    return { success: false, message: "Please select advert slot!" };
  }
  // Saving to a database

  try {
    await sql`
      UPDATE adverts SET title =${title}, status =${status}, slot =${slot}, shows =${shows} 
      WHERE id=${id}
    `;
    revalidatePath("/dashboard/market");
    return { success: true, message: "Advert added successfully" };
  } catch (error: any) {
    if (error) {
      console.log(error?.detail);
      return { success: false, message: "Some error occured" };
    }
  }
}

export async function deleteAdvert(id: string) {
  try {
    await sql`DELETE FROM adverts WHERE id = ${id}`;
    revalidatePath("/dashboard/market");
    return { success: true, message: "Advert Deleted!" };
  } catch (error) {
    if (error) {
      return { success: false };
    }
  }
}

export async function createCommunication(formData: FormData) {
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const user_status = formData.get("user_status") as string;
  const userName = formData.get("userName") as string;
  const userId = formData.get("userId") as string;

  const created = new Date();
  const user = await fetchUserById(userId);
  const message = `${user?.name} has send new announcement`;

  // Saving to a database

  try {
    await sql`
      INSERT INTO communications (sender_id, sender_name, subject, content, user_status, created)
      VALUES (${userId}, ${userName}, ${subject}, ${content}, ${user_status}, ${created})
    `;

    await sql`INSERT INTO notifications (type, title, message, priority, read, user_status, time)
      VALUES ('communication','New announcement' , ${message}, 'medium', 'false', ${user_status}, ${created})`;

    revalidatePath("/dashboard/communications");
    return { success: true, message: "Message added successfully" };
  } catch (error: any) {
    if (error) {
      console.log(error);
      return { success: false, message: "Some error occured" };
    }
  }
}

export async function updateCommunication(formData: FormData) {
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  const id = formData.get("id") as string;
  // Saving to a database

  try {
    await sql` UPDATE communications SET subject =${subject}, content =${content} WHERE id=${id}
    `;
    revalidatePath("/dashboard/communications");
    return { success: true, message: "Message Updated successfully" };
  } catch (error: any) {
    if (error) {
      console.log(error?.detail);
      return { success: false, message: "Some error occured" };
    }
  }
}

export async function deleteCommunication(id: string) {
  try {
    await sql`DELETE FROM communications WHERE id = ${id}`;
    revalidatePath("/dashboard/communications");
    return { success: true, message: "Message Deleted!" };
  } catch (error) {
    if (error) {
      return { success: false };
    }
  }
}

export async function updateCommunicationStatus(id: string, userId: string) {
  const comsById = await fetchCommunicationById(id);
  const user_index = comsById?.findIndex((item: any) => item.id === userId);

  if (comsById[user_index].read === true) {
    return null;
  }

  const newObj = {
    id: comsById[user_index].id,
    name: comsById[user_index].name,
    read: true,
  };

  comsById[user_index] = newObj;

  const strComsById = JSON.stringify(comsById);

  try {
    await sql`UPDATE communications SET user_status = ${strComsById} WHERE id=${id}`;
    revalidatePath("/dashboard/communications");
  } catch (error) {
    console.log(error);
  }
}

export async function markNotificationRead(id: string, userId: string) {
  const notById = await fetchNoificationById(id);
  const userObj = JSON.parse(notById[0]?.user_status);
  const user_index = userObj?.findIndex((item: any) => item.id === userId);

  if (userObj[user_index].read === true) {
    return null;
  }

  const newObj = {
    id: userObj[user_index].id,
    name: userObj[user_index].name,
    read: true,
    deleted: userObj[user_index].deleted,
  };

  userObj[user_index] = newObj;

  const strNotById = JSON.stringify(userObj);

  try {
    await sql`UPDATE notifications SET user_status=${strNotById} WHERE id=${id}`;
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUserNotification(id: string, userId: string) {
  const notById = await fetchNoificationById(id);
  const userObj = JSON.parse(notById[0]?.user_status);
  const user_index = userObj?.findIndex((item: any) => item.id === userId);

  if (userObj[user_index].deleted === true) {
    return null;
  }

  const newObj = {
    id: userObj[user_index].id,
    name: userObj[user_index].name,
    read: true,
    deleted: true,
  };

  userObj[user_index] = newObj;

  const strNotById = JSON.stringify(userObj);

  try {
    await sql`UPDATE notifications SET user_status=${strNotById} WHERE id=${id}`;
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
}

export async function createAttendance(userId: string) {
  const clock_in_time = new Date();
  const clocked_in = true;
  const created = new Date();

  try {
    await sql`
      INSERT INTO attendance (staff, clock_in_time, clocked_in, created)
      VALUES (${userId}, ${clock_in_time}, ${clocked_in}, ${created})
    `;

    // await sql`INSERT INTO notifications (type, title, message, priority, read, user_status, time)
    //   VALUES ('A','New announcement' , ${message}, 'medium', 'false', ${user_status}, ${created})`;

    revalidatePath("/dashboard/attendance");
    return { success: true, message: "Clocked In!" };
  } catch (error: any) {
    if (error) {
      console.log(error);
      return { success: false, message: "Some error occured" };
    }
  }
}

export async function updateAttendance(id: string) {
  const clock_out_time = new Date();
  const clocked_out = true;

  if (id === "null") {
    return { success: false, message: "Some error occured" };
  }

  try {
    await sql`
      UPDATE attendance set clock_out_time = ${clock_out_time}, clocked_out = ${clocked_out}
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/attendance");
    return { success: true, message: "Clocked Out!" };
  } catch (error: any) {
    if (error) {
      console.log(error);
      return { success: false, message: "Some error occured" };
    }
  }
}
