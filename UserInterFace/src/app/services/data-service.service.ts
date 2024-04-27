import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading-service.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient,private loadingService:LoadingService) {}
  baseUrl = environment.baseUrl;
  async getData(url: string,params?:HttpParams): Promise<any> {
    await this.loadingService.openLoading();
    const res= await this.http.get(this.baseUrl + url,{params:params}).toPromise();
    await this.loadingService.closeLoading();
    return res;
  }
  async postData(url: string, data: any): Promise<any> {  
    await this.loadingService.openLoading();  
    const res= await this.http.post(this.baseUrl + url, await this.lowerCaseKeys(data)).toPromise();
    await this.loadingService.closeLoading();
    return res
  }

  async putData(url: string, data: any) {
    await this.loadingService.openLoading();  
    const res= await this.http.put(this.baseUrl + url, data).toPromise();
    await this.loadingService.closeLoading();
    return res;
  }

  async deleteData(url: string):Promise<any> {
    await this.loadingService.openLoading();  
    const res= await this.http.delete(this.baseUrl + url).toPromise();
    await this.loadingService.closeLoading();
    return res;
  }
  async lowerCaseKeys(obj: any) {
    return Object.keys(obj).reduce((acc:any, key) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    }, {});
  }
}
