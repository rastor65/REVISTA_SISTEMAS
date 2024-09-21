import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { CambiarPasswordI } from 'src/app/models/authorization/usr_CambiarPassword';
import { UserI } from 'src/app/models/authorization/usr_User';
import { environment } from 'src/environments/environment';
import { Person, NivelFormacion } from 'src/app/models/user/person';
import { User } from 'src/app/models/user/person';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API_URI = environment.API_URI;

  // API path
  base_path = `${this.API_URI}/api/registro/`;
  base_path_post = `${this.API_URI}/api/registro/`;
  base = `${this.API_URI}/api/auth/reset/`;
  base_nivel_formacion = `${this.API_URI}/nivel_f/nivel_formacion/`;
  base_personas = `${this.API_URI}/persons/`;
  base_documentos = `${this.API_URI}/documents/`;
  base_usuario = `${this.API_URI}/api/user/`;
  base_editar_user = `${this.API_URI}/api/user/update/`;
  base_gender = `${this.API_URI}/genders/`;
  base_usuario_rol = `${this.API_URI}/roles/user_roles/create/`;
  base_usuario_formacion = `${this.API_URI}/formacion/formacion/`;

  constructor(private http: HttpClient,) { }

  //lista de usuarios

  ObtenerUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.base_personas}`);
  }

  handleError(res: Response) {
    const statusCode = res.status;
    const body = res;
    const error = {
      statusCode: statusCode,
      error: body
    };
    return throwError(error.error);

  };
  // Get students data
  getUser(): Observable<{ users: UserI[], rolesUsers: any[] }> {
    let token: string | null = localStorage.getItem('token')
    let user: string | null = localStorage.getItem('user')
    if (token != null && user != null) {
      let userObjeto: any = JSON.parse(user);
      return this.http
        .get<{ users: UserI[], rolesUsers: any[] }>(this.base_path, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'x-token': token,
            'user': `${parseInt(userObjeto.id)}`
          })
        })
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    } else {
      return this.http
        .get<{ users: UserI[], rolesUsers: any[] }>(this.base_path)
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    }
  }

  UsersInvestigatorStudentTeacherProyecto(formValue: any): Observable<{ teachers: any[], estudiantes: any[], investigator_collaborators: any[] }> {
    let token: string | null = localStorage.getItem('token')
    let user: string | null = localStorage.getItem('user')
    if (token != null && user != null) {
      let userObjeto: any = JSON.parse(user);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': token,
          'user': `${parseInt(userObjeto.id)}`
        })
      }
      // console.log(httpOptions)
      return this.http
        .post<{ teachers: any[], estudiantes: any[], investigator_collaborators: any[] }>(this.API_URI + '/api/UsersInvestigatorStudentTeacherProyecto/', formValue, httpOptions)
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    } else {
      return this.http
        .post<{ teachers: any[], estudiantes: any[], investigator_collaborators: any[] }>(this.API_URI + '/api/UsersInvestigatorStudentTeacherProyecto/', formValue)
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    }
  }


  getUserteacherinvestigatorstudent2(id: number): Observable<{ users: any[] }> {
    let token: string | null = localStorage.getItem('token')
    let user: string | null = localStorage.getItem('user')
    if (token != null && user != null) {
      let userObjeto: any = JSON.parse(user);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': token,
          'user': `${parseInt(userObjeto.id)}`
        })
      }
      // console.log(httpOptions)
      return this.http
        .get<{ users: any[] }>(this.API_URI + '/api/userteacherinvestigatorstudent2/' + id, httpOptions)
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    } else {
      return this.http
        .get<{ users: any[] }>(this.API_URI + '/api/userteacherinvestigatorstudent/' + id)
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    }
  }
  getUserteacherinvestigatorstudent(): Observable<{ teachers: any[], estudiantes: any[], investigator_collaborators: any[] }> {
    let token: string | null = localStorage.getItem('token')
    let user: string | null = localStorage.getItem('user')
    if (token != null && user != null) {
      let userObjeto: any = JSON.parse(user);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': token,
          'user': `${parseInt(userObjeto.id)}`
        })
      }
      // console.log(httpOptions)
      return this.http
        .get<{ teachers: any[], estudiantes: any[], investigator_collaborators: any[] }>(this.API_URI + '/api/userteacherinvestigatorstudent/', httpOptions)
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    } else {
      return this.http
        .get<{ teachers: any[], estudiantes: any[], investigator_collaborators: any[] }>(this.API_URI + '/api/userteacherinvestigatorstudent/')
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    }
  }


  userteacher(): Observable<{
    users: any[], usersestudiente: any[],
    userseadministrative: any[], usersInvestigador: any[], ResponsibleBodyUser: any[]
  }> {
    let token: string | null = localStorage.getItem('token')
    let user: string | null = localStorage.getItem('user')
    if (token != null && user != null) {
      let userObjeto: any = JSON.parse(user);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': token,
          'user': `${parseInt(userObjeto.id)}`
        })
      }
      // console.log(httpOptions)
      return this.http
        .get<{ users: any[], usersestudiente: any[], userseadministrative: any[], usersInvestigador: any[], ResponsibleBodyUser: any[] }>
        (this.API_URI + '/api/userteacher', httpOptions)
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    } else {
      return this.http
        .get<{ users: any[], usersestudiente: any[], userseadministrative: any[], usersInvestigador: any[], ResponsibleBodyUser: any[] }>(this.API_URI + '/api/userteacher')
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    }
  }

  getUserIdentificacion(cc: string): Observable<{ user: UserI }> {
    return this.http
      .get<{ user: UserI }>(this.base_path + '/cc/' + cc)
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }

  // Get single student data by ID
  getOneUser(id: number): Observable<{ user: UserI, rolesUsers: any[] }> {
    let user: string | null = localStorage.getItem('user')
    let token: string | null = localStorage.getItem('token')
    if (token != null && user != null) {
      let userObjeto: any = JSON.parse(user);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': token,
          'user': `${parseInt(userObjeto.id)}`
        })
      }
      return this.http
        .get<{ user: UserI, rolesUsers: any[] }>(this.base_path + '/' + id, httpOptions)
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    } else {
      return this.http
        .get<{ user: UserI, rolesUsers: any[] }>(this.base_path + '/' + id)
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    }
  }

  createUser(person: any): Observable<any> {
    return this.http.post<any>(this.base_path_post, person).pipe(
      tap((res: any) => {
        if (res) {
        }
      }),
      catchError(this.handleError))
  }

  getUserDetailsByEmail(email: string): Observable<any> {
    return this.http.get<any[]>(this.base_usuario).pipe(
      map((users) => users.find((user) => user.email === email))
    );
  }  


  actualzarContraseña(contraseña: CambiarPasswordI): Observable<{ user: CambiarPasswordI }> {
    let token: string | null = localStorage.getItem('token')
    let userT: string | null = localStorage.getItem('user');
    if (token != null && userT != null) {
      let userObjeto: any = JSON.parse(userT);
      // console.log(userObjeto)
      let algo = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': token,
          'user': `${parseInt(userObjeto.id)}`
        }),
      }
      // console.log(algo)
      return this.http
        .patch<{ user: CambiarPasswordI }>(this.base + '/', JSON.stringify(contraseña), algo
        )
        .pipe(retry(0), catchError(this.handleError))
    } else {
      return this.http
        .patch<{ user: CambiarPasswordI }>(this.base + '/', JSON.stringify(contraseña))
        .pipe(retry(0), catchError(this.handleError))
    }
  }

  updateUser(user: any) {
    let token: string | null = localStorage.getItem('token')
    let userT: string | null = localStorage.getItem('user');
    if (token != null && userT != null) {
      let userObjeto: any = JSON.parse(userT);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': token,
          'user': `${parseInt(userObjeto.id)}`
        })
      }
      // console.log('aqui')
      return this.http.patch(`${this.base_path}/${user.id}`, user, httpOptions)
        .pipe(retry(0), catchError(this.handleError))
    } else {
      return this.http.patch(`${this.base_path}/${user.id}`, user)
        .pipe(retry(0), catchError(this.handleError))
    }

    // return this.http.patch(`${this.base_path}/${user.id}`, user).pipe(
    //   retry(0),
    //   catchError(this.handleError)
    // )

  }


  actualzarAvatar(user: any) {
    let token: string | null = localStorage.getItem('token')
    let userT: string | null = localStorage.getItem('user');
    if (token != null && userT != null) {
      let userObjeto: any = JSON.parse(userT);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': token,
          'user': `${parseInt(userObjeto.id)}`
        })
      }
      // console.log(user)
      return this.http.patch(`${this.API_URI}/api/Avatar/${user.id}`, user, httpOptions).pipe(
        retry(0),
        catchError(this.handleError)
      )
    } else {
      return this.http.patch(`${this.API_URI}/api/Avatar/${user.id}`, user).pipe(
        retry(0),
        catchError(this.handleError)
      )
    }

  }

  eliminarUser(id: number) {
    return this.http.delete(`${this.base_path}/${id}`).pipe(
      retry(0),
      catchError(this.handleError)
    )
  }

  createImagen(UserId: string, file: any): Observable<any> {
    let form = new FormData();//Crea un formulario
    form.append('UserId', UserId);
    form.append('file', file);//Asigna el campo File
    console.log(file, 'FormData')

    // return this.http.post<any>(this.API_URI + '/api/file/FormacionDocente',form).pipe(
    return this.http.post<any>(this.API_URI + '/api/subirImagen', form).pipe(
      tap((res: any) => {
        if (res) {
        }
      }),
      retry(0),
      catchError(this.handleError))
  }

  // lista de usuarios
  private users: any[] = [];

  getUsers(): any[] {
    return this.users;
  }

  addUser(user: any) {
    this.users.push(user);
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  // Nivel de formacion

  crearNivelFormacion(nivel: any): Observable<any> {
    return this.http.post(this.base_nivel_formacion, nivel);
  }

  obtenerNivelesFormacion(): Observable<any> {
    return this.http.get<any[]>(this.base_nivel_formacion);
  }

  editarNivelFormacion(nivel: NivelFormacion): Observable<any> {
    const url = `${this.base_nivel_formacion}${nivel.id}/`;
    return this.http.put(url, nivel);
  }

  eliminarNivelFormacion(nivelId: number) {
    const url = `${this.base_nivel_formacion}${nivelId}`;
    return this.http.delete(url);
  }


  ////////////////////////////////////////////////////////////////////////////////////////
  // Editar persona

  getGenderTypes(): Observable<any[]> {
    return this.http.get<any>(`${this.base_gender}`).pipe(
      map(response => response)
    );
  }

  getDocumentTypes(): Observable<any[]> {
    return this.http.get<any>(`${this.base_documentos}`).pipe(
      map(response => response)
    );
  }

  getUsuarios(): Observable<Person> {
    return this.http.get<Person>(`${this.base_personas}`);
  }

  editarUsuario(usuario: Person): Observable<any> {
    if (usuario.id !== 0) {
      return this.http.put(`${this.base_personas}${usuario.id}/`, usuario);
    } else {
      return this.http.post(this.base_personas, usuario);
    }
  }

  getPeopleByUserId(userId: number): Observable<Person[]> {
    const url = `${this.base_personas}?user=${userId}`;
    
    return this.http.get<Person[]>(url).pipe(
      catchError(error => {
        console.error("Error in getPeopleByUserId:", error);
        throw error;
      }),
      map((people: Person[]) => {
        // Filtrar las personas con el user correcto
        return people.filter(person => person.user === userId);
      })
    );
  }

  obtenerEditores(): Observable<any[]> {
    const url = `${this.base_usuario}`; 
    return this.http.get<any[]>(url);
  }

  getUserById(userId: number): Observable<User> {
    const url = `${this.base_usuario}${userId}`;
    return this.http.get<User>(url);
  }

  // USUARIO IMAGEN
  
  updateUserProfile(userId: number, user: User, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', image);
    formData.append('password', user.password)
    formData.append('username', user.username);
    formData.append('email', user.email);
  
    return this.http.put(`${this.base_editar_user}${userId}/`, formData);
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////USUARIO_X_FORMACION///////////////////////////////////////////////

  obtenerFormacionUsuario(userId: number | undefined): Observable<any[]> {
    if (userId === undefined) {
      // Maneja el caso en el que userId es undefined
      return of([]);
    }

    return this.http.get<any[]>(`${this.base_usuario_formacion}?autor=${userId}`).pipe(
      catchError(error => {
        console.error("Error in obtenerFormacionUsuario:", error);
        throw error;
      }),
      map((formaciones: any[]) => {
        // Filtrar las formaciones con el autor correcto
        return formaciones.filter(formacion => formacion.autor === userId);
      })
    );
  }

  crearFormacion(formacionData: any): Observable<any> {
    return this.http.post<any>(this.base_usuario_formacion, formacionData);
  }

  editarFormacion(formacionId: number, formacionData: any): Observable<any> {
    const url = `${this.base_usuario_formacion}${formacionId}/`;
    return this.http.put<any>(url, formacionData);
  }

  
  ///////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////CAMBIAR CONTRASEÑA///////////////////////////////////////////////

  getUserPassword(userId: number | undefined): Observable<string> {
    const url = `${this.base_usuario}${userId}/`;

    return this.http.get<any>(url).pipe(
      map((user) => {
        return user.password;
      })
    );
  }

  updatePassword(usuarioId: number, currentPassword: string, newPassword: string): Observable<any> {
    const url = `${this.base_usuario}${usuarioId}/change-password/`;
    
    const body = {
      current_password: currentPassword,
      new_password: newPassword
    };

    return this.http.put(url, body);
  }
}