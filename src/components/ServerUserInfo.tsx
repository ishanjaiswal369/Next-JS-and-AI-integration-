import { auth } from "@/app/api/auth/[...nextauth]/option";

export default async function ServerUserInfo() {
  const session = await auth();

  if (!session) {
    return <div>Not signed in (Server Component)</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Server User Info</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>User ID:</strong> {(session.user as any)?.id}</p>
      </div>
    </div>
  );
}
