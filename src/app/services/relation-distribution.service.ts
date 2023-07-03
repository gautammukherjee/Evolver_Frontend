import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class RelationDistributionService {

  constructor(public _http: HttpClient) { }

  distribution_by_relation_grp(params: any){
    //console.log("in service");
    return this._http.post<any>(API_URL +'distribution_by_relation_grp', params, httpOptions);
  }

}
