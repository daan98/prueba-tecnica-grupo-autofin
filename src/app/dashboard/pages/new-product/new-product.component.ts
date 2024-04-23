import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ClientInterface, ProductInterface } from '../../interfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { MessageService } from 'primeng/api';

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
  public  product                                  = signal<ProductInterface>( {id: 0, nombre: 'Null', descripcion: 'Null', precio: 0.0} );
  public  clients                                  = signal<ClientInterface[]>([]);
  public  keys                 : Array<string>     = [];
  public  message              : Array<string>     = ['']; /* ELIMINAR */
  public  currentProductId     : number            = 0;
  public  productForm : FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    precio: new FormControl(),
    nombre: new FormControl<string>(''),
    descripcion: new FormControl<string>('')
  })


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
          console.log('product: ', this.product());
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

  private retrieveClients() : void {
    this.isLoading.set(true);

    this.dashboardService.getAllClients().subscribe({
      next: (clientList : ClientInterface[]) => {
        if(clientList.length > 0) {
          this.clients.update( currentClients => clientList );
          this.isLoading.set( false );
          return;
        }

        // La respuesta viene vacia
        this.message.push("No hay clientes.");
        this.isLoading.set( false );
      },
      error: (err : any) => {
        console.log("Error al intentar obtener clientes: ", err);
        this.message.push("");
        this.isLoading.set( false );
      }
    })
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
    /* 
    
     */
  }

  private setToastMessage(severity: string, summary : string, detail  : string) : void {
    this.messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
