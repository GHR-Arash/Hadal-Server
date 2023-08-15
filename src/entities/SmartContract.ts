export class SmartContract {
    workspaceId: string;
    deployedTime: Date;
    contractAddress: string;

    constructor(workspaceId: string, deployedTime: Date, contractAddress: string) {
        this.workspaceId = workspaceId;
        this.deployedTime = deployedTime;
        this.contractAddress = contractAddress;
    }
}