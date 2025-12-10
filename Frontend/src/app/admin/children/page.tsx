import ChildForm from "src/components/ChildForm";
import ChildList from "src/components/ChildList";
import { FaUserFriends } from "react-icons/fa";
import Link from "next/link";

export default function AdminChildrenPage() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Administración de Niños</h1>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <FaUserFriends className="opacity-70" /> Ir a Talleres
        </Link>
      </div>
      <div className="bg-white border rounded-lg p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-4">
            <h2 className="font-medium mb-3">Registrar Nuevo Niño</h2>
            <ChildForm />
          </div>
          <div className="bg-white border rounded-lg p-4">
            <ChildList />
          </div>
        </div>
      </div>
    </section>
  );
}
