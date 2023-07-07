import { Component } from '@angular/core';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { Router } from '@angular/router';
import { HeroesService } from '../services/heroes.service';
import { Heroes } from '../model/heroes.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  modelHeroes: any[];
  Herores = {} as Heroes;
  isLoading = false;

  constructor(
    public platform: Platform,
    private networkService: NetworkService,
    public loadingController: LoadingController,
    private router: Router,
    public toastController: ToastController,
    private heroesService: HeroesService
  ) {}

  ngOnInit() {
    //
  }

  async ionViewDidEnter(){
    await this.getAllHeroes();
  }

  async sendOffline() {
    this.platform.ready().then(async () => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
        await this.presentToast('No internet connection, check!');
      } else {
        this.loadingPresent('Sending data OFFLine ...');
        await this.heroesService.getAllHeroesOffline()
        .then(async (result: any) => {
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              var heroes: any;
              heroes = '{ "Name": "' + result[i].Name + '", "CategoryId": "' + result[i].CategoryId+ '", "Active": "' + result[i].Active + '" }';
              heroes = JSON.parse(heroes);
              await this.heroesService.insertHeroes(heroes)
              .then(async (response) => {
                if(response.status === 201) {
                  await this.presentToast('Hero successfully inserted!');
                  await this.heroesService.deleteHeroesOffline(result[i].Id);
                } else {
                  await this.presentToast('Error when registering!');
                }
              }, (error) => {
                console.log(error);
              });
            }
            await this.presentToast('Records sent successfully!');
            this.loadingDismiss();
            await this.getAllHeroes();
          } else {
            await this.presentToast('There are no records for submission!');
            this.loadingDismiss();
          }
        }, (error) => {
          console.log(error);
        });
      }
    });
  }

  async getAllHeroes(){
    this.platform.ready().then(async () => {
      this.loadingPresent('Please wait ...');
        try {
          await this.heroesService.getAllHeroes()
          .then((response) => {
            console.log(response);
            if(response.status === 200) {
              if(response.data) {
                response.data = JSON.parse(response.data);
                this.modelHeroes = response.data.Items;
              } else {
                this.presentToast('Invalid data!');
              }
            } else {
              this.presentToast('Error returning data!');
            }
            this.loadingDismiss();
          }, (error) => {
            this.presentToast(error);
            this.loadingDismiss();
          });
        } catch (error) {
          this.loadingDismiss();
          this.presentToast('Error ao exeutar');
        }
    });
  }

  pageAdd() {
    this.router.navigateByUrl('/add', {replaceUrl: true});
  }

  async loadingPresent(msg: string) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: msg,
      spinner: 'circles'
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort laoding'));
        }
      });
    });
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
