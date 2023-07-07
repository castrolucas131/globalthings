import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Heroes } from '../model/heroes.model';
import { DatabaseService } from './database.service';
import { environment } from 'src/environments/environment';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  token: string = 'e2c88e85dc854de69162eee98ea11809';

  constructor(
    private dbService: DatabaseService,
    private http: HTTP
  ) { }

  public insertHeroesOffline(heroes: Heroes) {
    return this.dbService.getDatabase()
        .then((sQLiteObject: SQLiteObject) => {
          const sql = 'INSERT INTO heroes (Id, Name, CategoryId, Active) VALUES (?, ?, ?, ?)';

          const data = [
            heroes.Id, heroes.Name, heroes.CategoryId, heroes.Active];

          return sQLiteObject.executeSql(sql, data)
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
  }

  public getAllHeroesOffline() {
    return this.dbService.getDatabase()
    .then((banco: SQLiteObject) => {
      const sql = 'SELECT * FROM heroes';

      const data: [] = [];
      return banco.executeSql(sql, data)
        .then((retorno: any) => {
          if (retorno.rows.length > 0) {
            const heroes: any[] = [];

            for (let i = 0; i < retorno.rows.length; i++) {
              const heroe = retorno.rows.item(i);
              heroes.push(heroe);
            }

            return heroes;
          } else {
            return [];
          }
          return null;
        })
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
  }

  public deleteHeroesOffline(id: any) {
    return this.dbService.getDatabase()
    .then((sQLiteObject: SQLiteObject) => {
      const sql = 'DELETE FROM heroes WHERE Id = ?';
      const data = [id];

      return sQLiteObject.executeSql(sql, data)
      .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
  }

  insertHeroes(Heroes: Heroes) {
    const options = {
      headers: 'Content-Type: application/json',
      accessKey: this.token,
      observe: 'response' as 'response'
    };
    return this.http.post(`${environment.api}/api/Heroes/`, Heroes, options);
  }

  getAllHeroes() {
    const options = {
      headers: 'Content-Type: application/json',
      accessKey: this.token,
      observe: 'response' as 'response'
    };
    return this.http.get(`${environment.api}/api/Heroes/`, {}, options);
  }

  getAllCategories() {
    const options = {
      headers: 'Content-Type: application/json',
      accessKey: this.token,
      observe: 'response' as 'response'
    };
    return this.http.get(`${environment.api}/api/Category/`, {}, options);
  }
}
