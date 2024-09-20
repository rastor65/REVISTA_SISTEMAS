import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  form: FormGroup;
  blockSpecial: RegExp = /^[a-zA-Z0-9 ]*$/;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.blockSpecial)]]
    });
  }

  ngOnInit(): void {
  }

  crear() {
    if (this.form && this.form.valid) { // Verificación de nulidad para this.form
      const nuevoRol = {
        //nombre: this.form.get('nombre').value
      };
      // Aquí colocas la lógica para guardar el nuevo rol en tu backend o servicio
    }
  }
}
