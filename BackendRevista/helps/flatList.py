def flatList(lista: list):
    """
    Aplana una lista anidada en una lista plana.

    Esta función toma una lista anidada (una lista que contiene sublistas) como entrada
    y devuelve una lista plana que contiene todos los elementos de las sublistas.

    Args:
        lista (list): La lista anidada que se desea aplanar.

    Returns:
        list: Una lista plana que contiene todos los elementos de las sublistas.
    """
    new_list = []
    for item in lista:
        new_list += item
    return new_list
