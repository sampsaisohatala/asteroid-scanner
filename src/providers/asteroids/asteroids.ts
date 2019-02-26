import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AsteroidsProvider {
  readonly baseUrl: string = 'https://api.nasa.gov/neo/rest/v1/feed?';
  readonly apiKey: string = 'EAvGMfxQwIMnpWUw7WyXzRakdL6QakCQG3z25RHR';

  constructor(public http: HttpClient) {
  }

  public getAllNeoAsteroids(date) {
    return this.http.get(this.baseUrl +
      'start_date=' + date +
      '&end_date=' + date +
      '&api_key=' + this.apiKey
      )
  }
  
}
