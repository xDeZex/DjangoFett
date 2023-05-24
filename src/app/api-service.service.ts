import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput, firstValueFrom, of, throwError } from 'rxjs';
import { catchError, map, retry, shareReplay, timeout } from 'rxjs/operators';
import { ReturnStatement } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  apiURL = 'https://xdezex.duckdns.org:5001/api/v1'

  clockCache: Observable<any> |null = null;
  indicatorCache: Observable<any> |null = null;

  httpOptions = {
    headers: new HttpHeaders({})
  }

  constructor(private http: HttpClient,) { }


  getClock(): Observable<any>{
    if(!this.clockCache){
      let ret = this.http.get<any>(`${this.apiURL}/index`, this.httpOptions).pipe(
        map(response => response)
      );
      this.clockCache = ret.pipe(
        shareReplay()
      )
    }
    

    return this.clockCache

  }

  getIndicator(): Observable<any>{
    if(!this.indicatorCache){
      let ret = this.http.get<any>(`${this.apiURL}/indicator`, this.httpOptions).pipe(
        map(response => response)
      );
      this.indicatorCache = ret.pipe(
        shareReplay()
      )
    }
    

    return this.indicatorCache
  }

  handleError(error: HttpErrorResponse) {
    // Return an observable with a user-facing error message.
    let message = error.message
    if(message.includes("0 Unknown Error")){
      message = "You probably need to enable CORS with an extension"
    }

    return of(({error: message} as any as JSON))
  }
}
