import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { ClienteDTO } from "../../models/cliente.dto";
import { ImageUtilService } from "../image-util.service";
import { StorageService } from "../storage.service";

@Injectable()
export class ClienteService {

    constructor(public http : HttpClient, public storage : StorageService, public imageUtil: ImageUtilService) {

    }

    findByEmail(email: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`)
    }

    getImageFromBucket(id: string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`;
        return this.http.get(url, {responseType: 'blob'});
    }

    insert(obj: ClienteDTO) {
        return this.http.post(`${API_CONFIG.baseUrl}/clientes`,
        obj,
        {
            observe: 'response',
            responseType: 'text'
        });
    }

    uploadPicture(picture) {
        let pictureBlob = this.imageUtil.dataUriToBlob(picture);
        let formData: FormData = new FormData();
        formData.append('file', pictureBlob, 'file.png');

        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    update(data, email) {
       return this.http.put(
                `${API_CONFIG.baseUrl}/clientes/email?value=${email}`,
                data,
                {
                    observe: 'response',
                    responseType: 'text'
                }
        );
    }

    deleteAccount(id: string) {
        return this.http.delete(
            `${API_CONFIG.baseUrl}/clientes/${id}`,
            {
                observe: 'response',
                responseType: 'text'
            }
    );
    }
}