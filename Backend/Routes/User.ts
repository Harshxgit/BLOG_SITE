import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { validator } from "hono/validator";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables :{
    // userId : number;
    id : number ;
  }
}>();
//Signup user
userRouter.post("/signup", async (c) => {
  //only than prisma will talk to your database
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()); //this part is most important for pooling connection

  try {
    const user = await prisma.user.create({
      //duplicate email exist
      data: {
        username: body.username,
        password: body.password,
        name: body.name,
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET); //payload in {}, and want jwt secret
    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    return c.text("error while signing up");
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
   return c.json({ error: "user not found" });
  }
  // @ts-ignore //this is not the right way
  const jwt = await sign({id :user.id},c.env.JWT_SECRET)
  return c.json(jwt)
});
