import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../../config/api.config";

@Injectable()
export class EnderecoService {
    
    constructor(public http: HttpClient) {
    }

    updateAddress(adress) {
        return this.http.put(
            `${API_CONFIG.baseUrl}/endereco/update`,
            adress,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    deleteAddress(id) {
        return this.http.delete(
            `${API_CONFIG.baseUrl}/endereco/delete/${id}`,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    createAddress(adress) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/endereco/create`,
            adress,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}