import { AuthenticatedRequest } from "@/middlewares/authentication-middleware";
import { Credential } from "@/protocols";
import credentialService from "@/services/credential-service";
import { Response } from "express";
import httpStatus from "http-status";


export async function newCredential(req: AuthenticatedRequest, res: Response) {
    const credential : Credential  = req.body;
    const { userId } = req;

    try {
        await credentialService.postCredential(credential,userId);

        return res.sendStatus(httpStatus.CREATED);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function searchCredential(req: AuthenticatedRequest, res: Response) {
    const credentialId = Number(req.query);

    try {
        const credential = await credentialService.getCredentialById(credentialId);

        return res.send(credential).status(httpStatus.OK);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send(error);
    }
}

export async function forgetCredential(req: AuthenticatedRequest, res: Response) {
    const credentialId = Number(req.query);

    try {
        const credential = await credentialService.removeCredential(credentialId);

        return res.send(credential).status(httpStatus.OK);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send(error);
    }
}