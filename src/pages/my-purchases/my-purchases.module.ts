import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PedidoService } from '../../services/domain/pedido.service';
import { MyPurchasesPage } from './my-purchases';

@NgModule({
  declarations: [
    MyPurchasesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyPurchasesPage),
  ],
  providers: [
    PedidoService
  ]
})
export class MyPurchasesPageModule {}
