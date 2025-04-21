export class User {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    passwordResetVerified?: boolean;
    role: string;
    last_login?: Date;
    phone_number?: string;
    isVerified?: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    
    // Propriétés spécifiques au frontend
    bio?: string;
    authentication_method?: string;
    
    constructor(data: any = {}) {
        this._id = data._id;
        this.name = data.name || '';
        this.email = data.email || '';
        this.password = data.password;
        this.passwordChangedAt = data.passwordChangedAt ? new Date(data.passwordChangedAt) : undefined;
        this.passwordResetToken = data.passwordResetToken;
        this.passwordResetExpires = data.passwordResetExpires ? new Date(data.passwordResetExpires) : undefined;
        this.passwordResetVerified = data.passwordResetVerified || false;
        this.role = data.role || 'user';
        this.last_login = data.last_login ? new Date(data.last_login) : undefined;
        this.phone_number = data.phone_number || '';
        this.isVerified = data.isVerified || false;
        this.emailVerificationToken = data.emailVerificationToken;
        this.emailVerificationExpires = data.emailVerificationExpires ? new Date(data.emailVerificationExpires) : undefined;
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : undefined;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
        
        // Propriétés spécifiques au frontend
        this.bio = data.bio || '';
        this.authentication_method = data.authentication_method || 'local';
    }
}