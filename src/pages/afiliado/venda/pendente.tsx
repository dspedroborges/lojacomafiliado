import GoBack from "@/components/GoBack";
import Loading from "@/components/Loading";
import NoPermission from "@/components/NoPermission";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "react-query";

export default function VendasPendentesAfiliado() {
    const session = useSession();
    const username = session.data?.user?.name;

    const unpaidAffiliateSales = useQuery([`/api/payment/readByAffiliateNickname?nickname=${username}`], async () => {
        const response = await fetch(`/api/payment/readByAffiliateNickname?nickname=${username}`)
        return response.json()
    }, {
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
    });

    if (session.status !== "authenticated") {
        return <NoPermission />
    }

    return (
        <>
            <>
                <GoBack />
                {
                    unpaidAffiliateSales.isLoading && <Loading />
                }
                <h2 className="text-xl mb-4 text-center">Minhas vendas como afiliado</h2>
                <p className="text-center">Você está visualizando somente as vendas que ainda não lhe foram pagas.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
                    {
                        unpaidAffiliateSales.data && Array.isArray(unpaidAffiliateSales?.data) && unpaidAffiliateSales?.data?.map((sale: typeof unpaidAffiliateSales.data[0], i: number) => {
                            return (
                                <div key={i} className="border p-4 rounded-xl">
                                    <h3 className="text-xl mb-4 text-center">Venda #{i + 1}</h3>
                                    <p><span className="font-bold text-gray-600">Data:</span> {new Date(sale.createdAt).toLocaleDateString()}</p>
                                    <p><span className="font-bold text-gray-600">Última atualização:</span> {new Date(sale.updatedAt).toLocaleDateString()}</p>
                                    <h3 className="font-bold my-4 text-xl">Dados pessoais do comprador:</h3>
                                    <p><span className="font-bold text-gray-600">Nome:</span> {sale.name}</p>
                                    <h3 className="font-bold my-4 text-xl">Produtos e valores:</h3>
                                    <p><span className="font-bold text-gray-600">Produtos:</span> {sale.products.join(" e ")}</p>
                                    <p><span className="font-bold text-gray-600">Quantidades:</span> {sale.amounts.join(" e ")}</p>
                                    <p><span className="font-bold text-gray-600">Preços:</span> {sale.prices.join(" e ")}</p>
                                    <h3 className="font-bold my-4 text-xl">Envio:</h3>
                                    <p><span className="font-bold text-gray-600">Enviado:</span> {sale.sent ? "Sim" : "Não"}</p>
                                    <p><span className="font-bold text-gray-600">Código de rastreio:</span> {sale.trackingCode}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        </>
    )
}