import { Injectable } from '@angular/core';
import { ResultsSet } from './result.interface';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, tap, catchError} from 'rxjs/operators';

@Injectable()

export class ResultService {

    constructor(private _http : Http) {}

    getAllResearchResuls(data:any): Observable<ResultsSet[]>{
        //url:'https://ups-java-server.mybluemix.net/ups/research';
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(data);
        return this._http.post('https://ups-java-new.mybluemix.net/ups/research', body, options )
        .pipe(map((response: Response) => <ResultsSet[]> response.json()), 
              catchError((error:any) =>{ throw new Error('Failed')})
              //tap(data => console.log(JSON.stringify(data)))
        );
    }
}