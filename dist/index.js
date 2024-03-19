"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    connectionString: "postgresql://postgres:mysecretpassword@localhost/postgres"
});
function createUsersTable() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const result = yield client.query(`
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
        

    )
    `);
        console.log(result);
    });
}
// createUsersTable();
// unsecure method
function insertUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const user = yield client.query(`
        INSERT INTO users (username,email,password)
        VALUES ('tejal', 'tejal@gmail.com','tejal123')
        `);
            console.log(user);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            yield client.end();
        }
    });
}
// createUsersTable();
// insertUser();
function insertUserSecure(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const insertQuery = "INSERT INTO users (username , email ,password) VALUES ($1, $2,$3)";
            const values = [username, email, password];
            const user = yield client.query(insertQuery, values);
            console.log('Insertion success', user);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            yield client.end();
        }
    });
}
// insertUserSecure('test','test@gmail.com','123')
function getUsers(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const getQuery = 'SELECT * FROM users WHERE email = $1';
            const values = [email];
            const getData = yield client.query(getQuery, values);
            if (getData.rows.length > 0) {
                console.log('User found');
                return getData.rows[0];
            }
            else {
                console.log("No user found");
                return null;
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            yield client.end();
        }
    });
}
let data = getUsers('test@gmail.com').catch(console.error);
data.then((data) => console.log(data));
