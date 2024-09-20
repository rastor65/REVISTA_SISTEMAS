import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  public personas: any[] = [];
  public roles: any[] = [];
  public users: any[] = [];
  public searchValue: string = '';
  public filterOptions: string[] = [];
  public globalFilterFields: string[] = [
    'id',
    'userId.first_name',
    'userId.last_name',
    'userId.email',
    'userId.username',
    'rolesId.name'
  ];


  @ViewChild('dt') dt: Table | undefined;

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.getUsuariosRoles();
    this.getUsuarios();
    this.getUsers();
    this.getroles();
  }

  getroles(){
    this.usuariosService.getRoles().subscribe(
      (response: any) => {
        this.filterOptions = response;
      },
      (error: any) =>{
        console.error(error);
      }
    )
  }

  getUsuarios(){
    this.usuariosService.getAllUsuarios().subscribe(
      (response: any) => {
        this.personas= response;
      },
      (error: any) => {
        console.error(error);
      }
    )
  }

  getUsers(){
    this.usuariosService.getUsers().subscribe(
      (response: any) => {
        this.users= response;
      },
      (error: any) => {
        console.error(error);
      }
    )
  }

  getUsuariosRoles(): void {
    this.usuariosService.getAllRoles().subscribe(
      (response: any) => {
        this.roles = response;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  filterByRole(role: string): void {
    if (role === 'Todos') {
      this.dt?.filter(null, 'rolesId.name', 'equals');
    } else {
      this.dt?.filter(role, 'rolesId.name', 'equals');
    }
  }

  filterTable() {
    if (this.dt) {
      this.dt.filterGlobal(this.searchValue, 'contains');
    }
  }

}
