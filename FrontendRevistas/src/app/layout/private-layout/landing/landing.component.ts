import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [ConfirmationService,MessageService]
})

export class LandingComponent implements OnInit {
  public image3:string='assets/user.png'
  public bandera:boolean=false
  public nombre:string = '';
  private API_URI:string=environment.API_URI


  constructor(
    private userService:UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    var token :string | null= localStorage.getItem('token');
    if(token!=null){
        this.showSuccess()
        this.bandera=true

      }else{
        this.router.navigateByUrl('/login'); 

        this.bandera=false
      }
  }

 public showSuccess() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Ingreso exitoso'});
}
}
