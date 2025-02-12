import { db } from '../../conexion/db';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = '123456789';

export async function POST(req: Request) {

  
    const { email, password } = await req.json();

    //Si los valores vienen vacios informo de aquello
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Todos los campos son obligatorios' }), {
        status: 400,
      });
    }


    try {
        
      //Realizo la consulta con los datos traidos desde el formulario de login
        const [rows] = await db.query<RowDataPacket[]>(
          'SELECT * FROM usuarios WHERE correo = ? AND password = SHA2(?, 256)',
          [email, password]
        );
    

        //Si no obtengo retorno las credenciales no existen
        if (rows.length === 0) {
          return new Response(JSON.stringify({ message: 'Credenciales inválidas' }), {
            status: 401,
          });
        }


        interface User {
          id: number;
          nombre: string;
          correo: string;
        }
        
        const user = (rows as User[])[0];

        //Guardo el resultado de la consulta en un arreglo de objeto
       
        //Genero el token a partir del ID del usuario el cual expirara dentro de 1 hora
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
          expiresIn: '1h',
        });


        //Creo la respuesta HTTP además creo una cookie en donde guardo el token generado
        return new NextResponse(JSON.stringify({ message: 'Login exitoso' }), {
          status: 200,
          headers: {
            'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`,
          },
        });

      } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error en el servidor' }), {
          status: 500,
        });
      }



}

