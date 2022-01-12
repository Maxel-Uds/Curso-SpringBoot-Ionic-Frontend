import { ClienteDTO } from "./cliente.dto";
import { EnderecoDTO } from "./endereco.dto";
import { ItemPedidoData } from "./item-pedido-data.dto";
import { PagamentoDTO } from "./pagamento.dto";

export interface ReceivePedido {
    id: string;
    instante: string;
    dadosDoCliente: ClienteDTO;
    enderecoDeEntrega: EnderecoDTO;
    pagamento: PagamentoDTO;
    itens: ItemPedidoData[];
    valorTotal: number;
}