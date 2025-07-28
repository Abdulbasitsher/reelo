import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectionToDB } from "../../../../../lib/db";

export async function POST(request: NextRequest){
    try {
      const {email, password} = await request.json();
      if(!email || !password){
        return NextResponse.json(
            {
                error: "register the user",
            },
            {
                status: 400
            }
        ) 
      }
      await connectionToDB()
      const existingUser = await User.findOne({email})
      if(existingUser){
        return NextResponse.json(
        {error: "email already register"},
        {status: 400}
        )
      }
      await User.create({
        email,
        password
      })
      return NextResponse.json(
        {
            message: "user registered sucessfully"
        },{
            status: 201
        }
      )
    } catch (error) {
        
      return NextResponse.json(
        {
            error: "failed to registered sucessfully"
        },{
            status: 500
        }
      )
    } }