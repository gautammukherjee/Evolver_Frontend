import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

const API_URL = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(private http: HttpClient) {
  }
  addUserScenario(params: any) {
    return this.http.post(API_URL + 'addUserScenario', params, httpOptions);
  }
  getUserScenarios(params: any) {
    return this.http.post(API_URL + 'getUserScenarios', params, httpOptions);
  }
  getPerUserScenarios(params: any) {
    return this.http.post(API_URL + 'getPerUserScenarios', params, httpOptions);
  }

  // getScenarioDetail(params) {
  //   return this.http.post(API_URL + 'getScenarioDetail', params, httpOptions);
  // }
  delUserScenario(params: any) {
    return this.http.post(API_URL + 'delUserScenario', params, httpOptions);
  }

}
