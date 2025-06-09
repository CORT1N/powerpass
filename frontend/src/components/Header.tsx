import Logo from './Logo';

export default function Header() {
    return (
        <header className="border-b border-gray-700/25 px-8">
            <div className="animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                <Logo size={80}/>
            </div>
        </header>
    );
}