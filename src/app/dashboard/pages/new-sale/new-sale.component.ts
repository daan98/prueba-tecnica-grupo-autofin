import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

// Archivos creados manualmente
import { ClientInterface, SaleDetailInterface, SaleInterface } from '../../interfaces';
import { DashboardService } from '../../services/dashboard.service';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';

@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [
    PrimeNgModule,
    ReactiveFormsModule,
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
  public  sale                                     = signal<SaleInterface>( {id: 0, clientId: 0, total: 0} );/* REVISAR UTILIDAD */
  public  saleDetail                               = signal<SaleDetailInterface>({ id: 0, saleId: 0,productId: 0, price: 0, quantity: 0, total: 0 });/* REVISAR UTILIDAD */
  public  clients                                  = signal<ClientInterface[]>([]);
  public  keys                 : Array<string>     = [];
  public  currentSaleId        : number            = 0;
  public  actualRoute          : string            = '';
  public  saleForm             : FormGroup         = new FormGroup({
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
  });

  ngOnInit(): void {
    this.checkRoute();
    this.retrieveClients();


    this.retrieveSingleClient()
    this.retrieveSingleSale();
    this.retrieveSingleProduct()
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

  public createSale() : void {}

  private retrieveSingleClient() : void {}

  private retrieveSingleSale() : void {}

  private retrieveSingleProduct() : void {}

  private checkRoute() : void {
    this.actualRoute = this.router.url;
  }
  private setToastMessage(severity: "error" | "info" | "success" | "warn", summary : string, detail  : string) : void {
    this.messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
