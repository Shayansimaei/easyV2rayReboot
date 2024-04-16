import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  async getData(url: string): Promise<Object> {
    return await this.http.get(url);
  }

  async postData(url: string, data: any): Promise<Object> {
    return await this.http.post(url, data);
  }

  putData(url: string, data: any) {
    return this.http.put(url, data);
  }

  deleteData(url: string) {
    return this.http.delete(url);
  }
}
