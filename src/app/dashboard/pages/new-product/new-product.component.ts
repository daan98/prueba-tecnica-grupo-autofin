import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

// Archivos creados manualmente
import { DashboardService } from '../../services/dashboard.service';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { ProductInterface } from '../../interfaces';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  providers: [ MessageService ],
  templateUrl: './new-product.component.html',
  styles: ``
})
export class NewProductComponent implements OnInit {
  
  private dashboardService                         = inject( DashboardService );
  private router                                   = inject( Router );
  private messageService                           = inject( MessageService );
  public  isLoading                                = signal<boolean>( false )
  public  product                                  = signal<ProductInterface>( {id: 0, nombre: 'Null', descripcion: 'Null', precio: 0.0} );/* REVISAR UTILIDAD */
  public  keys                 : Array<string>     = [];
  public  currentProductId     : number            = 0;
  public  productForm          : FormGroup         = new FormGroup({
    id:              new FormControl<number>(0),
    precio:          new FormControl<number>(0),
    nombre:          new FormControl<string>(''),
    descripcion:     new FormControl<string>('')
  });


  ngOnInit(): void {
    this.currentProductId = Number( this.router.url.split('/')[3] );
    if(this.currentProductId) {
      this.retrieveSingleProduct()
    }
  }

  private retrieveSingleProduct() : void {
    this.isLoading.set( true );

    this.dashboardService.getSingleProduct(this.currentProductId).subscribe({
      next: (foundProduct : ProductInterface) => {
        if(foundProduct.id) {
          this.product.update(currentValue => foundProduct);
          this.isLoading.set(false);
          this.productForm.reset(foundProduct);
          return;
        }

        // La respuesta viene vacia
        this.setToastMessage("info", "Inexistente", "No existe el producto.");
        this.isLoading.set( false );
      },
      error: (err : any) => {
        console.log("Error al intentar obtener productos: ", err);
        this.setToastMessage("error", "Error", "No sé escontro el producto.");
        this.isLoading.set( false );
      }
    });
  }

  public updateProduct() : void {
    this.isLoading.set( true );

    this.dashboardService.updateProduct(this.product().id, this.productForm.value).subscribe({
      next: (productList) => {
        if (productList.length > 0) {
          this.setToastMessage("success", "Actualizado", "Producto actulizado exitosamente.");

          setTimeout(() => {
            this.isLoading.set( false );
            this.router.navigateByUrl('/dashboard/products');
          }, 4500);

          return;
        }

        this.setToastMessage("info", "Revisar", "Por favor, contacte al equipo de TI.");
        this.isLoading.set( false );
      },
      error: (err : any) => {
        console.log('Hubo un error al actualizar el producto: ', err);
        this.setToastMessage("error", "Error", "No se pudo actualizar el producto.");
        this.isLoading.set( false );
      }
    });
  }

  public deleteProduct() : void {    
    this.isLoading.set( true );

    this.dashboardService.deleteProduct(this.product().id).subscribe({
      next: (productList) => {
        if (productList.length > 0) {
          this.setToastMessage("success", "Eliminado", "Producto eliminado exitosamente.");

          setTimeout(() => {
            this.isLoading.set( false );
            this.router.navigateByUrl('/dashboard/products');
          }, 4500);

          return;
        }

        this.setToastMessage("info", "Revisar", "Por favor, contacte al equipo de TI.");
        this.isLoading.set( false );
      },
      error: (err : any) => {
        console.log('Hubo un error al eliminar el producto: ', err);
        this.setToastMessage("error", "Error", "No se pudo eliminar el producto.")
        this.isLoading.set( false );
      }
    });
  }

  public createProduct() : void {
    this.isLoading.set( true );

    this.dashboardService.createProduct(this.productForm.value).subscribe({
      next: (productList) => {
        if (productList.length > 0) {
          this.setToastMessage("success", "Creado", "Producto creado exitosamente.");

          setTimeout(() => {
            this.isLoading.set( false );
            this.router.navigateByUrl('/dashboard/products');
          }, 4500);
          return;
        }

        this.setToastMessage("info", "Revisar", "Por favor, contacte al equipo de TI.");
        this.isLoading.set( false );
      },
      error: (err : any) => {
        console.log('Hubo un error al cerar el producto: ', err);
        this.setToastMessage("error", "Error", "No se pudo crear el producto.");
        this.isLoading.set( false );
      }
    });
  }

  private setToastMessage(severity: "error" | "info" | "success" | "warn", summary : string, detail  : string) : void {
    this.messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
