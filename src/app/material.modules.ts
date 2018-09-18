//Modulo de componentes y modulos de angular material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkTableModule } from '@angular/cdk/table';


import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,

} from '@angular/material';
import { NgModule } from '@angular/core';
import { TokenGuard } from './servicios/guards/token-guard.guard';
import { VerificaTokenService } from './servicios/verificaToken.service';

const modules = [
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
  MatProgressBarModule,
  MatDialogModule,
  CdkTableModule
];

@NgModule({
  imports: [modules],
  exports: [modules],
  providers: [
    TokenGuard,
    VerificaTokenService
  ]

})
export class MaterialModules { }