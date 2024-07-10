export interface RemoteMachineInterface {
    machineId:string,
    machineName:string,
    userId:string,
    machineToken:string,
    pubKey:string,
    privateKey:string,
}
export interface RemoteMachineInterfaceMain extends RemoteMachineInterface{
    createdAt:string,
    updateAt:string,
    __v:number,
    _id:any
}

export interface onlineRemoteMachineInterface{
    machineId:string,
    machineName:string,
    socketId:string,
}
export interface machineListInterface {
    allRemoteMachine:RemoteMachineInterfaceMain[],
    onlineRemoteMachine:onlineRemoteMachineInterface[]
}
