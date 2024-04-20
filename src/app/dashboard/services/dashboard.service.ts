import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientInterface, ProductInterface, SaleDetailInterface, SaleInterface } from '../interfaces';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { AppBackUrlEnum } from '../enum';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl     = environment.baseUrl;
  private http        = inject( HttpClient );

  constructor() { }

  /* TABLE "Productos" ENDPOINTS */
  public getAllProducts() : Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${this.baseUrl}${AppBackUrlEnum.products}`);
  }

  public getSingleProduct(id : number) : Observable<ProductInterface> {
    return this.http.get<ProductInterface>(`${this.baseUrl}${AppBackUrlEnum.products}/${id}`);
  }

  public createProduct(product : ProductInterface) : Observable<ProductInterface[]> {
    return this.http.post<ProductInterface[]>(`${this.baseUrl}${AppBackUrlEnum.products}`, product)
  }

  public updateProduct(id : number, product : ProductInterface) : Observable<ProductInterface[]> {
    return this.http.put<ProductInterface[]>(`${this.baseUrl}${AppBackUrlEnum.products}/${id}`, product);
  }

  public deleteProduct(id: number) : Observable<ProductInterface[]> {
    return this.http.delete<ProductInterface[]>(`${this.baseUrl}${AppBackUrlEnum.products}/${id}`);
  }

  /* TABLE "Clientes" ENDPOINTS */
  public getAllClients() : Observable<ClientInterface[]> {
    return this.http.get<ClientInterface[]>(`${this.baseUrl}${AppBackUrlEnum.clients}`);
  }

  public getSingleClient(id : number) : Observable<ClientInterface> {
    return this.http.get<ClientInterface>(`${this.baseUrl}${AppBackUrlEnum.clients}/${id}`);
  }

  /* TABLE "Ventas" ENDPOINTS */
  public getAllSales() : Observable<SaleInterface[]> {
    return this.http.get<SaleInterface[]>(`${this.baseUrl}${AppBackUrlEnum.sales}`);
  }

  public getSingleSale(id : number) : Observable<SaleInterface> {
    return this.http.get<SaleInterface>(`${this.baseUrl}${AppBackUrlEnum.sales}/${id}`);
  }

  public createSale(sale : SaleInterface) : Observable<SaleInterface[]> {
    return this.http.post<SaleInterface[]>(`${this.baseUrl}${AppBackUrlEnum.sales}`, sale)
  }

  /* TABLE "VentasDetalle" ENDPOINTS */
  public getAllSalesDetail() : Observable<SaleDetailInterface[]> {
    return this.http.get<SaleDetailInterface[]>(`${this.baseUrl}${AppBackUrlEnum.salesDetail}`);
  }

  public getSingleSaleDetail(id : number) : Observable<SaleDetailInterface> {
    return this.http.get<SaleDetailInterface>(`${this.baseUrl}${AppBackUrlEnum.salesDetail}/${id}`);
  }

  public createSaleDetail(saleDetails : SaleDetailInterface) : Observable<SaleDetailInterface[]> {
    return this.http.post<SaleDetailInterface[]>(`${this.baseUrl}${AppBackUrlEnum.salesDetail}`, saleDetails)
  }
}
