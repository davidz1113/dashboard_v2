import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-tarifaanimal',
  templateUrl: './tarifaanimal.component.html',
})
export class TarifaanimalComponent implements OnInit {

    url:string;

    constructor(private router: Router){
    }
    
    ngOnInit(): void {
        this.url = this.router.url.substring(15);
    }

}