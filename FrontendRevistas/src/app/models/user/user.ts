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

export interface NivelFormacion {
    id: number
    nombre: string | null;
}