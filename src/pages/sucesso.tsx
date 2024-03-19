import Loading from "@/components/Loading";
import Toast from "@/components/Toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function Sucesso() {
    const router = useRouter();
    const key = router.query.key;
    const confirmPayment = useQuery([`/api/payment/confirmPayment?key=${key}`], async () => {
        const response = await fetch(`/api/payment/confirmPayment?key=${key}`)
        return response.json()
    }, {
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
    });

    return (
        <>
            {
                confirmPayment.isLoading && <Loading/>
            }
            {
                confirmPayment.isSuccess && <Toast error={confirmPayment.data.error} content={confirmPayment.data.content}/>
            }
            <div className="text-center border p-8 rounded-xl m-4">
                <h2 className="text-2xl font-extrabold">Obrigado por comprar conosco!</h2>

                <p className="mb-8 mt-4">Você pode acompanhar o seu pedido por meio da página de rastreio. Ou, se preferir, basta clicar <Link href={"/rastreio"} className="font-bold">aqui</Link>.</p>

                <img src="https://picsum.photos/id/237/200/300" className="mx-auto rounded-xl" />
            </div>
        </>
    )
}