import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CidadeDTO } from '../../models/cidade.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeService } from '../../services/domain/cidade.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { EnderecoService } from '../../services/domain/endereco.service';
import { EstadoService } from '../../services/domain/estado.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-address-configuration',
  templateUrl: 'address-configuration.html',
})
export class AddressConfigurationPage {

  formGroup: FormGroup;
  items: EnderecoDTO[];
  estados: EstadoDTO[];
  cidades: CidadeDTO[];
  length: number;
  createAdress: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public clienteService: ClienteService, 
    public storageService: StorageService,
    public alertCtrl: AlertController,
    public estadoService: EstadoService,
    public cidadeService: CidadeService,
    public formBuilder: FormBuilder,
    public enderecoService: EnderecoService
  ) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: ['', []],
      bairro: ['', []],
      cep: ['', [Validators.required]],
      estadoId: [null, [Validators.required]],
      cidadeId: [null, [Validators.required]],
      clienteEmail: [storageService.getLocalUser().email]
    });
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let email = this.storageService.getLocalUser().email;
    this.clienteService.findByEmail(email)
    .subscribe(response => {
      this.items = response['enderecos'];
      this.updateEstados();
      this.length = this.items.length;
    },
    error => {});
  }

  updateEstados() {
    this.estadoService.findAll()
    .subscribe(response => {
      this.estados = response;
      this.formGroup.controls.estadoId.setValue(this.estados[0].id);
      this.updateCidades();
    },
    error => {});
  }

  updateCidades() {
    let estado_id = this.formGroup.value.estadoId;
    this.cidadeService.findAllCidades(estado_id)
    .subscribe(response => {
      this.cidades = response;
      this.formGroup.controls.cidadeId.setValue(null);
    },
    error => {});
  }

  goUpdateAddress(address: EnderecoDTO) {
    this.navCtrl.push('UpdateAddressPage', { endereco: address });
  }

  addAddress() {
    this.createAdress = true;
  }

  create() {
    let address = this.formGroup.value;
    this.enderecoService.createAddress(address)
    .subscribe(response => {
      this.createOk();
      this.loadData();
      this.createAdress = false;
    },
    error => {});
  }

  doRefresh(refresher) {
    this.loadData();
    
    setTimeout(() => {
      refresher.complete();    
    }, 500);
  }

  createOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Endereço cadastrado com sucesso!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });

    alert.present();
  }

}
