import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ProductInterface } from '../../interfaces';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [],
  templateUrl: './new-product.component.html',
  styles: ``
})
export class NewProductComponent implements OnInit {
  
  private dashboardService                         = inject( DashboardService );
  private router                                   = inject( Router );
  public  isLoading                                = signal<boolean>( false )
  public  product                                  = signal<ProductInterface>( {id: 0, nombre: 'Null', descripcion: 'Null', precio: 0.0} );
  public  keys                 : Array<string>     = [];
  public  message              : string            = '';
  private currentProductId     : number            = 0;

  ngOnInit(): void {
    this.retrieveSingleProduct()
  }

  private retrieveSingleProduct() : void {
    this.isLoading.set( true );
    this.currentProductId = Number( this.router.url.split('/')[3] );
    
    this.dashboardService.getSingleProduct(this.currentProductId).subscribe({
      next: (foundProduct : ProductInterface) => {
        if(foundProduct.id) {
          this.product.update(currentValue => foundProduct);
          this.message = "";
          this.isLoading.set(false);
          console.log(this.product());
          return;
        }

        // La respuesta viene vacia
        this.message = "No existe el producto.";
        this.isLoading.set( false );
      },
      error: (err : any) => {
        console.log("Error al intentar obtener productos: ", err);
        this.message = "No sé escontro el producto.";
        this.isLoading.set( false );
      }
    });
  }
}
