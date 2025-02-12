"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState<{ nombre: string } | null>(null);
  
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await fetch('/api/usuario', {
              method: 'GET',
              credentials: 'include', 
            });
    
            const data = await response.json();
    
            if (response.ok) {
              setUser(data.user);
            } else {
              router.push('/'); // Redirige al login si el token generado no es válido
            }
          } catch (err) {
            console.error(err);
            router.push('/'); // Si hay un error en la conexión, redirigo al login
          }
        };
    
        fetchUser();
      }, [router]);


      const logout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/');
      };

  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
        <h1 className="text-4xl font-bold text-green-800">
          ¡Bienvenido{user ? `, ${user.nombre}` : ''} al Home!
        </h1>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }