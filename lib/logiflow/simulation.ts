export type Scenario = 'normal' | 'peak' | 'blocked';
export const warehouses = [
 {id:'A',name:'Recebimento',subtitle:'Conferência e entrada',x:-5,z:-3,color:'#66d9ba',capacity:1200,stock:864},
 {id:'B',name:'Fulfillment',subtitle:'Separação e embalagem',x:4,z:-3,color:'#8b9cfb',capacity:1800,stock:1476},
 {id:'C',name:'Expedição',subtitle:'Consolidação e saída',x:0,z:5,color:'#f3c676',capacity:960,stock:528},
];
export function metrics(scenario:Scenario,optimized:boolean){
 const demand=scenario==='peak'?168:120;
 const capacity=scenario==='blocked'?(optimized?108:72):(optimized?180:144);
 const throughput=Math.min(demand,capacity);
 return {demand,capacity,throughput,queue:Math.max(0,demand-capacity),sla:Math.round(throughput/demand*100),wait:Math.round(Math.max(0,demand-capacity)/capacity*60)};
}
export const shipments=[{id:'LF-2048',destination:'São Paulo • SP',warehouse:'C',pallets:24},{id:'LF-2049',destination:'Campinas • SP',warehouse:'B',pallets:18},{id:'LF-2050',destination:'Curitiba • PR',warehouse:'A',pallets:32}];
