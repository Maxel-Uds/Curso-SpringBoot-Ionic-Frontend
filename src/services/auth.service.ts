import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { LocalUser } from "../models/local_user.dto";
import { StorageService } from "./storage.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthService {

    jwtHelperService: JwtHelperService = new JwtHelperService();

    constructor(public http: HttpClient, public storage: StorageService) {

    }

    authenticate(crendenciais : CredenciaisDTO) {
        return this.http.post(
                `${API_CONFIG.baseUrl}/login`, 
                crendenciais,
                {
                    observe: 'response',
                    responseType: 'text'
                });
    }

    refreshToken() {
        return this.http.post(
                `${API_CONFIG.baseUrl}/auth/refresh-token`, 
                {},
                {
                    observe: 'response',
                    responseType: 'text'
                });
    }

    successfulLogin(authorization : string) {
        let tok = authorization.substring(7);
        let user : LocalUser = {
            token: tok,
            email: this.jwtHelperService.decodeToken(tok).sub 
        };

        this.storage.setLocalUser(user);
    }

    logOut() {
        this.storage.setLocalUser(null);
    }
}