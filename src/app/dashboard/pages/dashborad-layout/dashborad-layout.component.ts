import { Component, signal } from '@angular/core';
import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashborad-layout',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './dashborad-layout.component.html',
  styles: ``
})
export class DashboradLayoutComponent {
  public sideBarVisible = signal<boolean>(false);
  public itemsMenu : MenuItem[] | undefined = [
    {
      label: "Ventas",
      icon: "pi pi-dollar",
      tooltip: "Lista de producto",
      tooltipPosition: "bottom",
      items: [
        {
          label: "Registra venta",
          icon: "pi pi-shopping-cart",
          tooltip: "Lista de producto",
          tooltipPosition: "bottom",
          routerLink: "new-sale",
          command: (() => this.showHideSideBar(false))
        },
        {
          label: "Ventas realizadas",
          icon: "pi pi-list-check",
          tooltip: "Ventas realizadas",
          tooltipPosition: "bottom",
          routerLink: "sales-detail",
          command: (() => this.showHideSideBar(false))
        }
      ]
    },
    {
      label: "Productos",
      icon: "pi pi-tag",
      tooltip: "Productos",
      tooltipPosition: "bottom",
      items: [
        {
          label: "Lista de productos",
          icon: "pi pi-tags",
          tooltip: "Lista de productos",
          tooltipPosition: "bottom",
          routerLink: "products",
          command: (() => this.showHideSideBar(false))
        },
        {
          label: "Agregar producto",
          icon: "pi pi-plus",
          tooltip: "Agregar producto",
          tooltipPosition: "bottom",
          routerLink: "new-product",
          command: (() => this.showHideSideBar(false))
        },
      ],
    }
  ]

  public showHideSideBar(actualState : boolean) : void {
    this.sideBarVisible.update(state => actualState);
  }
}
