import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CidadeService } from '../../services/domain/cidade.service';
import { EnderecoService } from '../../services/domain/endereco.service';
import { EstadoService } from '../../services/domain/estado.service';
import { AddressConfigurationPage } from './address-configuration';

@NgModule({
  declarations: [
    AddressConfigurationPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressConfigurationPage),
  ],
  providers: [
    EstadoService,
    CidadeService,
    EnderecoService
  ]
})
export class AddressConfigurationPageModule {}
