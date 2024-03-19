import { useEffect, useState } from "react";

export default function Toast({ content, error }: { content: string, error: boolean }) {
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        setShowToast(true);
        const timeout = setTimeout(() => {
            setShowToast(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [content, error]);

    if (showToast) {
        return (
            <div className={`fixed top-8 right-2 -translate-x-1/2 w-[200px] md:w-[300px] z-50 lg:w-[400px] p-2 rounded-xl text-center text-white font-bold flex items-center justify-center ${error ? "bg-red-600" : "bg-green-600"} animate-bounce`}>
                {content}
            </div>
        )
    }
}