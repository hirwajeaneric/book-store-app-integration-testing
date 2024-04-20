const express = require('express');
const request = require('supertest');
const bookRoutes = require('../routes/books.route');

const app = express();
app.use(express.json());
app.use("/api/books", bookRoutes);

describe("Integration tests for the books API", () => {
    it("GET /api/books - success - get all the books", async () => {
        const { body, statusCode } = await request(app).get('/api/books');
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    author: expect.any(String),
                })
            ])
        );

        expect(statusCode).toBe(200);
    });

    it("POST /api/books - failure on invalid post body", async () => {
        const { body, statusCode } = await request(app).post('/api/books').send({
            name: "",
            author: "John Travolta"
        });
        expect(statusCode).toBe(400);
        expect(body).toEqual({
            errors: [
                {
                    location: "body",
                    msg: "Book name is required",
                    path: "name",
                    value: "",
                    type: "field"
                }
            ]
        });
    });

    it("POST /api/books - success", async () => {
        const { body, statusCode } = await request(app).post('/api/books').send({
            name: "Pay off",
            author: "John Travolta"
        });
        expect(statusCode).toBe(200);
        expect(body).toEqual({ message: "Success" });
    });

    // it("GET /api/books - Find by id (Check parameter)", async () => {
    //     let parameter = 1;
    //     expect(typeof parameter).toBe("number");
    // });

    it("GET /api/books - Find by id - Success", async () => {
        let parameter = "1";

        const { body, statusCode } = await request(app).get(`/api/books/findById?id=${parameter}`);
        
        let expectedStatusCode = 200;
        let expectedResponseBody = { "name": "Call of the wild", "author": "Louis wilder", "id": 1 }
        
        expect(statusCode).toBe(expectedStatusCode);
        expect(body).toEqual(expectedResponseBody);
    });
    
    it("GET /api/books - Find by id - Not found", async () => {
        let parameter = "0";

        const { body, statusCode } = await request(app).get(`/api/books/findById?id=${parameter}`);
        
        let expectedStatusCode = 404;
        let expectedResponseBody = { message: "Book not found!" };
        
        expect(statusCode).toBe(expectedStatusCode);
        expect(body).toEqual(expectedResponseBody);
    });
})
