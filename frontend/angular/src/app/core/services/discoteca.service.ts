import { Injectable } from '@angular/core';
import { HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Discoteca, DiscotecaListConfig } from '../models';
import { map } from 'rxjs/operators';

@Injectable()
export class DiscotecasService {
    constructor (private apiService: ApiService) {}
    
    //Querys
      // Aqui es donde viene para ejecutar la query
      query(): Observable<{discotecas: Discoteca[]}> {

        return this.apiService.discotecasGet('/discotecas/').pipe(map(data => {
          return data;
        }));
      }

      //GET discotecas de un user
      getDiscotecasByUser(id: number) {
        return this.apiService.discotecasGet('/discotecas/'+id+'/user').pipe(map(data => {
          return data;
        }));
      }

      //Delete discoteca by id
      deleteDisco(id: number){
        return this.apiService.deleteDisco('/discotecas/'+id).pipe(map(data => {
          return data;
        }))
      }

      //Details
      get(id: Observable<Discoteca>) {
        return this.apiService.discotecasGet('/discotecas/' + id)
          .pipe(map(data => data.discoteca));
      }

      //Favorite
      favorite(id: number) {  //id: Observable<Discoteca>
        return this.apiService.discotecasFavorite('/discotecas/' + id + '/favorite')
          .pipe(map(data => data.discoteca));
      }

      //UnFavorite
      unfavorite(id: number) {  //id: Observable<Discoteca>
        return this.apiService.discotecasFavorite('/discotecas/' + id + '/unfavorite')
          .pipe(map(data => data.discoteca));
      }

      //Create discoteca
      createDiscoteca(data: Discoteca) {
        return this.apiService.discotecasPost('/discotecas', data)
          .pipe(map(data => data));
      }
      

}