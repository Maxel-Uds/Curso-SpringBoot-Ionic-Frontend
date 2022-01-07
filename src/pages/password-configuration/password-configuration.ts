import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-password-configuration',
  templateUrl: 'password-configuration.html',
})
export class PasswordConfigurationPage {

  formGroup: FormGroup;
  email: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder, 
    public authService: AuthService,
    public alertCtrl: AlertController,
    public storageService: StorageService
  ) {
    this.email = this.storageService.getLocalUser().email

    this.formGroup = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]],
      current: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      passAgain: ['', [Validators.required]]
    });
  }

  checkPasswordCreds() {
    let senha = this.formGroup.controls['current'].value;
    
    this.authService.authenticate({
      email: this.email,
      senha: senha
    }).subscribe(reponse => {
      this.changePassword(this.email);
    },
    error => {});
  }

  notEqual() : boolean {
    return this.formGroup.controls['pass'].value != this.formGroup.controls['passAgain'].value;
  }

  private changePassword(email: string) {
    let newPass = this.formGroup.controls['passAgain'].value;
    this.authService.changePassword(email, newPass)
    .subscribe(response => {
      this.passChagedWithSucces();
    },
    error => {});
  }

  passChagedWithSucces() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Senha atualizada!',
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
