import { writeClipboard } from "@solid-primitives/clipboard";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { OcCode3, OcPlus3, OcTerminal3, OcX3 } from "solid-icons/oc";
import { batch, Component, createSignal, For, Show } from "solid-js";
import toast, { Toaster } from "solid-toast";
import type { Product } from "../interfaces";
import { createLocalStore, removeIndex } from "./utils";

const App: Component = () => {
    const [newFeePercent, setFeePercent] = createSignal(2.6);
    const [newFeeConstant, setFeeConstant] = createSignal(0.1);
    const [newTaxes, setTaxes] = createSignal(7.5);
    const [newProductTitle, setProductTitle] = createSignal("");
    const [products, setProducts] = createLocalStore<Product[]>("product", []);

    const addProduct = (e: SubmitEvent) => {
        e.preventDefault();
        batch(() => {
            setProducts(products.length, {
                id: nanoid(10),
                title: newProductTitle(),
                price: 9.99,
            });
            setProductTitle("");
        });
    };

    const mapProductsToJSON = () => {
        return products.map((product) => {
            return {
                id: product.id,
                title: product.title,
                price: product.price,
            };
        });
    };

    const logProducts = () => {
        const notify = () => toast.success("Products logged to console.");
        const mappedProducts = mapProductsToJSON();
        const stateJSON = {
            transactionFeePercent: newFeePercent(),
            transactionFeeConstant: newFeeConstant(),
            products: mappedProducts,
            date: dayjs().format("YYYY-MM-DD"),
        };
        console.log(stateJSON);
        return notify();
    };

    const copyToJSON = () => {
        const notify = () => toast.success("JSON copied to clipboard.");
        writeClipboard(JSON.stringify(mapProductsToJSON()));
        return notify();
    };

    return (
        <div class="grid justify-items-center min-w-full">
            <div class="grid grid-cols-8 w-full pt-4">
                <fieldset class="col-span-7">
                    <legend class="text-sm">Transaction Fee %</legend>
                    <label for="percent-range" class="sr-only">
                        Transaction Fee Percent
                    </label>
                    <input
                        id="percent-range"
                        type="range"
                        min={0.1}
                        max={5.0}
                        value={newFeePercent()}
                        onInput={(e) =>
                            setFeePercent(parseFloat(e.currentTarget.value))
                        }
                        step="0.1"
                        class=" w-full h-1 bg-gray-200 rounded-lg accent-indigo-500 cursor-pointer range-lg self-center"
                    />
                </fieldset>
                <output class="text-lg grid place-content-end justify-self-start pl-2 tabular-nums">
                    {newFeePercent().toFixed(2)}%
                </output>
            </div>
            <div class="grid grid-cols-8 w-full pt-4">
                <fieldset class="col-span-7">
                    <legend class="text-sm">Transaction Fee &cent;</legend>
                    <label for="constant-range" class="sr-only">
                        Transaction Fee Constant
                    </label>
                    <input
                        id="constant-range"
                        type="range"
                        min={0}
                        max={0.5}
                        value={newFeeConstant()}
                        onInput={(e) =>
                            setFeeConstant(parseFloat(e.currentTarget.value))
                        }
                        step="0.01"
                        class=" w-full h-1 bg-gray-200 rounded-lg accent-pink-500 cursor-pointer range-lg self-center"
                    />
                </fieldset>
                <output class="text-lg grid place-content-end justify-self-start pl-2 tabular-nums">
                    {newFeeConstant().toFixed(2)}&cent;
                </output>
            </div>
            <div class="grid grid-cols-8 w-full pt-4">
                <fieldset class="col-span-7">
                    <legend class="text-sm">Taxes %</legend>
                    <label for="constant-range" class="sr-only">
                        Taxes
                    </label>
                    <input
                        id="constant-range"
                        type="range"
                        min={0}
                        max={16}
                        value={newTaxes()}
                        onInput={(e) =>
                            setTaxes(parseFloat(e.currentTarget.value))
                        }
                        step="0.01"
                        class=" w-full h-1 bg-gray-200 rounded-lg accent-purple-500 cursor-pointer range-lg self-center"
                    />
                </fieldset>
                <output class="text-lg grid place-content-end justify-self-start pl-2 tabular-nums">
                    {newTaxes().toFixed(2)}%
                </output>
            </div>
            <div class="w-full py-4">
                <div class="grid grid-cols-12 col-span-1 pb-2">
                    <p class="text-xl text-slate-800 underline font-extrabold col-span-4">
                        Products
                    </p>
                    <p class="text-xl text-slate-800 underline font-extrabold col-span-3">
                        Price
                    </p>
                    <p class="text-xl text-slate-800 underline font-extrabold">
                        Profit
                    </p>
                </div>
                <For each={products}>
                    {(product, i) => (
                        <div class="grid grid-cols-12 col-span-1">
                            <label for="title" class="sr-only">
                                Product Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={product.title}
                                maxlength="14"
                                onChange={(e) =>
                                    setProducts(
                                        i(),
                                        "title",
                                        e.currentTarget.value
                                    )
                                }
                                class="col-span-4"
                            />
                            <div class="col-span-3 pl-2">
                                <label for="price" class=" sr-only">
                                    Product Price
                                </label>
                                <div class="flex flex-row">
                                    <span class="text-gray-500 sm:text-sm">
                                        $
                                    </span>
                                    <input
                                        name="price"
                                        id="price"
                                        aria-describedby="price-currency"
                                        type="number"
                                        min={1}
                                        max={1000}
                                        step="0.01"
                                        value={product.price}
                                        placeholder="1,000,000.00"
                                        class="w-full border-none tabular-nums"
                                        onChange={(e) =>
                                            setProducts(
                                                i(),
                                                "price",
                                                parseFloat(
                                                    e.currentTarget.value
                                                )
                                            )
                                        }
                                    />
                                    <Show
                                        when={newTaxes() > 0}
                                        fallback={
                                            <p class="w-1/3 justify-end pt-2 font-thin text-gray-400 text-xs tabular-nums">
                                                ${0.0}
                                            </p>
                                        }
                                    >
                                        <span class="w-3/8 justify-end pt-2 font-thin text-gray-400 text-xs tabular-nums">
                                            +$
                                            {(
                                                (product.price * newTaxes()) /
                                                100
                                            ).toFixed(2)}
                                        </span>
                                    </Show>
                                </div>
                            </div>
                            <div class="col-span-3 pl-2">
                                <label for="price" class=" sr-only">
                                    Product Profit
                                </label>
                                <div class="flex flex-row">
                                    <span class="text-gray-500 sm:text-sm">
                                        $
                                    </span>
                                    <Show
                                        when={product.price}
                                        fallback={
                                            <p class="col-span-3 font-bold">
                                                ---
                                            </p>
                                        }
                                    >
                                        <p class="col-span-3 tabular-nums">
                                            {(
                                                product.price +
                                                product.price *
                                                    (newTaxes() / 100) -
                                                (product.price +
                                                    product.price *
                                                        (newTaxes() / 100)) *
                                                    (newFeePercent() / 100) -
                                                newFeeConstant()
                                            ).toFixed(2)}
                                        </p>
                                    </Show>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const notify = () =>
                                        toast.success(
                                            `${product.title} removed.`
                                        );
                                    setProducts((t) => removeIndex(t, i()));
                                    notify();
                                }}
                                class="col-span-2 inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 w-2/3"
                            >
                                <span>Remove</span>
                                <OcX3 class="hidden md:block" />
                            </button>
                        </div>
                    )}
                </For>
                <form onSubmit={addProduct} class="grid grid-cols-12 w-full">
                    <input
                        placeholder="Product Title"
                        required
                        maxlength="24"
                        value={newProductTitle()}
                        onInput={(e) => setProductTitle(e.currentTarget.value)}
                        class="col-span-4 placeholder:text-gray-400"
                    />
                    <button
                        onClick={() => {
                            if (newProductTitle() === "") return;
                            const notify = () =>
                                toast.success(`${newProductTitle()} added.`);
                            notify();
                        }}
                        class="col-span-2 inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                    >
                        <OcPlus3 />
                        <span>Add Product</span>
                    </button>
                </form>
                <div class="relative">
                    <div
                        class="absolute inset-0 flex items-center"
                        aria-hidden="true"
                    >
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center py-4">
                        <span class="isolate inline-flex -space-x-px">
                            <button
                                type="button"
                                onClick={() => logProducts()}
                                class="relative inline-flex items-center bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <OcTerminal3 />
                                <span class="pl-3">Console Log</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => copyToJSON()}
                                class="relative inline-flex items-center bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <OcCode3 />
                                <span class="pl-3">Copy JSON</span>
                            </button>
                            <Toaster />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
