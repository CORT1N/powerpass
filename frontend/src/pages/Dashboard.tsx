import PasswordDashboard from "../components/PasswordDashboard";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Bienvenue dans PowerPass !</h2>
      <PasswordDashboard />
    </div>
  );
}