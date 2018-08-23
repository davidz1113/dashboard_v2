//Modulo de componentes y modulos de angular material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,
  
} from '@angular/material';
import { NgModule } from '@angular/core';

const modules =[  
  MatButtonModule,
  MatRippleModule,
  MatInputModule,
  MatTooltipModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSelectModule,
  MatIconModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatProgressBarModule
];

  @NgModule({
    imports: [modules],
    exports:[modules]

  })
  export class MaterialModules{}