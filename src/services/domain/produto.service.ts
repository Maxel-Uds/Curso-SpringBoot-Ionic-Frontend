import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ProdutoService {

    constructor(public http: HttpClient) {
    }

    findByCategoria(categoria_id: string) : Observable<any> {
        return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categoria=${categoria_id}`);
    }
}