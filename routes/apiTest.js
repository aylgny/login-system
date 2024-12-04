const axios = require("axios");
const { startServer } = require("../index"); // Import the server start function

const baseUrl = "http://localhost:5000/api"; // Base URL for your API endpoints

async function testAPIs() {
    try {
        console.log("Starting API tests...");

        // Example 1: Add to Cart For First User
        const addToCartResponse = await axios.post(`${baseUrl}/cart`, {
            userId: "674c70c75277a3e3e8b40371", // Replace with a valid userId
            productId: "674334d4bb4b140ec62687da", // Replace with a valid productId
            quantity: 2,
        });
        console.log("Add to Cart Response:", addToCartResponse.data);

        // Example 2: Get Cart Items
        const getCartResponse = await axios.get(`${baseUrl}/cart/674c70c75277a3e3e8b40371`); // Replace with a valid userId
        console.log("Get Cart Response:", getCartResponse.data);

         // Example 3: Add to Cart For First User For Second User
         const addToCartResponse2 = await axios.post(`${baseUrl}/cart`, {
            userId: "67507b17592ec5348d90c9b5", // Replace with a valid userId
            productId: "674334d4bb4b140ec62687da", // Replace with a valid productId
            quantity: 2,
        });
        console.log("Add to Cart Response:", addToCartResponse2.data);

        // Example 4: Get Cart Items
        const getCartResponse2 = await axios.get(`${baseUrl}/cart/67507b17592ec5348d90c9b5`); // Replace with a valid userId
        console.log("Get Cart Response:", getCartResponse2.data);

        // Example 5: Add to Cart For First User For Second Product
        const addToCartResponse3 = await axios.post(`${baseUrl}/cart`, {
            userId: "67507b17592ec5348d90c9b5", // Replace with a valid userId
            productId: "6743459455a7b0084cc00cc2", // Replace with a valid productId
            quantity: 2,
        });
        console.log("Add to Cart Response:", addToCartResponse3.data);

        // Example 6: Get Cart Items
        const getCartResponse3 = await axios.get(`${baseUrl}/cart/67507b17592ec5348d90c9b5`); // Replace with a valid userId
        console.log("Get Cart Response:", getCartResponse3.data);

        
        const userId1 = "674c70c75277a3e3e8b40371";
        const userId2 = "67507b17592ec5348d90c9b5";
    
        // Create Order for User 1
                // Example 7

        const createOrderResponse1 = await axios.post(`${baseUrl}/orders`, {
          userId: userId1,
          status: "Processing",
        });
        console.log("Create Order Response for User 1:", createOrderResponse1.data);
    
        // Create Order for User 2
          // Example 8
        const createOrderResponse2 = await axios.post(`${baseUrl}/orders`, {
          userId: userId2,
          status: "Processing",
        });
        console.log("Create Order Response for User 2:", createOrderResponse2.data);
    
        // Get Orders for User 1
          // Example 9
        const getOrdersResponse1 = await axios.get(`${baseUrl}/orders/${userId1}`);
        console.log("Get Orders Response for User 1:", getOrdersResponse1.data);
    
        // Get Orders for User 2
          // Example 10
        const getOrdersResponse2 = await axios.get(`${baseUrl}/orders/${userId2}`);
        console.log("Get Orders Response for User 2:", getOrdersResponse2.data);

          // Example 11
        const createOrderResponse3 = await axios.post(`${baseUrl}/orders`, {
            userId: userId1,
            status: "delivered",
            });
            console.log("Create Order Response for User 1:", createOrderResponse1.data);
        
            // Create Order for User 2
              // Example 12
            const createOrderResponse4 = await axios.post(`${baseUrl}/orders`, {
            userId: userId2,
            status: "delivered",
            });

            console.log("Create Order Response for User 1:", createOrderResponse4.data);

              // Example 13
        const createOrderResponse5 = await axios.post(`${baseUrl}/orders`, {
            userId: userId1,
            status: "in-transit",
            });
            console.log("Create Order Response for User 1:", createOrderResponse5.data);
        
            // Create Order for User 2
              // Example 14
            const createOrderResponse6 = await axios.post(`${baseUrl}/orders`, {
            userId: userId2,
            status: "in-transit",
            });

            console.log("Create Order Response for User 1:", createOrderResponse6.data);

            const categoryId1 = "673c94426f59253612ed00e2";
            const categoryId2 = "673c94536f59253612ed00e9";
        
            // 1. Get All Categories
                          // Example 15

            const getAllCategoriesResponse = await axios.get(`${baseUrl}/categories`);
            console.log("Get All Categories Response:", getAllCategoriesResponse.data);
        
                     

            // 2. Create a Category for Category ID 1
                 // Example 16
            const createCategoryResponse1 = await axios.post(`${baseUrl}/categories`, {
              name: "Category 1",
            });
            console.log("Create Category Response for Category 1:", createCategoryResponse1.data);
        
            // 3. Create a Category for Category ID 2
                 // Example 17
            const createCategoryResponse2 = await axios.post(`${baseUrl}/categories`, {
              name: "Category 2",
            });
            console.log("Create Category Response for Category 2:", createCategoryResponse2.data);
        
            // 4. Delete Category for Category ID 1
                 // Example 18
            // const deleteCategoryResponse1 = await axios.delete(`${baseUrl}/categories/${categoryId1}`);
            // console.log("Delete Category Response for Category ID 1:", deleteCategoryResponse1.data);
        
            // 5. Delete Category for Category ID 2
                 // Example 19
            // const deleteCategoryResponse2 = await axios.delete(`${baseUrl}/categories/${categoryId2}`);
            // console.log("Delete Category Response for Category ID 2:", deleteCategoryResponse2.data);
        
            console.log("Category API Tests Completed.");
            const productId1 = "67433531bb4b140ec62687e3";
            const productId2 = "6743459455a7b0084cc00cc2";
        
            // 1. Create Product 1
            // Example 20
            const createProductResponse1 = await axios.post(`${baseUrl}/products`, {
              name: "Product 1",
              price: 100,
              description: "Description for Product 1",
              quantity: 0,
            });
            console.log("Create Product Response for Product 1:", createProductResponse1.data);
        
            // 2. Create Product 2
            // Example 21
            const createProductResponse2 = await axios.post(`${baseUrl}/products`, {
              name: "Product 2",
              price: 200,
              description: "Description for Product 2",
              quantity: 0,
            });
            console.log("Create Product Response for Product 2:", createProductResponse2.data);
        
            // 3. Get All Products
            // Example 22
            const getAllProductsResponse = await axios.get(`${baseUrl}/products`);
            console.log("Get All Products Response:", getAllProductsResponse.data);
        
            // 4. Get Product by ID for Product 1
            // Example 23
            const getProductByIdResponse1 = await axios.get(`${baseUrl}/products/${productId1}`);
            console.log("Get Product by ID Response for Product 1:", getProductByIdResponse1.data);
        
            // 5. Get Product by ID for Product 2
            // Example 24
            const getProductByIdResponse2 = await axios.get(`${baseUrl}/products/${productId2}`);
            console.log("Get Product by ID Response for Product 2:", getProductByIdResponse2.data);
        
            // 6. Add Review to Product 1
            // Example 25
            const addReviewResponse1 = await axios.post(`${baseUrl}/products/${productId1}/reviews`, {
              userId: userId2, // Example userId
              rating: 5,
              comment: "Great product!",
            });
            console.log("Add Review Response for Product 1:", addReviewResponse1.data);
        
            // 7. Add Review to Product 2
            // Example 26
            const addReviewResponse2 = await axios.post(`${baseUrl}/products/${productId2}/reviews`, {
              userId: userId1, // Example userId
              rating: 4,
              comment: "Very useful product.",
            });
            console.log("Add Review Response for Product 2:", addReviewResponse2.data);
            // Example 27
            const addReviewResponse3 = await axios.post(`${baseUrl}/products/${productId2}/reviews`, {
                userId: userId1, // Example userId
                rating: 4,
                comment:"",
              });
              console.log("Add Review Response for Product 1:", addReviewResponse3.data);

              // Example 28
              const addReviewResponse4 = await axios.post(`${baseUrl}/products/${productId2}/reviews`, {
                userId: userId2, // Example userId
                rating: 4,
                comment: "",
              });
              console.log("Add Review Response for Product 1:", addReviewResponse4.data);

        console.log("API tests completed.");
    } catch (error) {
        console.error("Error during API testing:", error.response ? error.response.data : error.message);
    }
}

// Start the server and run tests
(async () => {
    try {
        await startServer(); // Start the server if it's not running
        console.log("Server started successfully.");
        await testAPIs(); // Call the testAPIs function
    } catch (error) {
        console.error("Failed to start server or run tests:", error);
    }
})();
