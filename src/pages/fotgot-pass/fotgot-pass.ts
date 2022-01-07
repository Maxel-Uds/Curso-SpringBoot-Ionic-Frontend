import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-fotgot-pass',
  templateUrl: 'fotgot-pass.html',
})
export class FotgotPassPage {

  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder, 
    public authService: AuthService,
    public alertCtrl: AlertController
  ) {
    this.formGroup = this.formBuilder.group({email: ['', [Validators.required, Validators.email]]})
  }

  sedNewPasswordToEmail() {
    this.authService.newPasswordGenerate(this.formGroup.value)
    .subscribe(response => {
      this.showNewPassSendedOk();
    },
    error => {});
  }

  showNewPassSendedOk() {
    let alert = this.alertCtrl.create({
      title: 'Email Enviado!',
      message: 'Uma nova senha foi enviada para seu email ',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }
}
