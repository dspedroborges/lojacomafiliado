import Loading from "@/components/Loading";
import NoPermission from "@/components/NoPermission";
import Toast from "@/components/Toast";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { useMutation, useQuery } from "react-query";

function sumArray(array: number[]) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}

let solicitations: Record<string, any>[];
let arrayOfCalculatedComissions: number[];

export default function AfiliadoMenu() {
    const session = useSession();
    const username = session.data?.user?.name;

    const calculatedComissions = useQuery([`/api/solicitation/readByAffiliateNickname?nickname=${username}`], async () => {
        const response = await fetch(`/api/solicitation/readByAffiliateNickname?nickname=${username}`)
        return response.json()
    }, {
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
    });

    solicitations = Array.isArray(calculatedComissions?.data) ? calculatedComissions?.data[0] : [];
    arrayOfCalculatedComissions = (Array.isArray(calculatedComissions?.data) && calculatedComissions?.data.length > 1) ? calculatedComissions?.data[1] : [];

    console.log(arrayOfCalculatedComissions);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const mutateSolicitation: Record<string, any> = useMutation(async (data: Record<string, string>) => {
        setShowConfirmation(false);
        const response = await fetch("/api/solicitation/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        return response.json()
    });

    if (session.status !== "authenticated") {
        return <NoPermission/>
    }

    return (
        <div>
            {
                mutateSolicitation.isLoading && <Loading />
            }

            {
                (mutateSolicitation.isSuccess || mutateSolicitation.isError) && <Toast content={mutateSolicitation?.data?.content} error={mutateSolicitation?.data?.error} />
            }
            <h2 className="text-2xl text-center my-4">Menu do afiliado "{username}"</h2>
            <h3 className="text-2xl text-center my-4">Saldo: <span className="bg-green-600 text-white font-bold p-2 rounded-xl">R${sumArray(arrayOfCalculatedComissions).toFixed(2)}</span> </h3>
            <ul className="flex flex-col justify-center items-center">
                <li className="text-left my-2 bg-gray-100 p-2 rounded-xl hover:bg-gray-200"><BsCircleFill className="text-xs inline mr-2" /> <Link href="/afiliado/venda/pendente">Minhas vendas não-pagas</Link></li>
                <li className="text-left my-2 bg-gray-100 p-2 rounded-xl hover:bg-gray-200"><BsCircleFill className="text-xs inline mr-2" /> <Link href="/afiliado/solicitacao/historico">Histórico de solicitações</Link></li>
                <li className="text-left my-2 bg-gray-100 p-2 rounded-xl hover:bg-gray-200"><BsCircleFill className="text-xs inline mr-2" /> <Link href="/afiliado/solicitacao/pendente">Minhas solicitações pendentes</Link></li>
            </ul>
            {
                showConfirmation && (
                    <div className="fixed top-0 left-0 bg-gray-700 w-full h-screen bg-opacity-75 z-40">
                        <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col justify-center items-center bg-white py-8 px-2 rounded-xl border fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                            <p className="text-center text-red-600 font-bold">Tem certeza que deseja prosseguir com esta ação?</p>
                            <button onClick={() => mutateSolicitation.mutate({ nickname: username })} className="block mt-4 bg-red-600 p-2 rounded-xl text-center text-white font-bold hover:bg-red-700">Sim, tenho certeza!</button>
                            <button onClick={() => setShowConfirmation(false)} className="block mt-4 bg-gray-600 p-2 rounded-xl text-center text-white font-bold hover:bg-gray-700">Não.</button>
                        </div>
                    </div>
                )
            }
            <button onClick={() => setShowConfirmation(true)} className="z-10 block p-4 border rounded-xl text-center cursor-pointer w-1/3 mx-auto my-4 bg-gradient-to-tr from-green-600 to-green-800 text-white font-bold hover:opacity-95">Solicitar saque</button>
            <button onClick={() => signOut()} className="z-10 block p-4 border rounded-xl text-center cursor-pointer w-1/3 mx-auto my-4 bg-gradient-to-tr from-red-600 to-red-800 text-white font-bold hover:opacity-95">Sair</button>
        </div>
    )
}