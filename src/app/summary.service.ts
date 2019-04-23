import { Injectable } from '@angular/core';
import { SummaryData } from './summary.interface';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, filter, tap, catchError } from 'rxjs/operators';

@Injectable()

export class SummaryService {

    //private url: '/assets/summary.json';
    private url : 'https://ups-java-server.mybluemix.net/ups/queryinvoivcesummary';

    constructor(private _http : Http){}

   /*  getAllData(): Observable<SummaryData[]> {
        return this._http.get('/assets/summary.json')
        .pipe(map((response : Response) => <SummaryData[]> response.json()),
            catchError((error:any) =>{ throw new Error('Failed')}),
            tap(data => console.log(JSON.stringify(data)))
        );
    } */

    getAllData(data:any): Observable<SummaryData[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(data);
        return this._http.post('https://ups-java-new.mybluemix.net/ups/queryinvoivcesummary', body, options )
        .pipe(map((response: Response) => <SummaryData[]> response.json()), 
              catchError((error:any) =>{ throw new Error('Failed')})
              //tap(data => console.log(JSON.stringify(data)))
        );
      }  

      updateInvoiceData(data:any): Observable<SummaryData[]>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(data);
        return this._http.post('https://ups-java-new.mybluemix.net/ups/updateinvoivcesummary', body, options )
        .pipe(map((response: Response) => <SummaryData[]> response.json()), 
              catchError((error:any) =>{ throw new Error('Failed')}),
              tap(data => console.log(JSON.stringify(data)))
        );
      }  
}