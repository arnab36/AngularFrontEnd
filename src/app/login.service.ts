import { Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { map, filter, tap, catchError } from 'rxjs/operators';
import { Authtenticate } from './login.interface';
import { Observable } from 'rxjs';

@Injectable()

export class LoginService {
    url: string = 'https://ups-java-demo.mybluemix.net/ups/querylogin';

    constructor (private _http : Http) {}

    authenticateUser(data: any): Observable<Authtenticate[]>  {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(data);
       // return this._http.post('https://ups-java-new.mybluemix.net/ups/querylogin', body, options )
	   return this._http.post('http://localhost:8080/ups/querylogin', body, options )
        .pipe(map((response: Response) => <Authtenticate[]> response.json()), 
              catchError((error:any) =>{ throw new Error('Failed')})
             // tap(data => console.log(JSON.stringify(data)))
        );
    }
}