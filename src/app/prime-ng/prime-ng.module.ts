import { NgModule } from '@angular/core';

// Componentes
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { AutoFocusModule } from 'primeng/autofocus';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    AnimateOnScrollModule,
    AutoFocusModule,
    BreadcrumbModule,
    ButtonModule,
    ConfirmDialogModule,
    PanelMenuModule,
    SidebarModule,
    TableModule,
    ToastModule,
    TooltipModule,
  ]
})
export class PrimeNgModule { }
