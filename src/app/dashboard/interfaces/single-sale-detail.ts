import { ProductInterface } from "./product";

export interface SingleSaleDetailInterface {
    producto : ProductInterface,
    cantidad : number,
    precio   : number,
    total    : number
}