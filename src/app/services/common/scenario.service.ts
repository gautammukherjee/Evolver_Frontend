import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

// import { Observable } from 'rxjs';
import { Observable, of, throwError } from "rxjs";
// import { Observable, throwError } from 'rxjs';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/of';
// import { tap } from "rxjs/operators";
// import {tap} from 'rxjs/internal/operators';
import { tap, catchError, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  private API_URL: string = environment.apiUrl;
  private _node_selects2: any;
  private _edge_types: any;
  private _edge_types_first: any;

  constructor(private http: HttpClient) { }

  getPerUserScenarios(params: any) {
    return this.http.post(this.API_URL + 'getPerUserScenarios', params, httpOptions);
  }
  getUserScenarios(params: any) {
    return this.http.post(this.API_URL + 'getUserScenarios', params, httpOptions);
  }
  delUserScenario(params: any) {
    return this.http.post(this.API_URL + 'delUserScenario', params, httpOptions);
  }
  addUserScenario(params: any) {
    return this.http.post(this.API_URL + 'addUserScenario', params, httpOptions);
  }

}
