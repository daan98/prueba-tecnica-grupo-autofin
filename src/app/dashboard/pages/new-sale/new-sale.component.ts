import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

// Archivos creados manualmente
import { ClientInterface, ProductInterface, SaleDetailInterface, SaleInterface, SingleSaleDetailInterface } from '../../interfaces';
import { DashboardService } from '../../services/dashboard.service';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [
    PrimeNgModule,
    ReactiveFormsModule,
    DecimalPipe,
  ],
  templateUrl: './new-sale.component.html',
  styles: ``,
  providers: [ MessageService ]
})
export class NewSaleComponent implements OnInit{

  private dashboardService                         = inject( DashboardService );
  private router                                   = inject( Router );
  private messageService                           = inject( MessageService );
  public  isLoading                                = signal<boolean>( false )
  public  sales                                    = signal<SaleInterface[]>([]);/* REVISAR UTILIDAD */
  public  saleDetails                              = signal<SaleDetailInterface[]>([]);/* REVISAR UTILIDAD */
  public  clients                                  = signal<ClientInterface[]>([]);
  public  products                                 = signal<ProductInterface[]>([]);
  public  singleSalesDetails                       = signal<SingleSaleDetailInterface[]>([]);
  public  totalSale : number                       = 0;
  public  keys                 : Array<string>     = [];
  public  currentSaleId        : number            = 0;
  /* public  saleForm             : FormGroup         = new FormGroup({
    id: new FormControl<number>(0),
    total: new FormControl<number>(0),
    idClientes: new FormControl<number>(0),
  });
  public  saleDetailForm       : FormGroup         = new FormGroup({
    id:                      new FormControl<number>(0),
    precio:                  new FormControl<number>(0),
    cantidad:                new FormControl<number>(0),
    total:                   new FormControl<number>(0),
    idVentasEncabezado:      new FormControl<number>(0),
    idProducto:              new FormControl<number>(0)
  }); */
  /* CAMPOS PARA FORMULARIO:
  * Cliente
  * Producto
  * Cantidad
  * Precio unitario (deshabilitado se pondra valor desde código)
  * Total (deshabilitado se pondra valor desde código)
   */
  public myForm : FormGroup = new FormGroup({
    cliente: new FormControl(null, [ Validators.required ]), // {id: 0, nombre: ''}
    producto: new FormControl(null, [ Validators.required ]), // {id: 0, nombre: '', descripcion: '', precio: 0}
    cantidad: new FormControl(null, [ Validators.required ]),
    precio: new FormControl(null, [ Validators.required ]),
    total: new FormControl(null, [ Validators.required ])
  });


  ngOnInit(): void {
    /* console.log("is form valid: ", this.myForm); */
    if (this.checkRoute() == "/dashboard/new-sale") {
      this.myForm.controls['precio'].disable();
      this.myForm.controls['total'].disable();
      this.retriveAllClients();
      this.retriveAllProducts();
      return;
    }

    this.retriveSingleClient()
    this.retriveSingleSale();
    this.retriveSingleProduct()
  }

  private retriveAllClients() : void {
    this.isLoading.set(true);

    this.dashboardService.getAllClients().subscribe({
      next: (clientList : ClientInterface[]) => {
        if(clientList.length > 0) {
          this.clients.update( currentClients => clientList );
          this.isLoading.set( false );
          return;
        }

        // La respuesta viene vacia
        this.setToastMessage("info", "Revisar", "Por favor, contacte al equipo de TI.");
        this.isLoading.set( false );
      },
      error: (err : any) => {
        console.log("Error al intentar obtener clientes: ", err);
        this.setToastMessage("error", "Error", "No se pudo obtener los clientes.");
        this.isLoading.set( false );
      }
    })
  }

  private retriveSingleClient() : void {}
  
  private retriveAllProducts() : void {
    this.isLoading.set(true);

    this.dashboardService.getAllProducts().subscribe({
      next: (productList : ProductInterface[]) => {
        if(productList.length > 0) {
          this.products.update(value => productList);
          this.keys = Object.keys(this.products()[0]);
          this.isLoading.set(false);
          return;
        }

        this.isLoading.set( false );
        /* this.messsage = "No hay productos. Empiece agreguando algunos." */
      },
      error: (err : any) => {
        console.log("Error al intentar obtener productos: ", err);
        /* this.messsage = "Hubo un error. Vuelva a intentarlo." */
        this.products.set([]);
        this.isLoading.set(false);
      }
    })
  }

  private retriveSingleSale() : void {}
  
  private retriveSingleProduct() : void {}
  
  public createSale() : void {
    /* console.log('myForm: ', this.myForm); */
    this.isLoading.set( true );
    let saleBody : SaleInterface;

    console.log("client: ", this.myForm.get('cliente'));
    saleBody = {
      clientId: this.myForm.get('cliente')?.value.id,
      total: this.totalSale
    }

    this.dashboardService.createSale(saleBody).subscribe({
      next: (saleCreated : SaleInterface[]) => {
        if (saleCreated.length > 0) {
          /* let saleDetailBody : SaleDetailInterface = {
            saleId: saleCreated[saleCreated.length - 1].clientId,
            productId: this.myForm.get('producto')?.value.id,

          } */
          let createdSaleId = saleCreated[saleCreated.length - 1].clientId;
          this.createSaleDetail(createdSaleId);
          return;
        }
      },
      error: () => {}
    });
  }

  public addSale() : void {
    /* 
    * producto : ProductInterface,
    * cantidad : number,
    * precio   : number,
    * total    : number
     */

    let singleSalesDetailBody : SingleSaleDetailInterface = {
      producto: this.myForm.get('producto')?.value,
      cantidad: this.myForm.get('cantidad')?.value,
      precio: this.myForm.get('precio')?.value,
      total: this.myForm.get('total')?.value,
    };

    this.singleSalesDetails().push(singleSalesDetailBody);

    this.singleSalesDetails().forEach(sale => {
      this.totalSale += sale.total;
    });
    /* console.log("singleSalesDetails: ", this.singleSalesDetails()); */
  }

  public async createSaleDetail(idventasEncabezado : number) : Promise<void> {
    this.isLoading.set( true );

    let errorOnCreatingDetail = false;

    this.singleSalesDetails().forEach(async saleDetail => {
      if (errorOnCreatingDetail) {
        return;
      }
      
      let saleDetailBody : SaleDetailInterface = {
        productId:     saleDetail.producto.id,
        precio:        saleDetail.producto.precio,
        cantidad:      saleDetail.cantidad,
        total:         saleDetail.total,
        idventasEncabezado,
      };

      await this.dashboardService.createSaleDetail(saleDetailBody).subscribe({
        next: (saleDetailCreated : SaleDetailInterface[]) => {},
        error: (err : any) => {
          console.log("Hubo un error al registrar el detalle de venta: ", err);
          this.setToastMessage("error", "Error", "No se pudo registrar el detalle de venta.");
          errorOnCreatingDetail = true;
          this.isLoading.set(false);
        }
      });
    });

    this.setToastMessage("success", "Éxito", "Todos los detalles de venta se crearon exitosamente.");
    setTimeout(() => {
      this.isLoading.set( false );
      this.router.navigateByUrl('/dashboard/sales-detail');
    }, 4500);
  }

  public checkRoute() : string {
    return this.router.url;
  }

  public selectedClient() : void {
    this.myForm.controls['cliente'].disable();
  }

  public selectedProduct() {
    this.myForm.get('precio')?.patchValue(this.myForm.value.producto.precio);
    /* this.myForm.value.precio = this.myForm.value.producto.precio; */
    this.myForm.get('cantidad')?.patchValue(null)
    this.myForm.get('total')?.patchValue(null)
    /* console.log('this.myForm: ', this.myForm); */
  }

  public getTotal() : void {
    /* console.log('getTotal'); */
    if (this.myForm.get("producto")?.value.precio && this.myForm.get("cantidad")?.value) {
      let total : number = this.myForm.value.producto.precio * this.myForm.value.cantidad;
      this.myForm.get('total')?.patchValue(total);
      return;
    }

    this.myForm.get('total')?.patchValue(null);
  }

  private setToastMessage(severity: "error" | "info" | "success" | "warn", summary : string, detail  : string) : void {
    this.messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
