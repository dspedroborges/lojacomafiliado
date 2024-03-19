import GoBack from "@/components/GoBack";
import Loading from "@/components/Loading";
import NoPermission from "@/components/NoPermission";
import Toast from "@/components/Toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";

export default function Rastreio() {
    const session = useSession();
    const [trackingCode, setTrackingCode] = useState("");
    const router = useRouter();
    const saleId = router.query.id;

    const mutateTrackingCode = useMutation(async (data: Record<string, string>) => {
        const response = await fetch(`/api/payment/addTrackingCode?id=${saleId}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
    
        return response.json()
      })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutateTrackingCode.mutate({ trackingCode });
    }

    const username = session.data?.user?.name;
    if (session.status !== "authenticated" || username != "admin") {
        return <NoPermission/>
    }

    return (
        <div>
            <GoBack />
            {
                mutateTrackingCode.isLoading && <Loading/>
            }

            {
                (mutateTrackingCode.isSuccess || mutateTrackingCode.isError) && <Toast content={mutateTrackingCode?.data?.content} error={mutateTrackingCode?.data?.error} />
            }
            <h2 className="text-xl mb-4 text-center">Definir código de rastreio</h2>
            <p className="text-center mb-4">Você está definindo o código de rastreio para a venda de id <span className="text-gray-500 text-xs">{saleId}</span> </p>
            <form onSubmit={(e) => handleSubmit(e)} className="mx-auto border p-4 rounded-xl w-1/2 flex flex-col">
                <label htmlFor="trackingCode" className="font-bold my-2">Código de rastreio: <span className="text-xs text-red-500">*</span></label>
                <input required={true} type="text" id="trackingCode" className="p-2 border rounded-md" onChange={(e) => setTrackingCode(e.target.value)} />
                <button className="p-4 border rounded-xl text-center cursor-pointer w-1/3 mx-auto my-4 bg-gradient-to-tr from-slate-600 to-black text-white font-bold hover:opacity-95">Enviar</button>
            </form>
        </div>
    )
}