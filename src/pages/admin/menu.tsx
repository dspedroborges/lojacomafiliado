import NoPermission from "@/components/NoPermission";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsCircleFill } from "react-icons/bs";
import { useQuery } from "react-query";

export default function AdminMenu() {
    const session = useSession();

    const solicitationsCount = useQuery(["/api/solicitation/count"], async () => {
        const response = await fetch("/api/solicitation/count")
        return response.json()
    }, {
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
    });

    const unsetSalesCount = useQuery(["/api/payment/unsentCount"], async () => {
        const response = await fetch("/api/payment/unsentCount")
        return response.json()
    }, {
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
    });

    const username = session.data?.user?.name;
    if (session.status !== "authenticated" || username != "admin") {
        return <NoPermission/>
    }

    return (
        <div>
            <h2 className="text-2xl text-center my-4">Menu do admin</h2>
            <ul className="flex flex-col justify-center items-center">
                <li className="text-left my-2 bg-gray-100 p-2 rounded-xl hover:bg-gray-200"><BsCircleFill className="text-xs inline mr-2" />
                    <Link href="/admin/venda/nao-enviado">
                        Vendas não enviadas
                        <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 ${unsetSalesCount?.data > 0 ? "bg-red-600 animate-bounce" : "bg-green-600"} text-white ml-2`}>{unsetSalesCount?.data}</span>
                    </Link>
                </li>
                <li className="text-left my-2 bg-gray-100 p-2 rounded-xl hover:bg-gray-200"><BsCircleFill className="text-xs inline mr-2" /> <Link href="/admin/venda/enviado">Vendas enviadas</Link></li>
                <li className="text-left my-2 bg-gray-100 p-2 rounded-xl hover:bg-gray-200"><BsCircleFill className="text-xs inline mr-2" /> <Link href="/admin/afiliado/criar">Criar afiliado</Link></li>
                <li className="text-left my-2 bg-gray-100 p-2 rounded-xl hover:bg-gray-200"><BsCircleFill className="text-xs inline mr-2" /> <Link href="/admin/afiliado/todos">Ver afiliados</Link></li>
                <li className="text-left my-2 bg-gray-100 p-2 rounded-xl hover:bg-gray-200"><BsCircleFill className="text-xs inline mr-2" />
                    <Link href="/admin/afiliado/solicitacao/todos">
                        Solicitações de saque
                        <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 ${solicitationsCount?.data > 0 ? "bg-red-600 animate-bounce" : "bg-green-600"} text-white ml-2`}>{solicitationsCount?.data}</span>
                    </Link>
                </li>
            </ul>
            <button onClick={() => signOut()} className="block p-4 border rounded-xl text-center cursor-pointer w-1/3 mx-auto my-4 bg-gradient-to-tr from-red-600 to-red-800 text-white font-bold hover:opacity-95">Sair</button>
        </div>
    )
}