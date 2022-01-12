import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  instante: Date = new Date();
  finishPurchase: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService
  ) {
    this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;

    this.clienteService.findById(this.pedido.cliente.id)
    .subscribe(response => {
      this.cliente = response as ClienteDTO;
      this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
    },
    error => {
      this.navCtrl.setRoot('HomePage');
    });
  }

  getTotal() {
    return this.cartService.total();
  }

  checkout() {
    this.pedido.minutosUntilUtc = this.instante.getTimezoneOffset();

    this.pedidoService.insert(this.pedido)
    .subscribe(response => {
      let idPedido = this.extractId(response.headers.get('location'));
      this.getInstante(idPedido);
    },
    error => {
      if(error.status == 403) {
        this.navCtrl.setRoot('HomePage');
      }
    });

    this.cartService.createOrClearCart();
  }

  back() {
    this.navCtrl.setRoot('CartPage');
  }

  home() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  private getInstante(id: string) {
    this.pedidoService.findById(id)
    .subscribe(response => {
      this.instante = response['instante'];
      this.finishPurchase = true;
    });
  }

  private findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO {
    let position = list.findIndex(endereco => endereco.id == id);
    return list[position];
  }

  private extractId(location: string) : string {
    return location.substring(location.lastIndexOf('/') + 1);
  }

}
