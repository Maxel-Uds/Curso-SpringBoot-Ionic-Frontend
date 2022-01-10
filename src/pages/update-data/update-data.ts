import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-update-data',
  templateUrl: 'update-data.html',
})
export class UpdateDataPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public storageService: StorageService, 
    public clienteService: ClienteService
  ) {
  }

  changePass() {
    this.navCtrl.push('PasswordConfigurationPage');
  }

  addressConfig() {
    this.navCtrl.push('AddressConfigurationPage');
  }

  accountDataConfig() {
    let email = this.storageService.getLocalUser().email;
    this.clienteService.findByEmail(email)
    .subscribe(response => {
      this.navCtrl.push('AccountDataConfigurationPage', { response: response });
    },
    error => {});
  }
}
