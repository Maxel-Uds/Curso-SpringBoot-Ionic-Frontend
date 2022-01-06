import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    let categoria_id = this.navParams.get('categoriaId');

    let loader = this.presentLoanding();
    this.produtoService.findByCategoria(categoria_id)
    .subscribe(response => {
      this.items = response['content'];    
      this.setImageUrl();
      loader.dismiss();
    },
    error => {
      loader.dismiss();
    });
  }

  setImageUrl() {
    this.items.forEach(item => {
      this.produtoService.getSmallImageFromBucket(item.id)
      .subscribe(response => {
        item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
      },
      error => {});
    });
  }

  showDetails(id: string) {
    this.navCtrl.push('ProdutoDetailPage', {produto_id: id});
  }

  presentLoanding() {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...', 
    });

    loader.present();
    return loader;
  }

}
