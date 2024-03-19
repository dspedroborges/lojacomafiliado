import Loading from "@/components/Loading";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { BsLink45Deg } from "react-icons/bs";
import { useQuery } from "react-query";

export default function Rastreio() {
    const [cpf, setCpf] = useState("");
    const [formCpf, setFormCpf] = useState("");
    const [showResult, setShowResult] = useState(false);

    const trackingSale = useQuery(["/api/payment/readByCpf", cpf], async () => {
        const response = await fetch(`/api/payment/readByCpf?cpf=${cpf}`)
        return response.json()
    }, {
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setShowResult(true)
        setCpf(formCpf);
    }

    return (
        <>
            <div>
                {
                    trackingSale.isLoading && <Loading />
                }
                <h2 className="text-xl mb-4 text-center">Rastrear pedido</h2>
                <p className="text-center mb-4">Se você realizou uma compra conosco, informe seu CPF no campo abaixo para rastrear seus pedidos.</p>
                <form onSubmit={(e) => handleSubmit(e)} className="mx-auto border p-4 rounded-xl w-full lg:w-1/2 flex flex-col">
                    <label htmlFor="cpf" className="font-bold my-2">CPF: <span className="text-xs text-red-500">*</span></label>
                    <input required={true} type="text" id="cpf" className="p-2 border rounded-md" onChange={(e) => setFormCpf(e.target.value)} />
                    <button className="p-4 border rounded-xl text-center cursor-pointer w-1/3 mx-auto my-4 bg-gradient-to-tr from-slate-600 to-black text-white font-bold hover:opacity-95">Buscar</button>
                </form>
            </div>

            {
                showResult && (
                    <>
                        <h2 className="text-xl mt-8 mb-4 text-center">Resultado</h2>
                        {
                            trackingSale?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
                                    {
                                        trackingSale?.data?.map((sale: typeof trackingSale.data[0], i: number) => {
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
                                                    <p><span className="font-bold text-gray-600">Produtos:</span> {sale.products}</p>
                                                    <p><span className="font-bold text-gray-600">Quantidades:</span> {sale.amounts}</p>
                                                    <p><span className="font-bold text-gray-600">Preços:</span> {sale.prices}</p>
                                                    <h3 className="font-bold my-4 text-xl">Dados para entrega:</h3>
                                                    <p><span className="font-bold text-gray-600">Estado:</span> {sale.state}</p>
                                                    <p><span className="font-bold text-gray-600">Cidade/Município:</span> {sale.city}</p>
                                                    <p><span className="font-bold text-gray-600">Bairro:</span> {sale.neighborhood}</p>
                                                    <p><span className="font-bold text-gray-600">Endereço:</span> {sale.address}</p>
                                                    <p><span className="font-bold text-gray-600">Número:</span> {sale.number}</p>
                                                    <p><span className="font-bold text-gray-600">Complemento:</span> {sale.complement}</p>
                                                    <h3 className="font-bold my-4 text-xl">Envio:</h3>
                                                    <p><span className="font-bold text-gray-600">Enviado:</span> {sale.sent ? "Sim" : "Não"}</p>
                                                    <Link className="text-blue-600" href="https://rastreamento.correios.com.br/app/index.php" target="_blank"><p><span className="font-bold">Código de rastreio:</span> {sale.trackingCode} <BsLink45Deg className="inline"/></p></Link>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <div className="text-center">Nenhum resultado encontrado.</div>
                            )
                        }
                    </>
                )
            }

        </>
    )
}