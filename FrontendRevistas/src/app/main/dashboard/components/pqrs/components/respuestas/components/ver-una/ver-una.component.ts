import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PqrsService } from 'src/app/core/services/dashboard/pqrs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver-una',
  templateUrl: './ver-una.component.html',
  styleUrls: ['./ver-una.component.css']
})
export class VerUnaComponent implements OnInit {

  API_URI = environment.API_URI;

  public token: any;
  public data: any;
  public id: any = '';
  public form = this.fb.group({
    "anexo": ['', Validators.required],
    "pqrs": this.id,
    "descripcion": ['', Validators.required],
  })

  constructor(
    private pqrsService: PqrsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerRespuestas();
  }

  submit(){
    try {
      this.pqrsService.createPqrs(`${ this.API_URI}/pqrs/respuesta/create/`, this.form.value, this.token).subscribe( r => {
        this.form.reset();
        // this.traerRespuestas();
        return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Creado correctamente'})
      })
    } catch (error) {
      console.log(error)
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo en error'})
    }
  }


  traerRespuestas() {
    // this.data = [];

    this.route.queryParams.subscribe((params: any) => {
      this.id = params.id;
      try {
        this.pqrsService.getAllPqrs(`${this.API_URI}/pqrs/respuesta/pqrs/${params.id}/`, this.token).subscribe(r => {
          this.data = r.data.results;
          // console.log(r)
        })
      } catch (error) {
        console.log(error)
      }
    }
    );
  }

}
