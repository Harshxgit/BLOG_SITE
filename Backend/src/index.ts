import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'; 


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET :string
	}
}>();

app.get('/signup', async(c) => {

  //connect client to database directly
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())


  const body = await c.req.json();

  try{
    const user = await prisma.user.create({
      data:{  
        email : body.email,
        password : body.password
      }
    })
    const jwt = await sign({id :user.id}, c.env.JWT_SECRET) //payload in {}, and want jwt secret
    return c.json({jwt})
  } 
  catch(e){
     c.status(403)
     return c.text("error while signing up")
  }

})


app.post('/api/v1/',(c)=>{

  return c.text("user signup")
})


app.post('/api/v1/signin',(c)=>{
  return c.text("user signim")
})


app.post('/api/v1/blog',(c)=>{
  return c.text("post blog")
})
app.put('/api/v1/blog/:id',(c)=>{
  return c.text("put blog")
})
app.put('/api/v1/blog/bulk',(c)=>{
  return c.text("put bulk")
})
export default app
