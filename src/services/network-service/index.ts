import { Network } from "@/protocols";
import networkRepository from "@/repositories/network-repository";
import Cryptr from 'cryptr';

const cryptr = new Cryptr('myTotallySecretKey');

async function postNetwork(network:Network, userId : number) {

    const hashedPassword = cryptr.encrypt(network.password)

    network.password = hashedPassword;

    const sucess = await networkRepository.createNetwork(network,userId);

    return sucess;
}

async function getNetworkById(networkId : number) {
    const sucess = await networkRepository.findNetworkById(networkId);

    return sucess;
}

async function getAll() {
    const result = await networkRepository.findNetwork();

    return result;
}

async function removeNetwork(networkId : number) {
    const sucess = await networkRepository.deleteNetwork(networkId);

    return sucess;
}

const networkService = {
    postNetwork,
    getNetworkById,
    getAll,
    removeNetwork
}

export default networkService;