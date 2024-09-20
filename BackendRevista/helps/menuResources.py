def menuResources(data: list, list_data: list, model: any, last_id: int, id_padre=0):
    """
    Convierte una estructura jerárquica de recursos en una lista plana de recursos.

    Esta función recorre una estructura jerárquica de recursos (como un menú con elementos y subelementos)
    y la transforma en una lista plana de recursos. Cada recurso se crea utilizando el modelo proporcionado.

    Args:
        data (list): Una lista que contiene la estructura jerárquica de recursos.
        list_data (list): La lista en construcción donde se agregarán los recursos aplanados.
        model (any): El modelo utilizado para crear los objetos de recurso.
        last_id (int): El último ID de recurso utilizado.
        id_padre (int, opcional): El ID del recurso padre. Por defecto es 0.

    Returns:
        list: Una lista plana de recursos generada a partir de la estructura jerárquica.
    """
    id_last_resources = last_id

    for i in data:
        if id_padre != 0:
            list_data.append(model(
                path=i['path'], link=i['link'], icono=i['icono'], method=i['method'], titulo=i['titulo'], id_padre=id_padre, id=list_data[-1].id + 1))
        else:
            id = last_id if len(list_data) == 0 else list_data[-1].id + 1
            list_data.append(model(
                path=i['path'], link=i['link'], icono=i['icono'], method=i['method'], titulo=i['titulo'], id_padre=i['id_padre'], id=id))
        id_last_resources += 1
        if 'items' in i:
            menuResources(data=i['items'], list_data=list_data, model=model,
                          last_id=id_last_resources, id_padre=list_data[-1].id)
    return list_data
