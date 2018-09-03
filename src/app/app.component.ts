import { Component, OnInit } from '@angular/core';
import { UsuarioServices } from './servicios/usuarioServices.services';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UsuarioServices]

})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    //redirigir si el usuario esta loggeado
    //this._userService.redirigirSiEstaIdentificado(this._router);
  }
  constructor(private _userService: UsuarioServices,private _router: Router,) {

  }

}
