import { ProdutoDTO } from "./produto.dto";

export interface ItemPedidoData {
    desconto: number;
    quantidade: string;
    preco: number;
    produto: ProdutoDTO;
    subTotal: number;
}