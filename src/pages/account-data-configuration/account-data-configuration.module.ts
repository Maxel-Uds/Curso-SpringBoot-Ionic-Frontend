import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountDataConfigurationPage } from './account-data-configuration';

@NgModule({
  declarations: [
    AccountDataConfigurationPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountDataConfigurationPage),
  ],
})
export class AccountDataConfigurationPageModule {}
