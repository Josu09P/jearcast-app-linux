export interface UserRegisterModel {
    name: string;
    email: string;  
    password: string;
    confirmPassword: string;
    create_at?: Date;
    apikeyYoutube?: string;
}

export interface UserDetailModel extends UserRegisterModel {
    id: string;
    update_at?: Date;
}

export interface UserLoginModel {
    email: string;
    password: string;
}