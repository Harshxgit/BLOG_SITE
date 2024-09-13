import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.get("/", (c) => {
 
  return c.text("hello harshu");
});

//Signup
app.post("/api/signup", async (c) => {
  //only than prisma will talk to your database
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()); //this part is most important for pooling connection


  try {
    console.log("react")
    const user = await prisma.user.create({
      //duplicate email exist
      data: {
        username: body.username,
        password: body.password,
        name: body.name,
      },
      
    });
    console.log("not reach")
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET); //payload in {}, and want jwt secret
    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    return c.text("error while signing up");
  }
});

app.post("/api/v1/", (c) => {
  return c.text("user signup");
});

app.post("/api/v1/signin", (c) => {
  return c.text("user signim");
});

app.post("/api/v1/blog", (c) => {
  return c.text("post blog");
});
app.put("/api/v1/blog/:id", (c) => {
  return c.text("put blog");
});
app.put("/api/v1/blog/bulk", (c) => {
  return c.text("put bulk");
});
export default app;
