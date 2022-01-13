import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReceivePedido } from '../../models/receive-pedido.dto';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-my-purchases',
  templateUrl: 'my-purchases.html',
})
export class MyPurchasesPage {

  items: ReceivePedido[] = [];
  pedido: ReceivePedido;
  page: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public pedidoService: PedidoService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    this.load();
  }

  load() {
    let loader = this.presentLoanding();

    this.pedidoService.getPageable(this.page, 10)
    .subscribe(response => {
      this.items = this.items.concat(response['content']);
      loader.dismiss()
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

  presentLoanding() {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...', 
    });

    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.load();
    
    setTimeout(() => {
      refresher.complete();    
    }, 500);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.load();

    setTimeout(() => {
      infiniteScroll.complete();    
    }, 500);
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
