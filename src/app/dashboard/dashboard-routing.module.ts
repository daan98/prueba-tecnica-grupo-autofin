import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboradLayoutComponent } from './pages/dashborad-layout/dashborad-layout.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { NewSaleComponent } from './pages/new-sale/new-sale.component';
import { SaleListComponent } from './pages/sale-list/sale-list.component';

const routes: Routes = [
  {
    path: "",
    component: DashboradLayoutComponent,
    children: [
        { path: "products", component: ProductListComponent },
        { path: "new-product", component: NewProductComponent },
        { path: "edit-product/:id", component: NewProductComponent }, // Para editar y eliminar producto
        { path: "new-sale", component: NewSaleComponent },
        { path: "sales-detail", component: SaleListComponent },
        { path: "sale-detail/:id", component: NewSaleComponent }, // Para ver detalle de una venta
        { path: "**", redirectTo: "products" },
    ]
  },
  {
    path: "**",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
