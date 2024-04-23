import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { PrimeNgModule } from './prime-ng/prime-ng.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor( private primengConfig: PrimeNGConfig ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
