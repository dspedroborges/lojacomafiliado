import { BsCartPlusFill } from "react-icons/bs";
import Toast from "./Toast";
import { useState } from "react";

const products = [
    {
        name: "Produto 1",
        price: "R$60,00",
        description: "Descrição do primeiro produto.",
        picture: "https://picsum.photos/id/200/200/300",
    },
    {
        name: "Produto 2",
        price: "R$100,00",
        description: "Descrição do segundo produto.",
        picture: "https://picsum.photos/id/201/200/300",
    }
]

export default function ProductGrid() {
    const [toastConfig, setToastConfig] = useState({
        content: "",
        error: false,
        show: false,
    });

    const addProductToCart = (product: Record<string, string | number>) => {
        product.amount = 1;

        let lsItems = localStorage.getItem("productsInCart");
        if (lsItems && lsItems.length > 0) {
            let productsInCart = JSON.parse(String(localStorage.getItem("productsInCart")));

            let isThereAlready = false;
            for (let i = 0; i < productsInCart.length; i++) {
                if (productsInCart[i].name == product.name) {
                    isThereAlready = true;
                    break;
                }
            }
            if (!isThereAlready) {
                productsInCart.push(product);
                localStorage.setItem("productsInCart", JSON.stringify(productsInCart));
                setToastConfig({ content: "Produto adicionado ao carrinho", error: false, show: true })
            } else {
                setToastConfig({ content: "Esse produto já está no carrinho.", error: true, show: true })
            }
        } else {
            localStorage.setItem("productsInCart", JSON.stringify([product]));
            setToastConfig({ content: "Produto adicionado ao carrinho", error: false, show: true })
        }
    }

    return (
        <>
            { toastConfig.show && <Toast content={toastConfig.content} error={toastConfig.error} /> }
            <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl text-center my-12">Produtos</h2>
            <div className="flex flex-col justify-between items-center md:flex-row md:justify-center md:items-center">
                {
                    products.map((product, i) => {
                        return (
                            <div key={i} className={i == 0 ? "md:mr-24 mb-12 md:mb-0" : ""}>
                                <div
                                    className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
                                >
                                    <img
                                        src={product.picture}
                                        loading="lazy"
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                                    />
                                </div>
                                <div>
                                    <a
                                        href="#"
                                        className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                                    >
                                        {product.name}
                                    </a>
                                    <span className="text-xs block text-gray-400 mb-4 font-light">{product.description}</span>
                                    <div className="flex items-end gap-2">
                                        <span className="font-bold text-gray-800 lg:text-lg">{product.price}</span>
                                    </div>
                                </div>
                                <button onClick={() => addProductToCart(JSON.parse(JSON.stringify(product)))} className="mt-8 font-bold text-xl text-black hover:text-gray-500"><BsCartPlusFill className="inline" /> Carrinho</button>
                            </div>
                        )
                    })
                }
            </div >
        </>
    )
}