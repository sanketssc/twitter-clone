// import { PrismaClient } from "@prisma/client"
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function POST(request) {
    const session = await getServerSession(authOptions)
    const {username, firstname, lastname, image} = await request.json()
    console.log(username, firstname, lastname, image)

    const user = await prisma.profile.findUnique({
        where: {
            username: username
    }
    })
    if(user) {
        return NextResponse.json({error: "Username already exists"})
    }
    

    const profile = await prisma.profile.create({
        data: {
            username,
            firstname,
            lastname,
            image,
            email: session.user.email
        }
    })
    
    return NextResponse.json({success: true})

    
}