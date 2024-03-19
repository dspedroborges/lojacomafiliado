import Link from "next/link";
import { useEffect, useState } from "react";
import { BsCartCheckFill, BsX } from "react-icons/bs";
import { useRouter } from 'next/router'

type ProductType = {
    name: string;
    price: string;
    description: string;
    picture: string;
    amount: number;
}

export default function Menu() {
    const [productsInCart, setProductsInCart] = useState<ProductType[]>([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [currentLink, setCurrentLink] = useState("/dados");
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            if (localStorage.getItem("productsInCart") && localStorage.getItem("productsInCart") !== JSON.stringify(productsInCart)) {
                setProductsInCart(JSON.parse(String(localStorage.getItem("productsInCart"))));
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        createLink();
    }, [productsInCart]);

    const increaseAmount = (productName: string) => {
        let copy = JSON.parse(JSON.stringify(productsInCart));
        for (let i = 0; i < copy.length; i++) {
            if (copy[i].name === productName) {
                copy[i].amount++;
                break;
            }
        }

        setProductsInCart(copy);
        localStorage.setItem("productsInCart", JSON.stringify(copy));
    }

    const decreaseAmount = (productName: string) => {
        let copy = JSON.parse(JSON.stringify(productsInCart));
        let index = -1;
        for (let i = 0; i < copy.length; i++) {
            if (copy[i].name === productName) {
                copy[i].amount--;
                if (copy[i].amount <= 0) {
                    index = i;
                }
                break;
            }
        }

        if (index !== -1) {
            copy.splice(index, 1);
        }

        setProductsInCart(copy);
        localStorage.setItem("productsInCart", JSON.stringify(copy));
    }

    const createLink = () => {
        let products = [];
        let amounts = [];
        for (let i = 0; i < productsInCart.length; i++) {
            products.push(productsInCart[i].name);
            amounts.push(productsInCart[i].amount);
        }

        setCurrentLink(`/dados?products=${products.join(',')}&amounts=${amounts.join(',')}`);
    }

    return (
        <header className="mb-8 flex items-center justify-between px-4 py-4 md:mb-12 md:py-8 xl:mb-16 bg-black">

            <div className={`overflow-scroll h-screen w-full md:w-1/2 bg-black p-4 fixed top-0 right-0 z-40 ${showSidebar ? "translate-x-0" : "translate-x-full"} transition-transform`}>
                <BsX className="text-white absolute top-2 right-2 text-4xl cursor-pointer hover:scale-105 hover:rotate-180 transition-all" onClick={() => setShowSidebar(false)} />
                <h2 className="text-white text-2xl text-center font-bold mt-8">Carrinho de compras</h2>
                {
                    productsInCart.map((product, i) => {
                        return (
                            <div key={i} className="text-white border my-4 p-2 rounded-xl flex flex-col justify-center items-center xl:flex-row xl:justify-around xl:items-center">
                                <img onClick={() => setShowMenu(false)} src={product.picture} alt={product.name} className="rounded-xl hover:scale-105 w-1/5" />
                                <div className="flex flex-col justify-center items-center">
                                    <h3 className="font-bold my-2">{product.name}</h3>
                                    <p className="font-light text-center my-4">{product.description}</p>
                                    <div>
                                        <p><span className="font-extrabold">Quantidade</span>: {product.amount}</p>
                                        <div className="flex gap-2 mt-4 justify-center">
                                            <div onClick={() => decreaseAmount(product.name)} className="h-8 w-8 bg-white text-black p-2 rounded-full flex justify-center items-center text-xl font-bold hover:scale-105 cursor-pointer">-</div>
                                            <div onClick={() => increaseAmount(product.name)} className="h-8 w-8 bg-white text-black p-2 rounded-full flex justify-center items-center text-xl font-bold hover:scale-105 cursor-pointer">+</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

                {
                    productsInCart.length > 0 ? (
                        <Link onClick={() => setShowSidebar(false)} href={currentLink} className="text-2xl text-black text-center font-bold mx-auto block bg-blue-200 p-4 rounded-xl hover:bg-blue-300">Prosseguir com a compra</Link>
                    ) : (
                        <p className="text-white text-center mt-8">Seu carrinho está vazio.</p>
                    )
                }
            </div>

            {/* logo - start */}
            <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-2xl font-bold text-black md:text-3xl"
                aria-label="logo"
            >
                <img src="/logo.png" width={100} height={100} alt="Logo" />
                Loja Afiliado
            </Link>
            {/* logo - end */}
            {/* nav - start */}
            <nav className={`${showMenu ? "flex flex-col z-30 fixed top-0 left-0 h-screen w-full bg-black items-center justify-center" : "hidden"} lg:flex gap-12`}>
                <BsX className="lg:hidden text-white absolute top-2 right-2 text-4xl cursor-pointer hover:scale-105 hover:rotate-180 transition-all" onClick={() => setShowMenu(false)} />
                <Link onClick={() => setShowMenu(false)} href="/" className={`text-lg font-semibold ${(router.pathname == '/' || router.pathname.search("afiliado") !== -1) ? "text-blue-500" : "text-gray-600 hover:text-blue-500 transition duration-100"}`}>
                    Home
                </Link>
                <Link
                    onClick={() => setShowMenu(false)}
                    href="/sobre"
                    className={`text-lg font-semibold ${router.pathname == '/sobre' ? "text-blue-500" : "text-gray-600 hover:text-blue-500 transition duration-100"}`}
                >
                    Sobre
                </Link>
                <Link
                    onClick={() => setShowMenu(false)}
                    href="/rastreio"
                    className={`text-lg font-semibold ${router.pathname == '/rastreio' ? "text-blue-500" : "text-gray-600 hover:text-blue-500 transition duration-100"}`}
                >
                    Rastrear pedido
                </Link>
            </nav>
            {/* nav - end */}
            {/* buttons - start */}
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="fixed bottom-2 left-2 lg:relative rounded-lg bg-blue-200 px-4 z-40 lg:z-auto py-3 text-center text-sm font-semibold text-gray-950 outline-none ring-yellow-300 transition duration-100 hover:bg-blue-300 focus-visible:ring active:text-gray-700 md:text-base lg:inline-block mr-2"
            >
                <BsCartCheckFill className="text-2xl inline mr-2"/>
                <span className="hidden lg:inline">Carrinho</span>
                <span className={`inline-flex items-center justify-center rounded-full w-4 h-4 lg:w-6 lg:h-6 ${productsInCart.length > 0 ? "bg-green-600 animate-bounce" : "bg-red-600"} text-white lg:ml-2`}>{productsInCart.length}</span>
            </button>
            <button
                onClick={() => setShowMenu(!showMenu)}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-200 px-2.5 py-2 text-sm font-semibold text-gray-950 ring-yellow-300 hover:bg-blue-300 focus-visible:ring active:text-gray-700 md:text-base lg:hidden"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                Menu
            </button>
            {/* buttons - end */}
        </header>

    )
}