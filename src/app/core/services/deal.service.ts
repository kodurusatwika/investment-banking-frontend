import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateDeal,Deal,AddNote } from '../models/deal.model';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  private apiUrl = 'http://localhost:8080/api/deals';
  
  constructor(private http: HttpClient) {}
  
  createDeal(deal: CreateDeal): Observable<Deal> {
    return this.http.post<Deal>(this.apiUrl, deal);
  }
  
  getDeals(filters?: {
    clientName?: string;
    dealType?: string;
    sector?: string;
    stage?: string;
  }): Observable<Deal[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    return this.http.get<Deal[]>(this.apiUrl, { params });
  }
  
  getDealById(id: number): Observable<Deal> {
    return this.http.get<Deal>(`${this.apiUrl}/${id}`);
  }
  
  updateDeal(id: number, deal: CreateDeal): Observable<Deal> {
    return this.http.put<Deal>(`${this.apiUrl}/${id}`, deal);
  }
  
  updateDealStage(id: number, stage: string): Observable<Deal> {
    return this.http.patch<Deal>(`${this.apiUrl}/${id}/stage?stage=${stage}`, {});
  }
  
  updateDealValue(id: number, value: number): Observable<Deal> {
    return this.http.patch<Deal>(`${this.apiUrl}/${id}/value?dealValue=${value}`, {});
  }
  
  addNote(id: number, note: AddNote): Observable<Deal> {
    return this.http.post<Deal>(`${this.apiUrl}/${id}/notes`, note);
  }
  
  deleteDeal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}