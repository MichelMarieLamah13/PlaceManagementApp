import { EventData } from './../models/Response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DataModel } from 'src/models/Response';
import { map } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DebugHelper } from 'protractor/built/debugger';
import { Server } from 'http';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  DataModel: DataModel;
  params: HttpParams = new HttpParams();

  constructor(private http: HttpClient) {

  }
  GetData1(url:string) {
    //  debugger;
    this.params = this.params.append('URL', url);
    return this.http.get(environment.Server, { params: this.params });
    // return this.http.get('http://backup.sendatrack.com:8080/events7/data.jsonx', {params});
    //   debugger;
    //return this.http.get(url);
    //return this.http.get('http://backup.sendatrack.com:8080/events7/data.jsonx?a=motivation&p=motivation123321&u=admin&g=all&l=1&at=true');

  }
  GetVehicleProche(url:string): Observable<EventData[]>{
    this.params = this.params.append('URL', url);
    return this.http.get<EventData[]>(environment.Server, {params: this.params});
  }
}

