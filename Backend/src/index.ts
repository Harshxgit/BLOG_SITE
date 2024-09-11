import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello harshu')
})
app.post('/api/v1/signin',(c)=>{
  return c.text("user signim")
})
app.post('/api/v1/signup',(c)=>{
  return c.text("user signup")
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
