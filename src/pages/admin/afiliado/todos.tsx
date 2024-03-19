import GoBack from "@/components/GoBack";
import Loading from "@/components/Loading";
import NoPermission from "@/components/NoPermission";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "react-query";

export default function TodosAfiliados() {
    const session = useSession();
    const allAffiliates = useQuery(["/api/affiliate/readAll"], async () => {
        const response = await fetch("/api/affiliate/readAll")
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
        <>
            <GoBack />
            {
                allAffiliates.isLoading && <Loading/>
            }
            <h2 className="text-xl mb-4 text-center">Afiliados registrados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
                {
                    allAffiliates?.data?.map((affiliate: typeof allAffiliates.data[0], i: number) => {
                        return (
                            <div key={i} className="border p-4 rounded-xl">
                                <h3 className="text-xl mb-4 text-center">Afiliado #{i + 1}</h3>
                                <p><span className="font-bold text-gray-600">Criado em:</span> { new Date(affiliate.createdAt).toLocaleDateString() }</p>
                                <p><span className="font-bold text-gray-600">Última atualização:</span> { new Date(affiliate.updatedAt).toLocaleDateString() }</p>
                                <p><span className="font-bold text-gray-600">Nome:</span> { affiliate.name }</p>
                                <p><span className="font-bold text-gray-600">Email:</span> { affiliate.email }</p>
                                <p><span className="font-bold text-gray-600">Telefone:</span> { affiliate.tel }</p>
                                <p><span className="font-bold text-gray-600">Pix:</span> { affiliate.pix }</p>
                                <p><span className="font-bold text-gray-600">Comissão:</span> { affiliate.comission }</p>
                                <Link href={`/admin/afiliado/editar/${affiliate.id}`} className="block mt-4 bg-blue-600 p-2 rounded-xl text-center text-white font-bold hover:bg-blue-700">Editar</Link>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}