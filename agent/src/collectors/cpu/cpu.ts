import os from 'os';

function getCpuTimes(){
    const cpus = os.cpus();

    let idle = 0;
    let total = 0;

    cpus.forEach((cpu) => {
        idle += cpu.times.idle;

        total += cpu.times.user +
                 cpu.times.nice + 
                 cpu.times.sys +
                 cpu.times.irq +
                 cpu.times.idle;
    })

    return {idle, total};
}




export async function getCPUUsage(): Promise<number> {

    const start = getCpuTimes();

    //wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const end = getCpuTimes();

    const idleDifference = end.idle - start.idle;
    const totalDifference = end.total - start.total;

    const usage = ((totalDifference - idleDifference) / totalDifference) * 100;
    return Number(usage.toFixed(2));
}