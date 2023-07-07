import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { Heroes } from 'src/app/model/heroes.model';
import { HeroesService } from 'src/app/services/heroes.service';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  HeroesForm: FormGroup;
  Heroes = {} as Heroes;

  categories: any[];

  constructor(
    public platform: Platform,
    private networkService: NetworkService,
    private router: Router,
    public toastController: ToastController,
    private heroesService: HeroesService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.createHeroesForm();

    this.getAllCategory();
  }

  async onRegister() {
    this.platform.ready().then(async () => {
      this.Heroes = Object.assign(this.HeroesForm.value);
      console.log(this.Heroes);
      try {
        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
          await this.insertHeroesOffline();
          await this.presentToast('Enviar Dados quando a Conexao for estabelecida!');
        } else {
          await this.heroesService.insertHeroes(this.Heroes)
          .then(async (response) => {
            if(response.status === 201) {
              await this.presentToast('Hero successfully inserted!');
              this.router.navigate(['/tabs/tab1']);
            } else {
              this.presentToast('Error when registering!');
            }
          }, (error) => {
            console.log(error);
          });
        }

      } catch (error) {
        console.log(error);
      }
    });
  }

  async insertHeroesOffline(){
    await this.heroesService.insertHeroesOffline(this.Heroes)
      .then(async (result: any) => {
        if (result) {
          await this.presentToast('Registro gravado OFFLine!');
          this.router.navigate(['/tabs/tab1']);
        }
      }, (e) => console.log('Erro ao cadastrar ' + e)).catch(() => {
        console.log('error');
      });
  }

  createHeroesForm() {
    this.HeroesForm = this.formBuilder.group({
      Name: ['', [Validators.required,]],
      CategoryId: ['', [Validators.required]],
      Active: ['true', [Validators.required]],
    });
  }

  async getAllCategory() {
    this.platform.ready().then(async () => {
      try {
        await this.heroesService.getAllCategories()
        .then((response) => {
          console.log(response);
          if(response.status === 200) {
            if(response.data) {
              response.data = JSON.parse(response.data);
              this.categories = response.data.Items;
            } else {
              this.presentToast('Invalid data!');
            }
          } else {
            this.presentToast('Error returning data!');
          }
        }, (error) => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  onCancel() {
    this.router.navigate(['/tabs/tab1']);
  }

}
