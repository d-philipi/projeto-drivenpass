import { Network } from "@/protocols";
import networkRepository from "@/repositories/network-repository";

async function postNetwork(network:Network, userId : number) {
    const sucess = await networkRepository.createNetwork(network,userId);

    return sucess;
}

async function getNetworkByTitle(title : string) {
    const sucess = await networkRepository.findNetworkByTitle(title);

    return sucess;
}

async function getNetworkById(networkId : number) {
    const sucess = await networkRepository.findNetworkById(networkId);

    return sucess;
}

async function removeNetwork(networkId : number) {
    const sucess = await networkRepository.deleteNetwork(networkId);

    return sucess;
}

const networkService = {
    postNetwork,
    getNetworkByTitle,
    getNetworkById,
    removeNetwork
}

export default networkService;