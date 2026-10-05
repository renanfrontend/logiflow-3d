import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'LogiFlow 3D | Renan Augusto',description:'Um centro logístico interativo em 3D. Explore setores, simule gargalos e compare decisões operacionais. Projeto de Renan Augusto.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
