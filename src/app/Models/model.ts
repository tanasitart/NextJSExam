export interface productModel {
    id: number;
    product_name: string;
    description?: string;
    price: number;
    stock_remain: number;
    modified_date: Date;
    remark? : string;
}

