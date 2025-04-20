export class User {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    phone_number?: string;
    bio?: string;
    isVerified?: boolean;
    authentication_method?: string;
    
    constructor(data: any = {}) {
        this._id = data._id;
        this.name = data.name || '';
        this.email = data.email || '';
        this.password = data.password;
        this.role = data.role || 'user';
        this.phone_number = data.phone_number || '';
        this.bio = data.bio || '';
        this.isVerified = data.isVerified || false;
        this.authentication_method = data.authentication_method || 'local';
    }
}