const request = require("supertest");
const app = require('../app');

test('.get( /posts ) with statusCode = 200', async () => {
    const response = await request(app).get('/posts')
    expect( response.statusCode ).toBe(200);
});

test("Prop names of the first entry it's at least: 'name' and 'description' ", async () => {
    const response = await request(app).get('/posts');

    const keys = Object.keys(response.body[0]);
    const atLeast2   = keys.some(a => a=="name") && keys.some(a => a=="description")
     
    
    expect ( atLeast2 )
    .toBe  ( true );
});

test(".post( /posts ) with statusCode = 200", async () => {
    const newEntry        = {name:"post3", description:"Lorem Ipsum from post3"};
    const response = await request(app).post('/posts').type('json').send( newEntry )
    expect( response.statusCode ).toBe(200);
});

test("Return created post, identified by their mandatory Props", async () => {
    const newEntry        = {name:"post3", description:"Lorem Ipsum from post3"};

    const response  = await request(app).post('/posts').type('json').send( newEntry );
    const keys      = Object.keys(response.body);
    const atLeast2  = keys.some(a => a=="name") && keys.some(a => a=="description")
    console.log(response.body)
    expect( atLeast2 ).toBe(true);
});

test("Make a Post with more than 30 chars and invoke an Error", async () => {
    const newEntry        = {name:"post3", description:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"};
    
    const response  = await request(app).post('/posts').type('json').send( newEntry );
    expect( response.status ).toBe(500);
});

test("The new length of the table it's (oldLength + 1)", async () => {
    newEntry        = {name:"post3", description:"Lorem Ipsum from post3"};

    const responseOld = await request(app).get('/posts')
                        await request(app).post('/posts').type('json').send( newEntry );
    const responseNew = await request(app).get('/posts')
    console.log(responseNew.body.length)
    const isGreater   = (responseNew.body.length - responseOld.body.length) == 1
    
    expect( isGreater ).toBe(true);
});

test(".delete( /posts ) with statusCode = 200", async () => {
    const id = 28;
    const response = await request(app).delete(`/posts/${id}`) // here
    expect( response.statusCode ).toBe(200);
});

test("Return deleted post, identified by id", async () => {
    const id = 29;
    const response  = await request(app).delete(`/posts/${id}`) // 1 because previously it's deleted 2

    expect( Number(response.body.id) ).toBe( id );
});

