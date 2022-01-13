import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CidadeDTO } from '../../models/cidade.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeService } from '../../services/domain/cidade.service';
import { EnderecoService } from '../../services/domain/endereco.service';
import { EstadoService } from '../../services/domain/estado.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-update-address',
  templateUrl: 'update-address.html',
})
export class UpdateAddressPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];
  address: EnderecoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storageService: StorageService,
    public alertCtrl: AlertController,
    public estadoService: EstadoService,
    public cidadeService: CidadeService,
    public formBuilder: FormBuilder,
    public enderecoService: EnderecoService
  ) {
    this.address = this.navParams.get('endereco');

    this.formGroup = this.formBuilder.group({
      id: [this.address.id],
      logradouro: [this.address.logradouro, [Validators.required]],
      numero: [this.address.numero, [Validators.required]],
      complemento: [this.address.complemento, []],
      bairro: [this.address.bairro, []],
      cep: [this.address.cep, [Validators.required]],
      estadoId: [null, [Validators.required]],
      cidadeId: [null, [Validators.required]],
      clienteEmail: [storageService.getLocalUser().email]
    });
  }

  ionViewDidLoad() {  
    this.estadoService.findAll()
    .subscribe(response => {
      this.estados = response;
      this.formGroup.controls.estadoId.setValue(this.address.cidade.estado.id);
      this.updateCidades();
    },
    error => {});
  }

  updateCidades() {
    let estado_id = this.formGroup.value.estadoId;
    this.cidadeService.findAllCidades(estado_id)
    .subscribe(response => {
      this.cidades = response;
      this.formGroup.controls.cidadeId.setValue(this.address.cidade.id);
    },
    error => {});
  }

  update() {
    let address = this.formGroup.value;
    this.enderecoService.updateAddress(address)
    .subscribe(response => {
      this.updateOk();
    },
    error => {});
  }

  delete() {
    let id = this.formGroup.controls['id'].value;
    this.enderecoService.deleteAddress(id)
    .subscribe(response => {
      this.deleteOk();
    },
    error => {});
  }

  updateOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Endereço atualizado com sucesso!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }

  deleteOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Endereço excluído com sucesso!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }
}
