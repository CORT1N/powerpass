import { AlertCircle } from "lucide-react";

export default function ErrorDisplay({ error, setError }) {
    return (
        <>
        {error && (
        <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 animate-fade-in-up">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
            <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
            >
            ×
            </button>
        </div>
        )}
        </>
    );
}