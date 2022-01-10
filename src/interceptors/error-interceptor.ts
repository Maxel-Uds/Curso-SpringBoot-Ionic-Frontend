import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from '../services/storage.service';
import { AlertController } from 'ionic-angular';
import { API_CONFIG } from '../config/api.config';
import { FieldMessage } from '../models/fieldmessage';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertCtrl: AlertController, public storageService: StorageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
        .catch((error, caught) => {
            let errorObj = error;

            if(errorObj.error) {
                errorObj = errorObj.error;
                
            }

            if(!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            let reqUrl = req.url.substring(API_CONFIG.baseUrl.length);
            let email = this.storageService.getLocalUser().email;
            let errorStatus = errorObj.status;
            let errorName = errorObj.name;

            if(errorStatus == 401 && reqUrl == "/auth/change-pass" || `/clientes/email?value=${email}`) {
                errorObj.message = 'Senha atual incorreta';

                this.handleDefaultError(errorObj);
            }
            else if(errorStatus == 401) {
                this.handle401();
            } 
            else if(errorStatus == 403) {
                this.handle403();
            }
            else if(errorStatus == 422) {
                this.handle422(errorObj);
            }
            else if(errorStatus == 404 && errorName == "HttpErrorResponse") {
                errorObj.error = 'NOT FOUND';
                errorObj.message = 'Endereço não encontrado: ' + errorObj.url.substring(API_CONFIG.baseUrl.length);

                this.handleDefaultError(errorObj);
            }
            else {
                this.handleDefaultError(errorObj);
            }

            return Observable.throw(errorObj);
        }) as any;
    }

    handle403() {
        this.storage.setLocalUser(null);
    }

    handle401() {
        let alert = this.alertCtrl.create({
            title: 'Erro 401: Falha de Autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {text: 'ok'}
            ]
        });

        alert.present();
    }

    handle422(errorObj) {
        let alert = this.alertCtrl.create({
            title: 'Erro 422: Validação',
            message: this.listErros(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                {text: 'Ok'}
            ]
        });

        alert.present();
    }

    handleDefaultError(error) {
        let alert = this.alertCtrl.create({
            title: 'Erro ' + error.status + ': ' + error.error,
            message: error.message,
            enableBackdropDismiss: false,
            buttons: [
                {text: 'ok'}
            ]
        });

        alert.present();
    }

    listErros(messages: FieldMessage[]) : string {
        let errors : string = '';
        for (let i = 0; i < messages.length; i++) {
            errors = errors + '<p><strong>' + messages[i].fieldName + '</strong>: ' + messages[i].message + '</p>'; 
        }

        return errors;
    }
}
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
