import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-account-data-configuration',
  templateUrl: 'account-data-configuration.html',
})
export class AccountDataConfigurationPage {

  formGroup: FormGroup;
  resp: Subscription;
  tipo: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    public storageService: StorageService,
    public clienteService: ClienteService,
    public authService: AuthService,
    public alertCtrl: AlertController
  ) {

    this.resp = navParams.get('response');
    this.tipo = this.resp['tipo'] == "PESSOAFISICA" ? true : false;
    
    this.formGroup = this.formBuilder.group({
      nome: [this.resp['nome'], [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: [this.resp['email'], [Validators.required, Validators.email]],
      fisica: ['Pessoa Física'],
      juridica: ['Pessoa Jurídica'],
      cpfOuCnpj: [this.resp['cpfOuCnpj']],
      telefone1: [this.resp['telefones'][0], [Validators.required]],
      telefone2: [this.resp['telefones'][1], []],
      telefone3: [this.resp['telefones'][2], []],
      senha: ['', [Validators.required]]
    });

  }

  autheticateUpdate() {
    let email = this.storageService.getLocalUser().email;
    let senha = this.formGroup.controls['senha'].value;

    this.authService.authenticate({ email: email, senha: senha })
    .subscribe(response => {
      this.update();
    },
    error => {
      this.handle401();
    });
  }

  private update() {
    let data = this.formGroup.value;
    let email = this.storageService.getLocalUser().email;

    this.clienteService.update(data, email)
    .subscribe(response => {
      this.updateLocalUser(data['email'], data['senha']);
    },
    error => {});
  }

  private updateLocalUser(email, senha) {
    this.authService.authenticate({ email: email, senha: senha })
    .subscribe(response => {
      this.authService.successfulLogin(response.headers.get('Authorization'));
      this.updateOk();
    },
    error => {});
    
  }

  updateOk() {
    let alert = this.alertCtrl.create({
      title: 'Dados atualizados!',
      message: 'Seus dados foram atualizados com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot('ProfilePage');
          }
        }
      ]
    });

    alert.present();
  }

  handle401() {
    let alert = this.alertCtrl.create({
        title: 'Erro 401: Falha de Autenticação',
        message: 'Senha incorreta',
        enableBackdropDismiss: false,
        buttons: [
            {text: 'ok'}
        ]
    });

    alert.present();
  }

}
