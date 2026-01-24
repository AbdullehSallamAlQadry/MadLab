import { getSessionData } from "@/lib/session";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getSessionData();

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("intentional delay");
    }, 5000);
  })

  return (
    <main className="w-full bg-bg-second p-7  flex flex-col justify-start">
      <header className="mb-10 border-b border-border-color pb-6">
        <h1 className="text-4xl font-bold mb-2">Doctor Profile</h1>
      </header>
      <ProfileForm doctor={session?.doctor} />
    </main>
  );
}