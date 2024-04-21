import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}
  baseUrl = environment.baseUrl;
  async getData(url: string): Promise<any> {
    return await this.http.get(this.baseUrl + url).toPromise();
  }

  async postData(url: string, data: any): Promise<any> {
    return await this.http.post(this.baseUrl + url, data).toPromise();
  }

  async putData(url: string, data: any) {
    return this.http.put(this.baseUrl + url, data).toPromise();
  }

  async deleteData(url: string):Promise<any> {
    return this.http.delete(this.baseUrl + url).toPromise();
  }
}
