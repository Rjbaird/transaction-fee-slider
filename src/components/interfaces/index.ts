export interface Product {
    id: string;
    title: string;
    price: number;
}

export interface productStore {
    transactionFeePercent: number;
    transactionFeeConstant: number;
    products: Product[];
}
