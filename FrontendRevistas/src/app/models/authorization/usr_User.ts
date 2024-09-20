import { Person } from "../user/person";
import { RoleI } from "./usr_roles";

export interface UserI {
  id?:number;
  username: string;
  email: string;
  fullName: string;
  password?: string;
  Roles?:[
    {
      name:string
    }
  ]
  Person?:Person
  avatar?:string
  People?:Person[]
  UserRoles?:UserRoleI[]
  todo?:string
}
export interface UserRoleI {
  UserId:number,
  RoleId:number,
  Role?:RoleI
}

export interface UserLoginI {
  username: string;
  email: string;
  password: string;
}


export interface UserLoginResponseI {
  ok?:boolean;
  data?: any;
  request_id?:any;
  user?:  UsernameI;
  token: any;
  menu?:any
}

export interface MenuResponseI {
  id:       number;
  id_padre: number;
  icono:    string;
  link:     string;
  titulo:   string;
}

export interface UsernameI {
  username: string;
  fullName?: string;
  id: number;
}