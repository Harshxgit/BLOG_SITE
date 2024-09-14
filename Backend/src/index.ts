import { Hono } from "hono";
import { userRouter } from "../Routes/User";
import { blogRouter } from "../Routes/Blog";


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
app.get('/', (c)=> {
  return c.text("hello harshu")
})
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;