
import "@ant-design/v5-patch-for-react-19";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function Home() {
  // Get the token from cookies
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  try {
    // Verify the token if it exists
    if (token) {
      await verifyToken(token);
      redirect("/dashboard/verification");
    } else {
      redirect("/login");
    }
  } catch (error) {
    // If token verification fails, redirect to login
    redirect("/login");
  }
}
