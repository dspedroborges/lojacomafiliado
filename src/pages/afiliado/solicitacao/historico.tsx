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

export default function MinhasSolicitacoes() {
    const session = useSession();
    const username = session.data?.user?.name;
    
    const solicitationsHistory = useQuery([`/api/solicitation/readAllSolicitationsByAffiliateNickname?nickname=${username}`], async () => {
        const response = await fetch(`/api/solicitation/readAllSolicitationsByAffiliateNickname?nickname=${username}`)
        return response.json()
    }, {
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
    });

    if (session.status !== "authenticated") {
        return <NoPermission/>
    }

    return (
        <>
            <GoBack />
            {
                solicitationsHistory.isLoading && <Loading />
            }

            <h2 className="text-xl mb-4 text-center">Histórico de solicitações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
                {
                    solicitationsHistory?.data?.map((solicitation: typeof solicitations[0], i: number) => {
                        return (
                            <div key={i} className="border p-4 rounded-xl">
                                <h3 className="text-xl mb-4 text-center">Solicitação #{i + 1}</h3>
                                <p><span className="font-bold text-gray-600">Realizada em:</span> {new Date(solicitation.createdAt).toLocaleDateString()}</p>
                                <p><span className="font-bold text-gray-600">Valor:</span> R${parseFloat(solicitation.comission).toFixed(2)}</p>
                                <p><span className="font-bold text-gray-600">Pago:</span> {solicitation.paid ? "Sim" : "Não"}</p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}