import { Injectable } from '@angular/core';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { ConnectionService } from 'ng-connection-service';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ConnectionStatus {
  Online,
  Offline
}
export enum Conexao {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.Offline);
  private estado: BehaviorSubject<Conexao> = new BehaviorSubject<Conexao>(Conexao.Offline);

  constructor(
    private toastController: ToastController,
    private connectionService: ConnectionService,
    private network: Network,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      let status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
      let estado = this.network.type !== 'none' ? Conexao.Online : Conexao.Offline;
      this.estado.next(estado);
    });
  }

  public initializeNetworkEvents() {

    this.connectionService.monitor().subscribe(
      situacao => {
        if (situacao) {
          this.atualizaConexao(Conexao.Online);
        } else {
          this.atualizaConexao(Conexao.Offline);
        }
      }
      );

    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log("caiu a conexao");
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log("voltou a conexao");
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    let connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
    let toast = this.toastController.create({
      message: `Aplicativo ${connection}`,
      duration: 5000,
      position: 'top'
    });
    toast.then(toast => toast.present());
  }

  private async atualizaConexao(estado: Conexao){
    this.estado.next(estado);

    let connection = estado === Conexao.Offline ? 'Offline' : 'Online';
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public mudouEstado(): Observable<Conexao>{
    return this.estado.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

  public pegarEstado(): Conexao{
    return this.estado.getValue();
  }
}
