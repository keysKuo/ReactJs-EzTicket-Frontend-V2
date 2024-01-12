export default function Input({ ...props }) {
    return (
        <input
            {...props}
            className="w-full h-[2.4rem] px-3 outline-none focus:ring-0 border border-gray-200 text-sm"
        />
    );
}
