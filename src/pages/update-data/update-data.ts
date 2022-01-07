import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-update-data',
  templateUrl: 'update-data.html',
})
export class UpdateDataPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  changePass() {
    this.navCtrl.push('PasswordConfigurationPage');
  }
}
