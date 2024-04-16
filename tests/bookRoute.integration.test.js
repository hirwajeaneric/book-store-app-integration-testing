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
            name: "asdfasdf",
            author: "John Travolta"
        });

        expect(statusCode).toBe(400);
        expect(body).toEqual({
            errors: [
                {
                    location: "body",
                    msg: "Book name is required",
                    param: "name"
                }
            ]
        })
    });
})
