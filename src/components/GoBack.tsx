import Link from "next/link";
import { useRouter } from "next/router";
import { BsArrowLeftCircleFill } from "react-icons/bs";

export default function GoBack() {
    const router = useRouter();
    return (
        <button onClick={() => router.back()} className="text-xl text-left w-full block text-gray-500 px-4 mb-8"><BsArrowLeftCircleFill className="inline" /> Voltar</button>
    )
}