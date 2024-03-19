import {Client} from 'pg'

const client = new Client({
   connectionString:"postgresql://postgres:mysecretpassword@localhost/postgres"
})

async function createUsersTable(){
   await client.connect();
    const result = await client.query(`
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
        

    )
    `);
    console.log(result);
    
}
// createUsersTable();
// unsecure method
async function insertUser(){
    try {
        await client.connect();
        const user = await client.query(`
        INSERT INTO users (username,email,password)
        VALUES ('tejal', 'tejal@gmail.com','tejal123')
        `)
        console.log(user);
        
        
    } catch (error) {
        console.log(error);
        
    }finally{
        await client.end()
    }
}

// createUsersTable();
// insertUser();
async function insertUserSecure(username:string,email:string,password:string){
    try {
        await client.connect();
        const insertQuery = "INSERT INTO users (username , email ,password) VALUES ($1, $2,$3)";
        const values = [username,email,password]

        const user = await client.query(insertQuery,values)
        console.log('Insertion success',user);
        
        
    } catch (error) {
        console.log(error);
        
    }finally{
        await client.end()
    }
}
// insertUserSecure('test','test@gmail.com','123')

async function getUsers(email:string){
    try {
        await client.connect();
        const getQuery = 'SELECT * FROM users WHERE email = $1'
        const values = [email];
        const getData = await client.query(getQuery,values);

        if(getData.rows.length > 0){
            console.log('User found');
            return getData.rows[0];
        }
        else{
            console.log("No user found");
            return null;
            
        }
    } catch (error) {
        console.log(error);
        
    }finally{
        await client.end();
    }
}

let data =  getUsers('test@gmail.com').catch(console.error)
data.then((data)=>console.log(data)
)