import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../../config/api.config";
import { PedidoDTO } from "../../models/pedido.dto";

@Injectable()
export class PedidoService {

    constructor(public http: HttpClient) {
    }

    insert(pedido: PedidoDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/pedidos`, 
            pedido,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/pedidos/${id}`);
    }

    getPageable(page: number = 0, linesPerPage: number = 24) {
        return this.http.get(`${API_CONFIG.baseUrl}/pedidos?page=${page}&linesPerPage=${linesPerPage}`);
    }

    cancel(id: string) {
        return this.http.put(
            `${API_CONFIG.baseUrl}/pedidos/cancel-order/${id}`,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}