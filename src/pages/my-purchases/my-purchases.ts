import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public pedidoService: PedidoService,
    public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    this.load();
  }

  load() {
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

  cancel(id: string) {
    this.pedidoService.cancel(id)
    .subscribe(response => {
      this.cancelOk();
    },
    error => {})  
  }

  warning(id: string) {
    let alert = this.alertCtrl.create({
      title: 'Cuidado!',
      message: 'Você tem certeza que deseja cancelar o pedido? <br>' + '<p><strong>Essa ação é irreversivel!</strong></p>'.fontcolor('red'),
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.cancel(id);
          }
        },
        {
          text: 'Não',
        }
      ]
    });

    alert.present();
  }

  cancelOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Seu pedido foi cancelado!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.load();
            this.pedido = null;
          }
        }
      ]
    });

    alert.present();
  }
 
}
