import { GroupDto } from "./Group.dto";

export interface UserDto {
    user: UserRecord;
    groups: GroupDto[];
}
export interface UserRecord {
    /**
     * The user's `uid`.
     */
    readonly uid: string;
    /**
     * The user's primary email, if set.
     */
    readonly email?: string;
    /**
     * Whether or not the user's primary email is verified.
     */
    readonly emailVerified: boolean;
    /**
     * The user's display name.
     */
    readonly displayName?: string;
    /**
     * The user's photo URL.
     */
    readonly photoURL?: string;
    /**
     * The user's primary phone number, if set.
     */
    readonly phoneNumber?: string;
    /**
     * Whether or not the user is disabled: `true` for disabled; `false` for
     * enabled.
     */
    readonly disabled: boolean;
    /**
     * Additional metadata about the user.
     */
    readonly metadata: any;
    /**
     * An array of providers (for example, Google, Facebook) linked to the user.
     */
    readonly providerData: any[];
    /**
     * The user's hashed password (base64-encoded), only if Firebase Auth hashing
     * algorithm (SCRYPT) is used. If a different hashing algorithm had been used
     * when uploading this user, as is typical when migrating from another Auth
     * system, this will be an empty string. If no password is set, this is
     * null. This is only available when the user is obtained from
     * {@link BaseAuth.listUsers}.
     */
    readonly passwordHash?: string;
    /**
     * The user's password salt (base64-encoded), only if Firebase Auth hashing
     * algorithm (SCRYPT) is used. If a different hashing algorithm had been used to
     * upload this user, typical when migrating from another Auth system, this will
     * be an empty string. If no password is set, this is null. This is only
     * available when the user is obtained from {@link BaseAuth.listUsers}.
     */
    readonly passwordSalt?: string;
    /**
     * The user's custom claims object if available, typically used to define
     * user roles and propagated to an authenticated user's ID token.
     * This is set via {@link BaseAuth.setCustomUserClaims}
     */
    readonly customClaims?: {
        [key: string]: any;
    };
    /**
     * The ID of the tenant the user belongs to, if available.
     */
    readonly tenantId?: string | null;
    /**
     * The date the user's tokens are valid after, formatted as a UTC string.
     * This is updated every time the user's refresh token are revoked either
     * from the {@link BaseAuth.revokeRefreshTokens}
     * API or from the Firebase Auth backend on big account changes (password
     * resets, password or email updates, etc).
     */
    readonly tokensValidAfterTime?: string;
    /**
     * The multi-factor related properties for the current user, if available.
     */
    readonly multiFactor?: any;
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    toJSON(): object;
}