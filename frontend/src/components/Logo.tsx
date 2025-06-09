export default function Logo({ size = 10 }: { size?: number }) {
    return (
        <img
            src="/logo.png"
            alt="PowerPass logo"
            className={`h-${size} w-${size} object-contain`}
        />
    )
}