import { db } from '../../conexion/db';
import crypto from 'crypto';

export async function POST(req: Request) {

    try {

        const { correo, password, nombre } = await req.json();

        if (!correo || !password || !nombre) {
            return new Response(JSON.stringify({ message: 'Todos los campos son obligatorios' }), {
                status: 400,
            });
        }

        //Aquí verifico si el correo ya existe
        const [existeUsuario] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

        if ((existeUsuario as any[]).length > 0) {
            return new Response(JSON.stringify({ message: 'El correo ya está registrado' }), {
                status: 409,
            });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        await db.query('INSERT INTO usuarios (correo, password, nombre) VALUES (?, ?, ?)', [
            correo,
            hashedPassword,
            nombre,
          ]);
      
        return new Response(JSON.stringify({ message: 'Usuario registrado exitosamente' }), {
            status: 201,
        });


    }catch (error) {
        console.error('Error en el registro:', error);
        return new Response(JSON.stringify({ message: 'Error en el servidor' }), {
            status: 500,
        });
      }



}