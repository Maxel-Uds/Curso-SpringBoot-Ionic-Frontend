import { Component } from '@angular/core';
import { AlertController, IonicPage, MenuController, NavController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  credenciais: CredenciaisDTO = {
    email: "",
    senha: ""
  }

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController, 
    public auth: AuthService,
    public alertCtrl: AlertController
  ) {

  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidEnter() {
    this.auth.refreshToken()
    .subscribe(response => {
      this.auth.successfulLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
    error => {});
  }

  login() {
    this.auth.authenticate(this.credenciais)
    .subscribe(response => {
      this.auth.successfulLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
    error => {
      this.handle401();
    });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
  
  forgotPass() {
    this.navCtrl.push('FotgotPassPage');
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
  
}
