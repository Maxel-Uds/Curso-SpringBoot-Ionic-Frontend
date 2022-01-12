import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReceivePedido } from '../../models/receive-pedido.dto';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-my-purchases',
  templateUrl: 'my-purchases.html',
})
export class MyPurchasesPage {

  items: ReceivePedido[];
  pedido: ReceivePedido;

  constructor(public navCtrl: NavController, public navParams: NavParams, public pedidoService: PedidoService) {
  }

  ionViewDidLoad() {
    this.pedidoService.getPageable()
    .subscribe(response => {
      this.items = response['content'] as ReceivePedido[];
    },
    error => {});
  }

  pedidoDetails(id: string) {
    this.pedidoService.findById(id)
    .subscribe(response => {
      this.pedido = response as ReceivePedido;
    },
    error => {});
  }

  back() {
    this.pedido = null;
  }
 
}
