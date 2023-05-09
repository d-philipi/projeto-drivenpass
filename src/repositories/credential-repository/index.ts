import { prisma } from "@/config";
import { Credential } from "@/protocols";

async function createCredential(credential : Credential, userId: number) {
    return await prisma.credential.create({
        data:{userId,...credential}
    })
}

async function findCredentialByTitle(title : string) {
    return await prisma.credential.findFirst({
        where: {
            title:title
        }
    })
}

async function findCredentialById(credentialId : number) {
    return await prisma.credential.findFirst({
        where: {
            id:credentialId
        }
    })
}

async function deleteCredential(credentialId : number) {
    return await prisma.credential.delete({
        where: {
            id:credentialId
        }
    })
}

const credentialRepository = {
    createCredential,
    findCredentialByTitle,
    findCredentialById,
    deleteCredential
};

export default credentialRepository;