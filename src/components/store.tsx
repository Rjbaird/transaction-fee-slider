import { createStore } from "solid-js/store";

export interface Product {
    id: number;
    title: string;
    price: number;
}

export interface ProductStore {
    transactionFee: number;
    products: Product[];
}

export default createStore<ProductStore>({
    transactionFee: 2.5,
    products: [],
});
