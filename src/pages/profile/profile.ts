import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthService } from '../../services/auth.service';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;
  admin: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera,
    public alertCtrl: AlertController,
    public authService: AuthService
  ) {}

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
      .subscribe(response => {
        this.cliente = response as ClienteDTO;
        this.admin = this.cliente.perfil.indexOf('ADMIN');
        this.getImageIfExists();
      },
      error => {
        if(error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
    }
    else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
    .subscribe(response => {
      this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
    },
    error => {});
  }

  getCameraPicture() {
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(imageData => {
      this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    },
    error => {});
  }

  sendPicture() {
    this.clienteService.uploadPicture(this.picture)
    .subscribe(response => {
      this.picture = null;
      this.loadData();
    },
    error => {});
  }

  cancel() {
    this.picture = null;
  }

  updateData() {
    this.navCtrl.push('UpdateDataPage');
  }

  findClient() {
    let email = this.storage.getLocalUser().email;
    this.clienteService.findByEmail(email)
    .subscribe(response => {
        let id = response['id'];
        this.warning(id);
    },
    error => {});
  }

  private authenticateUser(id: string, email: string, senha: string) {
    this.authService.authenticate({ email: email, senha: senha })
    .subscribe(response => {
      this.deleteAccount(id);
    },
    error => {
      this.handle401();
    });
  }

  private deleteAccount(id: string) {
    this.clienteService.deleteAccount(id)
    .subscribe(response => {
      this.exclusionOk();
    },
    error => {});
  }

  warning(id: string) {
    let alert = this.alertCtrl.create({
      title: 'Cuidado!',
      message: 'Voc?? tem certeza que quer deletar a sua conta? <br>' + '<p><strong>Essa a????o ?? irreversivel!</strong></p>'.fontcolor('red'),
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.auth(id)
          }
        },
        {
          text: 'N??o',
        }
      ]
    });

    alert.present();
  }

  auth(id: string) {
    let alert = this.alertCtrl.create({
      title: 'Confirma????o de exclus??o:',
      message: 'Confirme sua identidade pra excluir a conta!',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'email',
          placeholder: 'email'
        },
        {
          name: 'pass',
          placeholder: 'senha',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Confirmar',
          handler: data => {
            this.authenticateUser(id, data.email, data.pass);              
          }
        },
        {
          text: 'Cancelar',
        }
      ]
    });

    alert.present();
  }

  exclusionOk() {
    let alert = this.alertCtrl.create({
      title: 'Foi bom ter voc?? por aqui!',
      message: 'Sua conta foi exclu??da com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot('HomePage');
          }
        }
      ]
    });

    alert.present();
  }

  handle401() {
    let alert = this.alertCtrl.create({
        title: 'Erro 401: Falha de Autentica????o',
        message: 'Senha ou email incorretos',
        enableBackdropDismiss: false,
        buttons: [
            {text: 'ok'}
        ]
    });

    alert.present();
  }
}
