export class ProducedPart{
    part : string;
    workOrder: string;
    produced: number;
    targetCycle: number;
}

export class MachineKpi{
    name :string;
    fromDateTime: Date;
    toDateTime: Date;
    totalAvailableTime: number;
    availableTime: number;
    planDownTime: Map<string,number> = new Map<string,number>();
    unPlandDownTime: Map<string,number> = new Map<string,number>();
    partProduced: Map<string,ProducedPart>= new Map<string,ProducedPart>();
    totalYield: number;
    totalScrap: number;

    get Availability() : number
    {
        return Math.round((this.availableTime / this.totalAvailableTime) * 100 * 1e2) / 1e2;
    }

    get Performance() : number
    {
        let actualOperateTime : number = 0;

        this.partProduced.forEach((value,key,map) =>{
            actualOperateTime += (value.targetCycle * value.produced);
        });

        return Math.round((actualOperateTime / this.availableTime) * 100 * 1e2) / 1e2;
    }

    get Quality() : number
    {
        return Math.round((this.totalYield / (this.totalYield + this.totalScrap)) * 100 * 1e2) / 1e2;
    }

    get OEE() : number
    {
        return Math.round((this.Availability * this.Performance * this.Quality) / 10000 * 1e2) / 1e2;
    }
}