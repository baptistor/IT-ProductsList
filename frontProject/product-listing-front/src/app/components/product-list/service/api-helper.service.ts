import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ApiHelperService {
    private readonly base_url: string = "http://localhost:8080";
    constructor(private http: HttpClient) { }

  public get({
    endpoint,
    queryParams = {},
  }: {
    endpoint: string;
    queryParams?: any;
  }): Observable<any> {
    return this.request({ endpoint, method: 'GET', queryParams });
  }

  public request({
    endpoint,
    method = 'GET',
    data = {},
    queryParams = {},
  }: {
    endpoint: string;
    method?: string;
    data?: object;
    queryParams?: any;
  }): Observable<any> {
    const methodWanted = method.toLowerCase();

    const url = this.base_url + endpoint;

    const requestOptions = {
      params: queryParams,
    };


    let req: Observable<any>;
    if (methodWanted === 'get') {
      req = this.http.get(url, { ...requestOptions, observe: 'response' });
    }

    else {
      throw new Error(`error calling ${url} with method ${methodWanted}`);
    }

    return req;
  }
}

