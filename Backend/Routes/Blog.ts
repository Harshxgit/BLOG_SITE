import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
// import {signupInput} from "@harshxgit/myblogs"
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

//Middleware
blogRouter.use("/*", async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ erro: "unauthorized" });
  }
  const token = jwt?.split(" ")[1];
  try{
  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ errot: "unauthorized" });
  }
  //@ts-ignore
  c.set("userId", payload.id);
  await next();
  }catch(e){
    c.status(403)
      return c.json({
        message : "you are not logged in"
      })
  }

});

//create blog post
blogRouter.post("/post", async (c) => {
  console.log("reach here")
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  // const {success } = await signupInput.safeParse(body)
  // if(!success){
  //   c.status(403)
  //   return c.text("invalid inputs")
  // }
  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(userId),
    },
  });
  return c.json({
    id: blog.id,
  });
});

//update blog
blogRouter.put("/update", async (c, next) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const blog = await prisma.blog.update({
    where: {
      id: body.id,
      authorId :Number(userId)
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({ id: blog.id });
});

//get blogposts
blogRouter.get("/bulk/id", async (c) => {
  const id = Number(c.req.param("id"));
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  return c.json({
    post,
  });
});

//get the blog in bulk
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.blog.findMany({});
  return c.json({
    posts,
  });
});
