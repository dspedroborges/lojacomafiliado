import GoBack from "@/components/GoBack";
import Loading from "@/components/Loading";
import NoPermission from "@/components/NoPermission";
import Toast from "@/components/Toast";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

let solicitations: Record<string, any>[];
let arrayOfCalculatedComissions: number[];

export default function TodosSolicitacoes() {
    const session = useSession();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [solicitationId, setSolicitationId] = useState<number>();
    const calculatedComissions = useQuery(["/api/solicitation/readAllPending"], async () => {
        const response = await fetch("/api/solicitation/readAllPending")
        return response.json()
    }, {
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
    });

    solicitations = Array.isArray(calculatedComissions?.data) ? calculatedComissions?.data[0] : [];
    arrayOfCalculatedComissions = (Array.isArray(calculatedComissions?.data) && calculatedComissions?.data.length > 1) ? calculatedComissions?.data[1] : [];

    const mutateWithdraw: Record<string, any> = useMutation(async (data: Record<string, string>) => {
        const response = await fetch("/api/solicitation/setAllPaid", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        return response.json()
    });

    const handleWithdraw = () => {
        setShowConfirmation(false);
        mutateWithdraw.mutate({ solicitationId });
    }

    const username = session.data?.user?.name;
    if (session.status !== "authenticated" || username != "admin") {
        return <NoPermission/>
    }

    return (
        <>
            <GoBack />
            {
                calculatedComissions.isLoading && <Loading />
            }
            {
                mutateWithdraw.isLoading && <Loading/>
            }

            {
                (mutateWithdraw.isSuccess || mutateWithdraw.isError) && <Toast content={mutateWithdraw?.data?.content} error={mutateWithdraw?.data?.error} />
            }
            <h2 className="text-xl mb-4 text-center">Solicitações pendentes</h2>
            <p className="text-center">Você está visualizando todas as solicitações pendentes. Esteja pronto para realizar o pagamento antes de definir alguma solicitação como paga.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
                {
                    solicitations?.map((solicitation: typeof solicitations[0], i: number) => {
                        return (
                            <div key={i} className="border p-4 rounded-xl">
                                <h3 className="text-xl mb-4 text-center">Solicitação #{i + 1}</h3>
                                <p><span className="font-bold text-gray-600">Nome:</span> {solicitation.affiliate.name}</p>
                                <p><span className="font-bold text-gray-600">Email:</span> {solicitation.affiliate.email}</p>
                                <p><span className="font-bold text-gray-600">Telefone:</span> {solicitation.affiliate.tel}</p>
                                <p><span className="font-bold text-gray-600">Pix:</span> {solicitation.affiliate.pix}</p>
                                <p><span className="font-bold text-gray-600">Pago:</span> {solicitation.paid ? "Sim" : "Não"}</p>
                                <p><span className="font-bold text-gray-600">Dívida pendente:</span> R${parseFloat(String(arrayOfCalculatedComissions[i])).toFixed(2)}</p>
                                <button onClick={() => {
                                    setSolicitationId(solicitation.id);
                                    setShowConfirmation(true);
                                }} className="block mt-4 bg-blue-600 p-2 rounded-xl text-center text-white font-bold hover:bg-blue-700">Definir como pago</button>
                            </div>
                        )
                    })
                }
            </div>

            {
                showConfirmation && (
                    <div className="fixed top-0 left-0 bg-gray-700 w-full h-screen bg-opacity-75">
                        <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col justify-center items-center bg-white py-8 px-2 rounded-xl border fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                            <p className="text-center text-red-600 font-bold">Ao definir como pago, o saldo da conta desse afiliado será zerado. Portanto, é importante que você realmente já tenha realizado o pagamento e enviado um comprovante ao email ou número deste afiliado. Tem certeza que deseja prosseguir com esta ação?</p>
                            <button onClick={() => handleWithdraw()} className="block mt-4 bg-red-600 p-2 rounded-xl text-center text-white font-bold hover:bg-red-700">Sim, tenho certeza!</button>
                            <button onClick={() => setShowConfirmation(false)} className="block mt-4 bg-gray-600 p-2 rounded-xl text-center text-white font-bold hover:bg-gray-700">Não.</button>
                        </div>
                    </div>
                )
            }
        </>
    )
}