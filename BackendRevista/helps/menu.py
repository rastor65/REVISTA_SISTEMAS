resources = [

    {
        "path": "/dashboard/admin/",
                "method": "GET",
                "icono": "pi pi-home",
                "id_padre": 0,
                "link": "/dashboard/admin/",
                "titulo": "Admin",
                "items": [
                    {
                        "path": "/dashboard/admin/roles-recursos/",
                        "method": "GET",
                        "icono": "pi pi-home",
                        "link": "/dashboard/admin/roles-recursos/",
                        "titulo": "Roles Y Recursos",
                        "items": [
                            {
                                "path": "/dashboard/admin/roles-recursos/ver-crear/",
                                "method": "POST",
                                "icono": "icon",
                                "link": "/dashboard/admin/roles-recursos/ver-editar/",
                                "titulo": "Ver Editar"
                            },
                            {
                                "path": "/dashboard/admin/roles-recursos/ver/",
                                "method": "GET",
                                "icono": "icon",
                                "link": "/dashboard/admin/roles-recursos/crear/",
                                "titulo": "Crear"
                            }
                        ]
                    },
                    {
                        "path": "/dashboard/admin/roles/",
                        "method": "GET",
                        "icono": "pi pi-user-minus",
                        "link": "/dashboard/admin/roles/",
                        "titulo": "Roles",
                        "items": [
                            {
                                "path": "/dashboard/admin/roles/ver/",
                                "method": "POST",
                                "icono": "icon",
                                "link": "/dashboard/admin/roles/ver/",
                                "titulo": "Ver"
                            }
                        ]
                    },
                ]
    },
    {
        "path": "/dashboard/persona/",
                "method": "GET",
                "icono": "pi pi-user",
                "id_padre": 0,
                "link": "/dashboard/persona/",
                "titulo": "Persona",
                "items": [
                    {
                        "path": "/dashboard/persona/datos-personales/",
                        "method": "GET",
                        "icono": "icon",
                        "link": "/dashboard/persona/datos-personales/",
                        "titulo": "Datos Personales",
                        "items": [
                            {
                                "path": "/dashboard/persona/datos-personales/ver/",
                                "method": "GET",
                                "icono": "icon",
                                "link": "/dashboard/persona/datos-personales/ver/",
                                "titulo": "Ver"
                            },
                            {
                                "path": "/dashboard/persona/datos-personales/crear/",
                                "method": "POST",
                                "icono": "icon",
                                "link": "/dashboard/persona/datos-personales/crear/",
                                "titulo": "Crear"
                            },
                            {
                                "path": "/dashboard/persona/datos-personales/update/",
                                "method": "PUT",
                                "icono": "icon",
                                "link": "/dashboard/persona/datos-personales/update/",
                                "titulo": "Editar"
                            }
                        ]
                    }
                ]
    },
    {
            "id": 12,
            "createdAt": "2023-02-11",
            "updateAt": "2023-02-11",
            "path": "/dashboard/encuestas/",
            "id_padre": 0,
            "method": "GET",
            "icono": "pi pi-book",
            "link": "/dashboard/encuestas/",
            "titulo": "Encuestas",
            "items": [
                {
                    "id": 13,
                    "createdAt": "2023-02-11",
                    "updateAt": "2023-02-11",
                    "path": "/dashboard/encuestas/preguntas/",
                    "id_padre": 12,
                    "method": "GET",
                    "icono": "icon",
                    "link": "/dashboard/encuestas/preguntas/",
                    "titulo": "Preguntas",
                    "items": [
                        {
                            "id": 14,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/encuestas/preguntas/ver/",
                            "id_padre": 13,
                            "method": "GET",
                            "icono": "icon",
                            "link": "/dashboard/encuestas/preguntas/ver/",
                            "titulo": "Ver"
                        },
                        {
                            "id": 15,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/encuestas/preguntas/crear/",
                            "id_padre": 13,
                            "method": "POST",
                            "icono": "icon",
                            "link": "/dashboard/encuestas/preguntas/crear/",
                            "titulo": "Crear"
                        },
                        {
                            "id": 16,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/encuestas/preguntas/editar/",
                            "id_padre": 13,
                            "method": "PUT",
                            "icono": "icon",
                            "link": "/dashboard/encuestas/preguntas/editar/",
                            "titulo": "Editar"
                        },
                        {
                            "id": 31,
                            "createdAt": "2023-02-13",
                            "updateAt": "2023-02-13",
                            "path": "/dashboard/encuestas/preguntas/eliminar",
                            "id_padre": 13,
                            "method": "DELETE",
                            "icono": "icon",
                            "link": "/dashboard/encuestas/preguntas/eliminar",
                            "titulo": "Eliminar"
                        }
                    ]
                },
                {
                    "id": 17,
                    "createdAt": "2023-02-11",
                    "updateAt": "2023-02-11",
                    "path": "/dashboard/encuestas/momentos/",
                    "id_padre": 12,
                    "method": "GET",
                    "icono": "icon",
                    "link": "/dashboard/encuestas/momentos/",
                    "titulo": "Momentos",
                    "items": [
                        {
                            "id": 18,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/encuestas/momentos/ver/",
                            "id_padre": 17,
                            "method": "GET",
                            "icono": "icon",
                            "link": "/dashboard/encuestas/momentos/ver/",
                            "titulo": "Ver"
                        },
                        {
                            "id": 19,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/encuestas/momentos/crear/",
                            "id_padre": 17,
                            "method": "POST",
                            "icono": "icon",
                            "link": "/dashboard/encuestas/momentos/crear/",
                            "titulo": "Crear"
                        },
                        {
                            "id": 20,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/encuestas/momentos/editar/",
                            "id_padre": 17,
                            "method": "PUT",
                            "icono": "icon",
                            "link": "/dashboard/encuestas/momentos/editar/",
                            "titulo": "Editar"
                        },
                        {
                            "id": 32,
                            "createdAt": "2023-02-13",
                            "updateAt": "2023-02-13",
                            "path": "/dashboard/encuestas/momentos/eliminar",
                            "id_padre": 17,
                            "method": "DELETE",
                            "icono": "icon",
                            "link": "/dashboard/encuestas/momentos/eliminar",
                            "titulo": "Eliminar"
                        }
                    ]
                }
            ]
        },
        {
            "id": 21,
            "createdAt": "2023-02-11",
            "updateAt": "2023-02-11",
            "path": "/dashboard/pqrs/",
            "id_padre": 0,
            "method": "GET",
            "icono": "pi pi-folder",
            "link": "/dashboard/pqrs/",
            "titulo": "PQRS",
            "items": [
                {
                    "id": 22,
                    "createdAt": "2023-02-11",
                    "updateAt": "2023-02-11",
                    "path": "/dashboard/pqrs/solicitud/",
                    "id_padre": 21,
                    "method": "GET",
                    "icono": "icon",
                    "link": "/dashboard/pqrs/solicitud/",
                    "titulo": "Solicitud",
                    "items": [
                        {
                            "id": 23,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/pqrs/solicitud/ver/",
                            "id_padre": 22,
                            "method": "GET",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/solicitud/ver/",
                            "titulo": "Ver"
                        },
                        {
                            "id": 24,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/pqrs/solicitud/crear/",
                            "id_padre": 22,
                            "method": "POST",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/solicitud/crear/",
                            "titulo": "Crear"
                        },
                        {
                            "id": 25,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/pqrs/solicitud/editar/",
                            "id_padre": 22,
                            "method": "PUT",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/solicitud/editar/",
                            "titulo": "Editar"
                        },
                        {
                            "id": 30,
                            "createdAt": "2023-02-13",
                            "updateAt": "2023-02-13",
                            "path": "/dashboard/pqrs/solicitud/eliminar/",
                            "id_padre": 22,
                            "method": "DELETE",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/solicitud/eliminar/",
                            "titulo": "Eliminar"
                        }
                    ]
                },
                {
                    "id": 26,
                    "createdAt": "2023-02-11",
                    "updateAt": "2023-02-11",
                    "path": "/dashboard/pqrs/respuesta/",
                    "id_padre": 21,
                    "method": "GET",
                    "icono": "icon",
                    "link": "/dashboard/pqrs/respuesta/",
                    "titulo": "Respuestas",
                    "items": [
                        {
                            "id": 27,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/pqrs/respuesta/ver/",
                            "id_padre": 26,
                            "method": "GET",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/respuesta/ver/",
                            "titulo": "Ver"
                        },
                        {
                            "id": 28,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/pqrs/respuesta/crear/",
                            "id_padre": 26,
                            "method": "POST",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/respuesta/crear/",
                            "titulo": "Crear"
                        },
                        {
                            "id": 29,
                            "createdAt": "2023-02-11",
                            "updateAt": "2023-02-11",
                            "path": "/dashboard/pqrs/respuesta/editar/",
                            "id_padre": 26,
                            "method": "PUT",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/respuesta/editar/",
                            "titulo": "Editar"
                        },
                        {
                            "id": 33,
                            "createdAt": "2023-02-13",
                            "updateAt": "2023-02-13",
                            "path": "/dashboard/pqrs/respuesta/eliminar",
                            "id_padre": 26,
                            "method": "DELETE",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/respuesta/eliminar",
                            "titulo": "Eliminar"
                        }
                    ]
                },
                {
                    "id": 37,
                    "createdAt": "2023-02-15",
                    "updateAt": "2023-02-15",
                    "path": "/dashboard/pqrs/tipo/",
                    "id_padre": 21,
                    "method": "GET",
                    "icono": "icon",
                    "link": "/dashboard/pqrs/tipo/",
                    "titulo": "Tipo de solicitud",
                    "items": [
                        {
                            "id": 38,
                            "createdAt": "2023-02-15",
                            "updateAt": "2023-02-15",
                            "path": "/dashboard/pqrs/tipo/ver/",
                            "id_padre": 37,
                            "method": "GET",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/tipo/ver/",
                            "titulo": "Ver"
                        },
                        {
                            "id": 39,
                            "createdAt": "2023-02-15",
                            "updateAt": "2023-02-15",
                            "path": "/dashboard/pqrs/tipo/crear/",
                            "id_padre": 37,
                            "method": "POST",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/tipo/crear/",
                            "titulo": "Crear"
                        },
                        {
                            "id": 40,
                            "createdAt": "2023-02-15",
                            "updateAt": "2023-02-15",
                            "path": "/dashboard/pqrs/tipo/editar/",
                            "id_padre": 37,
                            "method": "PUT",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/tipo/editar/",
                            "titulo": "Editar"
                        },
                        {
                            "id": 41,
                            "createdAt": "2023-02-15",
                            "updateAt": "2023-02-15",
                            "path": "/dashboard/pqrs/tipo/eliminar/",
                            "id_padre": 37,
                            "method": "DELETE",
                            "icono": "icon",
                            "link": "/dashboard/pqrs/tipo/eliminar/",
                            "titulo": "Eliminar"
                        }
                    ]
                }
            ]
        },
        {
            "id": 34,
            "createdAt": "2023-02-13",
            "updateAt": "2023-02-13",
            "path": "/dashboard/persona/datos-personales/eliminar",
            "id_padre": 8,
            "method": "DELETE",
            "icono": "icon",
            "link": "/dashboard/persona/datos-personales/eliminar",
            "titulo": "Eliminar"
        },
        {
            "id": 42,
            "createdAt": "2023-02-22",
            "updateAt": "2023-02-22",
            "path": "/dashboard/clasificados/",
            "id_padre": 0,
            "method": "GET",
            "icono": "pi pi-briefcase",
            "link": "/dashboard/clasificados/",
            "titulo": "Clasificados",
            "items": [
                {
                    "id": 43,
                    "createdAt": "2023-02-22",
                    "updateAt": "2023-02-22",
                    "path": "/dashboard/clasificados/emprendimientos/",
                    "id_padre": 42,
                    "method": "GET",
                    "icono": "icon",
                    "link": "/dashboard/clasificados/emprendimientos/",
                    "titulo": "Emprendimientos",
                    "items": [
                        {
                            "id": 44,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/emprendimientos/crear",
                            "id_padre": 43,
                            "method": "POST",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/emprendimientos/crear",
                            "titulo": "Crear"
                        },
                        {
                            "id": 45,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/emprendimientos/ver",
                            "id_padre": 43,
                            "method": "GET",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/emprendimientos/ver",
                            "titulo": "Ver"
                        },
                        {
                            "id": 46,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/emprendimientos/editar",
                            "id_padre": 43,
                            "method": "PUT",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/emprendimientos/editar",
                            "titulo": "Editar"
                        },
                        {
                            "id": 47,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/emprendimientos/eliminar",
                            "id_padre": 43,
                            "method": "DELETE",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/emprendimientos/eliminar",
                            "titulo": "Eliminar"
                        }
                    ]
                },
                {
                    "id": 48,
                    "createdAt": "2023-02-22",
                    "updateAt": "2023-02-22",
                    "path": "/dashboard/clasificados/seccion/",
                    "id_padre": 42,
                    "method": "GET",
                    "icono": "icon",
                    "link": "/dashboard/clasificados/seccion/",
                    "titulo": "Seccion",
                    "items": [
                        {
                            "id": 49,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/seccion/crear",
                            "id_padre": 48,
                            "method": "POST",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/seccion/crear",
                            "titulo": "Crear"
                        },
                        {
                            "id": 50,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/seccion/ver",
                            "id_padre": 48,
                            "method": "GET",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/seccion/ver",
                            "titulo": "Ver"
                        },
                        {
                            "id": 51,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/seccion/editar",
                            "id_padre": 48,
                            "method": "PUT",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/seccion/editar",
                            "titulo": "Editar"
                        },
                        {
                            "id": 52,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/seccion/eliminar",
                            "id_padre": 48,
                            "method": "DELETE",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/seccion/eliminar",
                            "titulo": "Eliminar"
                        }
                    ]
                },
                {
                    "id": 53,
                    "createdAt": "2023-02-22",
                    "updateAt": "2023-02-22",
                    "path": "/dashboard/clasificados/categoria/",
                    "id_padre": 42,
                    "method": "GET",
                    "icono": "icon",
                    "link": "/dashboard/clasificados/categoria/",
                    "titulo": "Categorias",
                    "items": [
                        {
                            "id": 54,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/categoria/crear",
                            "id_padre": 53,
                            "method": "POST",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/categoria/crear",
                            "titulo": "Crear"
                        },
                        {
                            "id": 55,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/categoria/ver",
                            "id_padre": 53,
                            "method": "GET",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/categoria/ver",
                            "titulo": "Ver"
                        },
                        {
                            "id": 56,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/categoria/editar",
                            "id_padre": 53,
                            "method": "PUT",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/categoria/editar",
                            "titulo": "Editar"
                        },
                        {
                            "id": 57,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/categoria/eliminar",
                            "id_padre": 53,
                            "method": "DELETE",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/categoria/eliminar",
                            "titulo": "Eliminar"
                        }
                    ]
                },
                {
                    "id": 58,
                    "createdAt": "2023-02-22",
                    "updateAt": "2023-02-22",
                    "path": "/dashboard/clasificados/sub-categoria/",
                    "id_padre": 42,
                    "method": "GET",
                    "icono": "icon",
                    "link": "/dashboard/clasificados/sub-categoria/",
                    "titulo": "Sub Categoria",
                    "items": [
                        {
                            "id": 59,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/sub-categoria/crear",
                            "id_padre": 58,
                            "method": "POST",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/sub-categoria/crear",
                            "titulo": "Crear"
                        },
                        {
                            "id": 60,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/sub-categoria/ver",
                            "id_padre": 58,
                            "method": "GET",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/sub-categoria/ver",
                            "titulo": "Ver"
                        },
                        {
                            "id": 61,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/sub-categoria/editar",
                            "id_padre": 58,
                            "method": "PUT",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/sub-categoria/editar",
                            "titulo": "Editar"
                        },
                        {
                            "id": 62,
                            "createdAt": "2023-02-22",
                            "updateAt": "2023-02-22",
                            "path": "/dashboard/clasificados/sub-categoria/eliminar",
                            "id_padre": 58,
                            "method": "DELETE",
                            "icono": "icon",
                            "link": "/dashboard/clasificados/sub-categoria/eliminar",
                            "titulo": "Eliminar"
                        }
                    ]
                }
            ]
        }

]
