import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";

export const metadata = {
  title: "My Profile | Healthcare Appointment App",
  description: "Your account details and appointment summary.",
};

// This page is also covered by the auth middleware; the session
// check here is a second layer so the page never renders for guests.
export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        My Profile
      </h1>
      <p className="mt-2 text-slate-600">
        Your account information is shown below.
      </p>

      <div className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-500">Name</p>
          <p className="text-lg font-semibold text-slate-900">{user.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Email</p>
          <p className="text-lg font-semibold text-slate-900">{user.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Account type</p>
          <p className="text-lg font-semibold capitalize text-slate-900">
            {user.role?.toLowerCase()}
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Your appointments will appear here once booking is connected.
      </p>
    </section>
  );
}
