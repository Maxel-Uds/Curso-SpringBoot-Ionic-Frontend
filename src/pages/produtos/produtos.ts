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

  items: ProdutoDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    this.loadData();
  }  

  loadData() {
    let categoria_id = this.navParams.get('categoriaId');

    let loader = this.presentLoanding();
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
    .subscribe(response => {
      let start = this.items.length;
      this.items = this.items.concat(response['content']);
      let end = this.items.length -1;
      console.log(this.items)
      console.log(this.page)    
      this.setImageUrl(start, end);
      loader.dismiss();
    },
    error => {
      loader.dismiss();
    });
  }

  setImageUrl(start: number, end: number) {
    for(let i = start; i < end; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
      .subscribe(response => {
        item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
      },
      error => {});
    }
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

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadData();
    
    setTimeout(() => {
      refresher.complete();    
    }, 500);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();

    setTimeout(() => {
      infiniteScroll.complete();    
    }, 500);
  }

}
