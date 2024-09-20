import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserLoginI } from 'src/app/models/authorization/usr_User';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent  {
  dataLogin: UserLoginI = {
    username: 'anonimo',
    email: 'anonimo@uniguajira.edu.co',
    password: '12345678l'
  }

  constructor( private authService: AuthService) {
    this.authService.login(this.dataLogin)
  }

  ngOnInit(): void {
    
  }
  
}
