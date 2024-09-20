import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PqrsService } from 'src/app/core/services/dashboard/pqrs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  API_URI = environment.API_URI;
  public token: any;
  public form = this.fb.group({
    tipo : ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private pqrsService: PqrsService,
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }

  onSubmit(){
   try {
    this.pqrsService.createPqrs(`${this.API_URI}/pqrs/tipo/create/`, this.form.value, this.token).subscribe( respuesta => {
      this.form.reset();
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Creado correctamente !!!'})
    });
   } catch (error) {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Hubo un problema'})
   }
  }

}
