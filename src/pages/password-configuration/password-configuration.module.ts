import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordConfigurationPage } from './password-configuration';

@NgModule({
  declarations: [
    PasswordConfigurationPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordConfigurationPage),
  ],
})
export class PasswordConfigurationPageModule {}
