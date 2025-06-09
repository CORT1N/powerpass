export default function Logo({ size = 40 }: { size?: number | string }) {
    return (
        <img
            src="/logo.png"
            alt="PowerPass logo"
            style={{ width: size, height: size }}
            className="object-contain"
        />
    )
}