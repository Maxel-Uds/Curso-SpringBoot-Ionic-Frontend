export interface ClienteDTO {
    id: string;
    nome: string;
    telefones: string[];
    email: string;
    imageUrl?: string;
    perfil: string[];
}