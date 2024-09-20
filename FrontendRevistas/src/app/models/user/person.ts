
export interface DocumentType {
  id: number;
  createdAt: string;
  updateAt: string;
  name: string;
  status: boolean;
}

export interface GenderType {
  id: number;
  name: string;
  status: boolean;
}

export interface Person {
  id: number;
  user?: number;
  createdAt: string;
  updateAt: string;
  nombres: string;
  apellidos: string;
  identificacion: string;
  pais: string;
  // document_type: number;
  orcid: string;
  url_orcid: string;
  status: boolean;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  avatar: string;
}

export interface Person_request {
  ok: boolean;
  message: string;
  data: Person[];
  request_id: "";
}

export interface NivelFormacion {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  email: string;
  username: string;
  password: string;
  avatar: string | null;
  roles: number[];
}

export interface Rol {
  id: number;
  createdAt: string;
  updateAt: string;
  name: string;
  status: boolean;
  users: number[];
  resources: number[];
}

export interface UserRole {
  id: number;
  status: boolean;
  userId: {
    id: number;
    last_login: string | null;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    email: string;
    password: string;
    resetToken: string | null;
    avatar: string | null;
    groups: number[];
    user_permissions: number[];
    roles: number[];
  };
  rolesId: {
    id: number;
    createdAt: string;
    updateAt: string;
    name: string;
    status: boolean;
    users: number[];
    resources: number[];
  };
}

export interface Formacion {
  id: number;
  nombre: string;
  fecha_grado: string | null;
  cert_grado: File | null; 
  nombre_institucion: string;
  status: boolean;
  nivel_formacion: number;
  autor: number | undefined;
}