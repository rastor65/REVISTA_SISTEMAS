import { menuI, listaMenuI, opcMenu, hijosI } from '../models/menu'

// menu estatico 

export let listMenu: listaMenuI[] = [
  { "id": 1, "id_padre": 0, "icono": "pi pi-home", "link": "/dashboard", "titulo": "Escritorio" },
  { "id": 2, "id_padre": 1, "icono": "icon", "link": "/dashboard", "titulo": "General" },
  { "id": 3, "id_padre": 2, "icono": "icon", "link": "/dashboard/aspecto_general", "titulo": "Aspectos Generales" },
  { "id": 4, "id_padre": 2, "icono": "icon", "link": "/dashboard/mision", "titulo": "Misión" },
  { "id": 5, "id_padre": 2, "icono": "icon", "link": "/dashboard/vision", "titulo": "Visión" },
  { "id": 9, "id_padre": 1, "icono": "icon", "link": "/dashboard", "titulo": "Detalles" },
  { "id": 10, "id_padre": 9, "icono": "icon", "link": "/dashboard/acercadenosotros", "titulo": "Acerca de Nosotros" },
  { "id": 11, "id_padre": 9, "icono": "icon", "link": "/dashboard/organigrama", "titulo": "Organigrama" },
  { "id": 12, "id_padre": 1, "icono": "icon", "link": "/dashboard", "titulo": "Contacto" },
  { "id": 13, "id_padre": 12, "icono": "icon", "link": "/dashboard/contactos", "titulo": "Enviar Mensaje" },
]

// Menu Dinamico

export const createMenu = (list: listaMenuI[]) => {
  const menuNuevo: menuI = {
    'menu': []
  }
  const nuevopadres: any = []
  const nuevoHijos: any = []

  try {
    list.forEach((ops1: hijosI) => {
      if (ops1.id_padre == 0) {
        nuevopadres.push(ops1)
      } else {
        nuevoHijos.push(ops1)
      }

      nuevopadres.forEach((newP: hijosI) => {
        if (ops1.id_padre == newP.id) {
          if (!newP.menu) {
            Object.defineProperty(newP, 'menu', {
              value: [ops1]
            });
          } else {
            newP.menu.push(ops1)
          }
        }
      });

      nuevoHijos.forEach((newH: hijosI) => {
        if (ops1.id_padre == newH.id) {
          if (!newH.menu) {
            Object.defineProperty(newH, 'menu', {
              value: [ops1]
            });
          } else {
            newH.menu.push(ops1)
          }
        }
      });
    });

    nuevopadres.forEach((main: any) => {
      menuNuevo.menu.push(main)
    });
    return menuNuevo.menu;
  }
  catch (error) {
    console.log(error)
    return [];
  }
}