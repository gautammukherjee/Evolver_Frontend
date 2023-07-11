import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

// import { Observable } from 'rxjs';
import { Observable, throwError } from 'rxjs';
// import { of } from 'rxjs';
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
export class NodeSelectsService {
  private API_URL: string = environment.apiUrl;
  private _edge_types: any;

  constructor(private http: HttpClient) { }

  getNodeSelects() {
    return this.http.get(this.API_URL + 'getNodeSelects', httpOptions);
  }

  getNodeSelects2(params: any) {
    return this.http.post(this.API_URL + 'getNodeSelects2', params, httpOptions);
  }

  // getCategories() {
  //   if (this._TAs) {
  //     return Observable.of(this._TAs);
  //   } else {
  //     //return this.http.get(API_URL + 'getTherapeuticAreas');
  //     return this._http.get(this.API_URL + 'getTasLists', httpOptions).do(
  //       (data: any) => {
  //         this._TAs = data;
  //       });
  //   }
  // }

  getSourceNode(params: any) {
    return this.http.post(this.API_URL + 'getSourceNode', params, httpOptions);
  }
  getDestinationNode(params: any) {
    return this.http.post(this.API_URL + 'getDestinationNode', params, httpOptions);
  }

  // getEdgeType() {
  //   if (this._edge_types) {
  //     return Observable.of(this._edge_types);
  //   } else {
  //     return this.http.get(this.API_URL + 'getEdgeType', httpOptions).do(
  //       (data) => {
  //         this._edge_types = data;
  //       });
  //   }
  // }

  getEdgeType() {
    return this.http.get(this.API_URL + 'getEdgeType', httpOptions);
  }

  getMasterLists(params: any) {
    return this.http.post(this.API_URL + 'getMasterLists', params, httpOptions);
  }

  getEdgeTypeName(params: any): Observable<any> {
    return this.http.post(this.API_URL + 'getEdgeTypeName', params, httpOptions)
      .pipe(map((data: any) => {
        // debug error here
        // console.log("data22: ", data);
        return data.edgeTypeName;
      }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    return throwError(error);
  }

  getDistributionRelationType(params: any) {
    return this.http.post(this.API_URL + 'getDistributionRelationType', params, httpOptions);
  }

  getEdgePMIDLists(params: any) {
    return this.http.post(this.API_URL + 'getEdgePMIDLists', params, httpOptions);
  }


}
