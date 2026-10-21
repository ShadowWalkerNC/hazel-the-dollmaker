import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Hazel The Dollmaker — Made by hand. Made for fans.',description:'Small-batch handmade wrestling collectibles. Join the first-drop waitlist or collaborate with Hazel.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
