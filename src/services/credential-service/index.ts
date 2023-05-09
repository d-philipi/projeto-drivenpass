import { Credential } from "@/protocols";
import credentialRepository from "@/repositories/credential-repository";

async function postCredential(credential:Credential, userId : number) {
    const sucess = await credentialRepository.createCredential(credential,userId);

    return sucess;
}

async function getCredentialByTitle(title : string) {
    const sucess = await credentialRepository.findCredentialByTitle(title);

    return sucess;
}

async function getCredentialById(credentialId : number) {
    const sucess = await credentialRepository.findCredentialById(credentialId);

    return sucess;
}

async function removeCredential(credentialId : number) {
    const sucess = await credentialRepository.deleteCredential(credentialId);

    return sucess;
}

const credentialService = {
    postCredential,
    getCredentialByTitle,
    getCredentialById,
    removeCredential
}

export default credentialService;