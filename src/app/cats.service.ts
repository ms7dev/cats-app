import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatsService {

  private rootUrl = 'https://api.thecatapi.com/v1/breeds/search';

  constructor(private httpService: HttpClient) { }

  getCats(term: string) {
    return this.httpService.get(this.rootUrl, {params: {q: term}});
  }
}
