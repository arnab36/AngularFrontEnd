import { Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { map, filter, tap, catchError } from 'rxjs/operators';
import { AllFileHistory } from './home.interface';
import { Observable } from 'rxjs';

@Injectable()

export class HomeService {
    url: string = ' https://ups-java-server.mybluemix.net/ups/queryfilesummary';

    constructor (private _http : Http) {}

    getAllFileHistory(data:any): Observable<AllFileHistory[]>  {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(data);
        return this._http.post('https://ups-java-new.mybluemix.net/ups/queryfilesummary', body, options)
        .pipe(map((response: Response) => <AllFileHistory[]> response.json()), 
              catchError((error:any) =>{ throw new Error('Failed')})
             // tap(data => console.log(JSON.stringify(data)))
        );
    }

    uploadAllFiles(formdata,data): Observable<AllFileHistory[]>  {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(data); 
      //  return this._http.post('https://ups-java-new.mybluemix.net/ups/fileupload', formdata, body)
		return this._http.post('http://localhost:8080/ups/fileupload', formdata, body)
        .pipe(map((response: Response) => <AllFileHistory[]> response.json()), 
              catchError((error:any) =>{ throw new Error('Failed')})
              //tap(data => console.log(JSON.stringify(data)))
        );
    }

    dowloadFile(data)  {
        let headers = new Headers({ 'Accept': "application/json, text/plain, */*", 'Content-Type': "application/json;charset=utf-8" });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(data); 
        return this._http.post('https://ups-java-new.mybluemix.net/ups/downloadfile', body, options)
        .pipe(map((response: Response) => {return response}), 
              catchError((error:any) =>{ throw new Error('Failed')}),
              tap(data => console.log(data))
        );
    }
}