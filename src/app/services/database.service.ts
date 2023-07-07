import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    public platform: Platform,
    private sqlite: SQLite) {
      this.platform.ready().then(() => {
        this.createDatabase();
      });
    }

    public getDatabase() {
      return this.sqlite.create({
        name: 'lista_it.db',
        location: 'default'
      });
    }

  public createDatabase() {
    return this.getDatabase().then((database: SQLiteObject) => {
      this.createTables(database);
    }).catch((error) => {} );
  }

  public createTables(database: SQLiteObject) {
    database.executeSql(`
    CREATE TABLE IF NOT EXISTS heroes (
      Id integer PRIMARY KEY,
      Name varchar(100),
      CategoryId Integer,
      Active integer)
    `, [])
      .then(() => {
        console.log('Table Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }
}
