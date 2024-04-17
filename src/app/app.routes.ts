import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { NewSaleComponent } from './pages/new-sale/new-sale.component';
import { SaleListComponent } from './pages/sale-list/sale-list.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: "products", component: ProductListComponent },
            { path: "new-product", component: NewProductComponent },
            { path: "edit-product/:id", component: NewProductComponent }, // Para editar y eliminar producto
            { path: "new-sale", component: NewSaleComponent },
            { path: "sales-detail", component: SaleListComponent },
            { path: "sale-detail/:id", component: NewSaleComponent }, // Para ver detalle de una venta
            { path: "**", redirectTo: "sales-detail" },
        ]
    }
];
