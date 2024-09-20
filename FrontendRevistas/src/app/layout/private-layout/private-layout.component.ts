import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { valorReloj, XsegundoService } from 'src/app/core/services/reloj/Xsegundo.service';
import { listaMenuI } from 'src/app/models/menu';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { createMenu, listMenu } from 'src/app/consts/menu';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Person, GenderType, DocumentType, User, Usuario, NivelFormacion, Formacion } from 'src/app/models/user/person';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

interface menu {
  label: string,
  data?: string
  expandedIcon: string,
  collapsedIcon: string,
  children?: any[]
}

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.css'],
  providers: [DialogService]
})

export class PrivateLayoutComponent implements OnInit {
  API_URI = environment.API_URI;
  display = false;
  items: MenuItem[] = [];
  items2: MenuItem[] = [];
  userDataLoaded: boolean = false;
  public genderTypes: GenderType[] = [];
  public documentTypes: DocumentType[] = [];
  public isLoggedIn = false;
  public menu1: listaMenuI[] = [];
  public algo: listaMenuI[] = [];
  public publicMenu: listaMenuI[] = [];
  public privateMenu: listaMenuI[] = [];
  public profileImage = '';
  public nombre: string = '';
  public subcribe: any;
  public token: string | null = null;
  public displayMaximizable: boolean = true
  public mostrar: boolean = false;
  public username: string | undefined = undefined
  public password: string | undefined = undefined
  public newProfileImage: File | null = null;
  public files1: menu[] = []
  passwordFieldType: string = 'password';
  passwordFieldIcon: string = 'pi pi-eye';
  datos$: Observable<valorReloj> = this.segundo.getInfoReloj();
  hora?: number = 0;
  minutos?: string = '';
  dia?: string = '';
  fecha?: string = '';
  ampm?: string = '';
  segundos?: string = '';
  public ref1: any;
  public image3: string = '';
  public Dialog: boolean = false;
  public Dialog2: boolean = false;
  private UserId: number = 0
  public mensaje: boolean = false
  enFormacion: boolean = false;
  fileGrado: File | null = null;
  archivoCargado: string | null = null;
  public user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    avatar: '',
  }

  public usuarioCopy: Person | null = null;
  public usuarioId: number | undefined;
  niveles_formacion: NivelFormacion[] = [];
  esEstudiante: boolean = false;

  public usuario: Person = {
    id: 0,
    user: 0,
    createdAt: '',
    orcid: '',
    url_orcid: '',
    updateAt: '',
    nombres: '',
    apellidos: '',
    identificacion: '',
    pais: '',
    status: true,
  };

  public formacion: Formacion = {
    id: 0,
    nombre: '',
    fecha_grado: null,
    cert_grado: null,
    nombre_institucion: '',
    status: true,
    nivel_formacion: 0,
    autor: 0,
  };


  DialogContra: boolean = false;
  formCambioContrasena: FormGroup;

  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private segundo: XsegundoService,
    public dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) {
    this.formCambioContrasena = this.formBuilder.group({
      contrasenaActual: ['', Validators.required],
      nuevaContrasena: ['', Validators.required],
      confirmarContrasena: ['', Validators.required],
    });
  }

  displayDialog: boolean = false;
  imageSource: string = 'assets/PQR.png';
  displayDialog2: boolean = false;

  ngOnInit() {
    this.usuarioId = this.authService.getUserId();
    this.loadUser();
    this.datos$ = this.segundo.getInfoReloj();
    this.datos$.subscribe(x => {
      this.hora = x.hora;
      this.minutos = x.minutos;
      this.dia = x.diadesemana;
      this.fecha = x.diaymes;
      this.ampm = x.ampm;
      this.segundos = x.segundo;
    });
    this.files1 =
      [
        {
          "label": "Pictures",
          "data": "Pictures Folder",
          "expandedIcon": "pi pi-folder-open",
          "collapsedIcon": "pi pi-folder",
          "children": [
            { "label": "barcelona.jpg", "icon": "pi pi-image", "data": "Barcelona Photo" },
            { "label": "logo.jpg", "icon": "pi pi-image", "data": "PrimeFaces Logo" },
            { "label": "primeui.png", "icon": "pi pi-image", "data": "PrimeUI Logo" }]
        },

      ]
    this.verificar();
    this.primengConfig.ripple = true;
    this.items2 = [
      {
        label: 'File',
        items: [{
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: 'Project' },
            { label: 'Other' },
          ]
        },
        { label: 'Open' },
        { label: 'Quit' }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'Delete', icon: 'pi pi-fw pi-trash' },
          { label: 'Refresh', icon: 'pi pi-fw pi-refresh' }
        ]
      }
    ];

    this.items = [
      {
        label: 'Imagen', icon: 'pi pi-user', command: () => {
          this.abrirEditarImagen();
        }
      },
      { separator: true },
      {
        label: 'Editar perfil', icon: 'pi pi-cog', command: () => {
          this.abrirEditarPerfil();
        }
      },
      { separator: true },
      {
        label: 'Contraseña', icon: 'pi pi-key', command: () => {
          this.abrirEditarContra();
        }
      },
      { separator: true },
      {
        label: 'Cerrar Sesion', icon: 'pi pi-power-off', command: () => {
          this.showConfirm();
        }
      },
      { separator: true },
    ];
  }

  openDialog() {
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
  }

  ocultarMenu(boolean: boolean) {
    // this.display=boolean
  }

  setLogin(value: boolean): void {
    this.authService.setLogin(value);
  }

  openDialogResgister(event: Event) {
    event.preventDefault();
  }

  public confirm() {
    this.showSuccess()
    this.displayMaximizable = false
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ingreso exitoso' });
  }

  save(id: string) { }

  openDialogLogin(event: Event) {
    event.preventDefault();
    this.displayMaximizable = true
  }

  cerrarSesion() {
    this.setLogin(false)
    this.authService.logout()
    this.ngOnInit()
    this.router.navigateByUrl('/login')
  }

  showConfirm() {
    this.Dialog = true;
  }

  hideDialog() {
    this.Dialog = false;
  }

  abrirEditarImagen() {
    this.displayDialog2 = true;
  }

  cerrarEditarImagen() {
    this.displayDialog2 = false;
  }

  abrirEditarPerfil() {
    this.loadDropdownData();
    this.loadUserData();
    this.loadFormacionData();
    this.obtenerNiveles();
    this.Dialog2 = true;
    this.usuarioCopy = { ...this.usuario };
  }

  cerrarEditarPerfil() {
    this.Dialog2 = false;
  }

  abrirEditarContra() {
    this.DialogContra = true;
  }

  cerrarEditarContra() {
    this.DialogContra = false;
  }

  public verificar() {
    var token: string | null = localStorage.getItem('token');
    var user: string | null = localStorage.getItem('user');
    var menu: string | null = localStorage.getItem('menu');
    if (token != null && menu != null && user != null) {
      this.showSuccess()
      let userObjeto: any = JSON.parse(user);
      let menuObjeto: any = JSON.parse(menu);
      this.privateMenu = createMenu(menuObjeto) as any;
      //this.privateMenu=createMenu(listMenu) as any;
      this.menu1 = this.privateMenu;

      //this.menu1 = listMenu
      this.nombre = userObjeto.name;

      this.isLoggedIn = true
      this.setLogin(true)
    } else {

      this.isLoggedIn = false
      this.setLogin(false)
      this.menu1 = [];
      //this.menu1 = listMenu

      this.router.navigateByUrl('/login');
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EDITAR DATOS DE USUARIO

  loadUserData(): void {
    if (this.usuarioId !== undefined) {
      this.userService.getPeopleByUserId(this.usuarioId).subscribe(
        people => {
          if (people && people.length > 0) {
            // Accede al primer usuario en el arreglo (en este caso, solo hay uno)
            const firstUser = people[0];
            // Verifica si el ID del usuario logueado es igual al campo 'user' en el registro de Persona
            if (firstUser.user === this.usuarioId) {
              this.usuario = firstUser;
            } else {
              console.error('El ID del usuario logueado no coincide con el campo "user" en el registro de Persona.');
            }
          } else {
            console.error('No se encontraron datos de usuario para el ID proporcionado.');
          }
          this.userDataLoaded = true; // Marcar que los datos del usuario han sido cargados
          this.loadDropdownData();
        },
        error => {
          console.error('Error loading user data:', error);
        }
      );
    }
  }

  loadDropdownData() {
    this.userService.getDocumentTypes().subscribe(
      response => {
        if (response) {
          this.documentTypes = response;
        }
      },
      error => {
        console.error('error al cargar los documentos:', error);
      }
    );

    this.userService.getGenderTypes().subscribe(
      response => {
        if (response) {
          this.genderTypes = response;
        }
      },
      error => {
        console.error('error al cargar los generos:', error);
      }
    );
  }

  guardarDatos() {
    const usuarioActualizado: Person = {
      id: this.usuario.id,
      orcid: this.usuario.orcid,
      url_orcid: this.usuario.url_orcid,
      user: this.usuarioId,
      createdAt: this.usuario.createdAt,
      updateAt: this.usuario.updateAt,
      nombres: this.usuario.nombres,
      apellidos: this.usuario.apellidos,
      identificacion: this.usuario.identificacion,
      pais: this.usuario.pais,
      status: this.usuario.status !== undefined ? this.usuario.status : false
    };


    this.userService.editarUsuario(usuarioActualizado).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Datos basicos guardados', detail: 'Sus datos han sido actualizados exitosamente' });
        this.Dialog2 = false; // Cerrar el diálogo después de guardar
      },
      (error) => {
        console.error('Error al guardar los datos del usuario', error);
        this.messageService.add({ severity: 'error', summary: 'Error al actualizar los datos basicos', detail: 'Todos los campos son requeridos' });
      }
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EDITAR DATOS DE FORMACION

  toggleCampos() {
    this.esEstudiante = !this.esEstudiante;
  }

  obtenerNiveles(): void {
    this.userService.obtenerNivelesFormacion().subscribe(
      (niveles: any[]) => {
        this.niveles_formacion = niveles;
      },
      (error: any) => {
        console.error('Error al obtener los pasos de solicitud', error);
      }
    );
  }

  loadFormacionData() {
    // Obtener los datos de formación del usuario logeado
    this.userService.obtenerFormacionUsuario(this.usuarioId).subscribe(
      (response) => {
        if (response && response.length > 0) {
          // Si se encuentra un registro de formación, cargarlo en el formulario
          this.formacion = response[0];
        }
      },
      (error) => {
        console.error('Error al cargar los datos de formación:', error);
      }
    );
  }

  guardarFormacion() {
    // Comprobar si es una creación o una edición
    if (this.formacion.id === 0) {
      // Es una creación, establecer el autor y status antes de guardar
      this.formacion.autor = this.usuarioId;
      this.formacion.status = true;

      // Crear un objeto FormData
      const formData = new FormData();
      formData.append('nombre_institucion', this.formacion.nombre_institucion || '');
      formData.append('nivel_formacion', (this.formacion.nivel_formacion || 0).toString());
      formData.append('nombre', this.formacion.nombre || '');
      formData.append('fecha_grado', this.formacion.fecha_grado || '');
      formData.append('autor', (this.usuarioId || 0).toString());
      formData.append('status', 'true');
      // Añadir el archivo adjunto a FormData si existe
      if (this.fileGrado) {
        formData.append('cert_grado', this.fileGrado, this.fileGrado.name);
      }

      // Llamar al servicio para crear un registro de formación
      this.userService.crearFormacion(formData).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Datos de formación guardados', detail: 'Sus datos han sido actualizados exitosamente' });
        },
        (error) => {
          console.error('Error al crear la formación:', error);
          this.messageService.add({ severity: 'error', summary: 'Error al actualizar los datos de formación', detail: 'Todos los campos son requeridos' });
        }
      );
    } else {
      // Es una edición, configura los datos y archivo adjunto si corresponde
      this.formacion.cert_grado = this.fileGrado;

      // Crear un objeto FormData
      const formData = new FormData();
      formData.append('nombre_institucion', this.formacion.nombre_institucion || '');
      formData.append('nivel_formacion', (this.formacion.nivel_formacion || 0).toString());
      formData.append('nombre', this.formacion.nombre || '');
      formData.append('fecha_grado', this.formacion.fecha_grado || '');
      formData.append('autor', (this.usuarioId || 0).toString());
      formData.append('status', 'true');
      // Añadir el archivo adjunto a FormData si existe
      if (this.fileGrado) {
        formData.append('cert_grado', this.fileGrado, this.fileGrado.name);
      }

      // Llamar al servicio para editar el registro de formación
      this.userService.editarFormacion(this.formacion.id, formData).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Datos de formación guardados', detail: 'Sus datos han sido actualizados exitosamente' });
        },
        (error) => {
          console.error('Error al actualizar la formación:', error);
          this.messageService.add({ severity: 'error', summary: 'Error al actualizar los datos de formación', detail: 'Todos los campos son requeridos' });
        }
      );
    }
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      this.fileGrado = files[0];
      this.archivoCargado = this.fileGrado.name; // Guarda el nombre del archivo
    } else {
      this.fileGrado = null;
      this.archivoCargado = null; // No hay archivo cargado
    }
  }


  //////////////////////////////IMAGEN DE PERFIL/////////////////////////////////////////

  loadUser() {
    if (!this.usuarioId) {
      console.warn('Usuario no identificado.');
      return;
    }
  
    this.userService.getUserById(this.usuarioId).subscribe({
      next: (User) => {
        this.user = User;
  
        this.profileImage = User.avatar 
          ? `${this.API_URI}/api/user/${this.usuarioId}/descargar/`
          : 'assets/avatars/user.png';
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar los datos del usuario'
        });
      }
    });
  }
  
  guardarImagenPerfil() {
    if (this.usuarioId && this.newProfileImage) {
      this.userService.updateUserProfile(this.usuarioId, this.user, this.newProfileImage).subscribe(
        (data) => {
          this.messageService.add({ severity: 'success', summary: 'Imagen de perfil actualizada', detail: 'La imagen de perfil se ha actualizado correctamente' });

          this.handleNewImage;
          this.cerrarEditarImagen();
        },
        (error) => {
          console.error('Error al actualizar la imagen de perfil:', error);
          this.messageService.add({ severity: 'error', summary: 'Error al actualizar la imagen de perfil', detail: 'Ocurrió un error al actualizar la imagen de perfil' });
        }
      );
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const selectedFile: File = event.target.files[0];

      if (selectedFile) {
        // Actualizar la vista previa de la imagen de perfil
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
        // Asignar el File a newProfileImage
        this.newProfileImage = selectedFile;
      }
    }
  }

  handleNewImage(url: string) {
    this.profileImage = url;
    this.cdr.detectChanges();
  }

  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordFieldIcon = 'pi pi-eye-slash';
    } else {
      this.passwordFieldType = 'password';
      this.passwordFieldIcon = 'pi pi-eye';
    }
  }

  cambiarContrasena() {
    if (this.formCambioContrasena.valid) {
      const currentPassword = this.formCambioContrasena.get('contrasenaActual')?.value;
      const newPassword = this.formCambioContrasena.get('nuevaContrasena')?.value;
      const confirmPassword = this.formCambioContrasena.get('confirmarContrasena')?.value;

      if (newPassword === confirmPassword) {
        if (this.usuarioId !== undefined) {
          this.userService.updatePassword(this.usuarioId, currentPassword, newPassword).subscribe(
            () => {
              this.DialogContra = false;
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña cambiada exitosamente' });
            },
            (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La contraseña actual no es la correcta' });
            }
          );
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El ID de usuario no está definido' });
        }
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Las contraseñas nuevas no coinciden' });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El formulario no es válido' });
    }
  }

}
