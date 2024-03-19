import GoBack from "@/components/GoBack";
import Loading from "@/components/Loading";
import NoPermission from "@/components/NoPermission";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "react-query";

export default function VendasEnviadas() {
    const session = useSession();
    const sentSales = useQuery(["/api/payment/readSent"], async () => {
        const response = await fetch("/api/payment/readSent")
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
                sentSales.isLoading && <Loading />
            }
            <h2 className="text-xl mb-4 text-center">Vendas já enviadas</h2>
            <p className="text-center">Você está visualizando as vendas que já foram processadas.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
                {
                    sentSales?.data?.map((sale: typeof sentSales.data[0], i: number) => {
                        return (
                            <div key={i} className="border p-4 rounded-xl">
                                <h3 className="text-xl mb-4 text-center">Venda #{i + 1}</h3>
                                <p><span className="font-bold text-gray-600">Data:</span> {new Date(sale.createdAt).toLocaleDateString()}</p>
                                <p><span className="font-bold text-gray-600">Última atualização:</span> {new Date(sale.updatedAt).toLocaleDateString()}</p>
                                <h3 className="font-bold my-4 text-xl">Dados pessoais do comprador:</h3>
                                <p><span className="font-bold text-gray-600">Nome:</span> {sale.name}</p>
                                <p><span className="font-bold text-gray-600">Email:</span> {sale.email}</p>
                                <p><span className="font-bold text-gray-600">Tel:</span> {sale.tel}</p>
                                <p><span className="font-bold text-gray-600">CPF:</span> {sale.cpf}</p>
                                <h3 className="font-bold my-4 text-xl">Produtos e valores:</h3>
                                <p><span className="font-bold text-gray-600">Produtos:</span> {sale.products.join(" e ")}</p>
                                <p><span className="font-bold text-gray-600">Quantidades:</span> {sale.amounts.join(" e ")}</p>
                                <p><span className="font-bold text-gray-600">Preços:</span> {sale.prices.join(" e ")}</p>
                                <h3 className="font-bold my-4 text-xl">Dados para entrega:</h3>
                                <p><span className="font-bold text-gray-600">Estado:</span> {sale.state}</p>
                                <p><span className="font-bold text-gray-600">Cidade/Município:</span> {sale.city}</p>
                                <p><span className="font-bold text-gray-600">Bairro:</span> {sale.neighborhood}</p>
                                <p><span className="font-bold text-gray-600">Endereço:</span> {sale.address}</p>
                                <p><span className="font-bold text-gray-600">Número:</span> {sale.number}</p>
                                <p><span className="font-bold text-gray-600">Complemento:</span> {sale.complement}</p>
                                <h3 className="font-bold my-4 text-xl">Envio:</h3>
                                <p><span className="font-bold text-gray-600">Enviado:</span> {sale.sent ? "Sim" : "Não"}</p>
                                <p><span className="font-bold text-gray-600">Código de rastreio:</span> {sale.trackingCode} <Link href={`/admin/venda/rastreio/${sale.id}`} className="block mt-4 bg-blue-600 p-2 rounded-xl text-center text-white font-bold hover:bg-blue-700">Atualizar código de rastreio</Link></p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}