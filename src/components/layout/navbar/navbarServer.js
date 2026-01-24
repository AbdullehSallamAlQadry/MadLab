import NavbarClient from "./navbarClient";
import { getAuthToken } from "@/lib/authToken";

export default async function Navbar() {
  const [doctor, accessToken] = await getAuthToken();
  return <NavbarClient doctor={doctor} />;
}
