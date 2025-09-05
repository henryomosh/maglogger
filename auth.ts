import bcrypt from "bcryptjs";

export async function userAuth(
  email: string,
  password1: string,
  password2: string
) {
  if (!email) {
    return false;
  }

  const passwordMatch = await bcrypt.compare(password1, password2);

  if (passwordMatch) {
    return true;
  }
  return false;
}
