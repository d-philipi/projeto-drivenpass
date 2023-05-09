import { AuthenticatedRequest } from "@/middlewares/authentication-middleware";
import { Network } from "@/protocols";
import networkService from "@/services/network-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function newNetwork(req: AuthenticatedRequest, res: Response) {
    const network : Network  = req.body;
    const { userId } = req;

    try {
        await networkService.postNetwork(network,userId);

        return res.sendStatus(httpStatus.CREATED);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function searchNetwork(req: AuthenticatedRequest, res: Response) {
    const networkId = Number(req.query);
    let network;

    try {
        if(networkId) {
            network = await networkService.getNetworkById(networkId);
        };
        
        network = await networkService.getAll();

        return res.send(network).status(httpStatus.OK);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send(error);
    }
}

export async function forgetNetwork(req: AuthenticatedRequest, res: Response) {
    const networkId = Number(req.params);

    try {
        const network = await networkService.removeNetwork(networkId);

        return res.send(network).status(httpStatus.OK);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send(error);
    }
}