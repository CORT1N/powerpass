import { Plus } from "lucide-react";

export default function AddButton({ setShowAddModal }) {
    return (
        <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
            <Plus className="h-5 w-5" />
            <span>Nouveau</span>
        </button>
    );
}