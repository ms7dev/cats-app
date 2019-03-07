import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {delay} from 'rxjs/operators';

@Injectable()
export class CatsService {

  private rootUrl = 'https://api.thecatapi.com/v1/breeds/';

  constructor(private httpService: HttpClient) { }

  getCats(term: string) {
    const url = term ? `${this.rootUrl}search/` : this.rootUrl;
    const params = term ? {params: {q: term}} : undefined;
    return this.httpService.get(url, params).pipe(
        delay(Math.random() * 5000)
    );
  }
}
