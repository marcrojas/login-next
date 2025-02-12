import { db } from '../../conexion/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

const SECRET_KEY = '123456789';


export async function GET(req: Request) {
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
  
    //Creo la respuesta HTTP personalizada para mostrar el mensaje
    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };

      const [user] = await db.query<RowDataPacket[]>(
        'SELECT nombre FROM usuarios WHERE id = ?',
        [decoded.userId]
      );
  
      if ((user as any[]).length === 0) {
        return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
      }
  
      return NextResponse.json({ user: user[0] }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }
  }