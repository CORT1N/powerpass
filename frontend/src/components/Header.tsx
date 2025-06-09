import { useNavigate } from 'react-router-dom';

import Logo from './Logo';

import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="flex justify-between items-center w-full border-b border-gray-700/25 px-8">
            <div className="animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                <Logo size={80}/>
            </div>
            <div className='z-10 flex items-center gap-4'>
                {user && (
                    <button
                        onClick={handleLogout}
                        className="
                            bg-black/25
                            hover:bg-black/50
                            text-white
                            font-semibold
                            py-2
                            px-6
                            rounded
                            shadow-md
                            transition
                            duration-150
                            ease-in-out
                            transform
                            hover:scale-102
                            hover:shadow-lg
                            relative
                            overflow-hidden
                            before:absolute
                            before:-top-1
                            before:-left-1
                            before:w-full
                            before:h-full
                            before:rounded
                            before:bg-gradient-to-r
                            before:from-white/30
                            before:via-transparent
                            before:to-white/30
                            before:opacity-0
                            before:animate-glow
                            before:pointer-events-none
                        "
                        aria-label="Logout"
                    >
                        Se déconnecter
                    </button>
                )}
            </div>
        </header>
    );
}