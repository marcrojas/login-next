import { db } from '../../conexion/db';
import { RowDataPacket } from 'mysql2';


export async function POST(req: Request) {

  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Todos los campos son obligatorios' }), {
      status: 400,
    });
  }


    try {
        
        const [rows] = await db.query<RowDataPacket[]>(
          'SELECT * FROM usuarios WHERE correo = ? AND password = SHA2(?, 256)',
          [email, password]
        );
    
        if (rows.length === 0) {
          return new Response(JSON.stringify({ message: 'Credenciales inválidas' }), {
            status: 401,
          });
        }
    
        return new Response(JSON.stringify({ message: 'Login exitoso', user: rows[0] }), {
          status: 200,
        });

      } catch (error) {
        return new Response(JSON.stringify({ message: 'Error en el servidor' }), {
          status: 500,
        });
      }



}

