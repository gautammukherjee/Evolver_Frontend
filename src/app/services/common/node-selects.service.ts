import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

// import { Observable } from 'rxjs';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/do';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NodeSelectsService {
  private API_URL: string = environment.apiUrl;
  private _Gene_syns: any;

  constructor(private http: HttpClient) { }

  getNodeSelects() {
    return this.http.get(this.API_URL + 'getNodeSelects', httpOptions);
  }
  getSourceNode(params: any) {
    return this.http.post(this.API_URL + 'getSourceNode', params, httpOptions);
  }
  getDestinationNode(params: any) {
    return this.http.post(this.API_URL + 'getDestinationNode', params, httpOptions);
  }
  getEdgeType() {
    return this.http.get(this.API_URL + 'getEdgeType', httpOptions);
  }

  getMasterLists(params: any) {
    return this.http.post(this.API_URL + 'getMasterLists', params, httpOptions);
  }


}
