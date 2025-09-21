import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Product } from '../../shared/models/inventory/product.model';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  getAllProducts(categoryId?: string, minPrice?: number, maxPrice?: number, page: number = 1, limit: number = 10): Observable<{ totalCount: number, page: number, limit: number, data: Product[] }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (categoryId) params = params.set('categoryId', categoryId);
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());

    return this.http.get<{ totalCount: number, page: number, limit: number, data: Product[] }>(this.apiUrl, { params });
  }

  searchProducts(query: string): Observable<Product[]> {
    let params = new HttpParams().set('q', query);
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}