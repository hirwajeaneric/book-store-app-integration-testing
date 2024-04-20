const express = require('express');
const request = require('supertest');
const bookRoutes = require('../routes/books.route');

const app = express();
app.use(express.json());
app.use("/api/books", bookRoutes);

jest.mock('../data/books.json', () => [
    {
        "name": "Call of the wild",
        "author": "Louis wilder",
        "id": 1
    },
    {
        "name": "Love like no other",
        "author": "Charlie Bronsey",
        "id": 2
    },
    {
        "name": "Dream",
        "author": "Jamie Phillips",
        "id": 3
    }
]);

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

    it("GET /api/books?id=bookId - Find by id - Success", async () => {
        let parameter = "1";

        const { body, statusCode } = await request(app).get(`/api/books/findById?id=${parameter}`);
        
        let expectedStatusCode = 200;
        let expectedResponseBody = { "name": "Call of the wild", "author": "Louis wilder", "id": 1 }
        
        expect(statusCode).toBe(expectedStatusCode);
        expect(body).toEqual(expectedResponseBody);
    });
    
    it("GET /api/books?id=bookId - Find by id - Not found", async () => {
        let parameter = "0";

        const { body, statusCode } = await request(app).get(`/api/books/findById?id=${parameter}`);
        
        let expectedStatusCode = 404;
        let expectedResponseBody = { message: "Book not found!" };
        
        expect(statusCode).toBe(expectedStatusCode);
        expect(body).toEqual(expectedResponseBody);
    });

    it("PUT /api/books/update?id=bookId - Failure when book is not found", async () => {
        let bookId = '234';
        const { body, statusCode } = await request(app).put(`/api/books/update?id=${bookId}`).send({
            name: 'Love me like you do',
            author: 'John Travolta'
        });

        let expectedStatusCode = 404;
        let expectedResponseBody = {
            error: true,
            message: "Book not found"
        };

        expect(statusCode).toBe(expectedStatusCode);
        expect(body).toEqual(expectedResponseBody);
    });
    
    // it("PUT /api/books - Successfully updated book", async () => {
    //     let bookId = '2';
    //     const { body, statusCode } = await request(app).put(`/api/books/update?id=${bookId}`).send({
    //         name: 'Love me like you do',
    //         author: 'John Travolta'
    //     });

    //     console.log(body);

    //     let expectedStatusCode = 200;
    //     let expectedResponseBody = {
    //         message: "Book successfully updated!",
    //         updatedBook: {
    //             name: 'Love me like you do',
    //             author: 'John Travolta',
    //             id: 2
    //         }
    //     };

    //     expect(statusCode).toBe(expectedStatusCode);
    //     expect(body).toEqual(expectedResponseBody);
    // });

    it("DELETE /api/books/delete?id=bookId - Failure when book is not found", async () => {
        let bookId = '234';
        const { body, statusCode } = await request(app).delete(`/api/books/delete?id=${bookId}`);

        let expectedStatusCode = 404;
        let expectedResponseBody = {
            error: true,
            message: "Book not found!"
        };

        expect(statusCode).toBe(expectedStatusCode);
        expect(body).toEqual(expectedResponseBody);
    });

    it("DELETE /api/books/delete?id=bookId - Deleted book", async () => {
        let bookId = '2';
        const { body, statusCode } = await request(app).delete(`/api/books/delete?id=${bookId}`);

        let expectedStatusCode = 200;
        let expectedResponseBody = {
            message: "Book deleted"
        };

        expect(statusCode).toBe(expectedStatusCode);
        expect(body).toEqual(expectedResponseBody);
    });
})
