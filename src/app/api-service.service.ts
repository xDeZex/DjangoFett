import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput, firstValueFrom, of, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { ReturnStatement } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  apiURL = 'http://localhost:8000/api/v1'

  httpOptions = {
    headers: new HttpHeaders({
    })
  }

  clockCache: any | null = null;
  indicatorCache: any | null = null;

  constructor(private http: HttpClient,) { }


  getClock(): Observable<any>{

    if(this.clockCache)
      return of(this.clockCache);

    let ret = this.http.get<any>(`${this.apiURL}/index`, this.httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );

    return ret

  }

  getIndicator(): Observable<any>{

    if(this.indicatorCache)
      return of(this.indicatorCache);

    let ret = this.http.get<any>(`${this.apiURL}/indicator`, this.httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );

    return ret
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
