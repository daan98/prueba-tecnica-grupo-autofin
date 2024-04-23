import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { ProductInterface } from '../../interfaces';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    PrimeNgModule,
  ],
  templateUrl: './product-list.component.html',
  styles: ``
})
export class ProductListComponent implements OnInit {

  private dashboardService                         = inject( DashboardService );
  private router                                   = inject( Router );
  public  isLoading                                = signal<boolean>(false);
  public  products                                 = signal<ProductInterface[]>([]);
  public  keys                 : Array<string>     = [];
  public  messsage             : string            = "";

  ngOnInit(): void {
    this.retriveAllProducts();
  }

  private retriveAllProducts() : void {
    this.isLoading.set(true);

    this.dashboardService.getAllProducts().subscribe({
      next: (productList : ProductInterface[]) => {
        if(productList.length > 0) {
          this.products.update(value => productList);
          this.keys = Object.keys(this.products()[0]);
          this.messsage = "";
          this.isLoading.set(false);
          return;
        }

        this.isLoading.set( false );
        this.messsage = "No hay productos. Empiece agreguando algunos."
      },
      error: (err : any) => {
        console.log("Error al intentar obtener productos: ", err);
        this.messsage = "Hubo un error. Vuelva a intentarlo."
        this.products.set([]);
        this.isLoading.set(false);
      }
    })
  }

  public editProduct(product : ProductInterface) : void {
    this.router.navigateByUrl(`/dashboard/edit-product/${product.id}`);
  }
}
