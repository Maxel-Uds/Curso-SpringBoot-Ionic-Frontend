import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CidadeService } from '../../services/domain/cidade.service';
import { EnderecoService } from '../../services/domain/endereco.service';
import { EstadoService } from '../../services/domain/estado.service';
import { UpdateAddressPage } from './update-address';

@NgModule({
  declarations: [
    UpdateAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateAddressPage),
  ],
  providers: [
    EstadoService,
    CidadeService,
    EnderecoService
  ]
})
export class UpdateAddressPageModule {}
