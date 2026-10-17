import type {Metadata,Viewport} from 'next';
import './globals.css';
export const metadata:Metadata={title:'WIFA VitiTrack · Your skin, your story',description:'A thoughtful vitiligo journal for patients and clinicians. Experimental research prototype.',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,statusBarStyle:'default',title:'VitiTrack'},icons:{icon:'/favicon.svg',apple:'/apple-touch-icon.png'}};
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#edf7f1'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="it"><body>{children}</body></html>}
