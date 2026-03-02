export type Account = {
    email: string;
    name: string;
    school?: string;
    city?: string;
    rememberMe?: boolean;
    /**
     * a: admin
     * u: user
     */
    type: "a" | "u";
    address?: string;
    identity?: string;
    dob?: string;
    org?: string;
    code?: string;
};
