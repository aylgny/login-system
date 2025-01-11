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

              // Example 29: Add to Wishlist
              const addToWishlistResponse1 = await axios.post(`${baseUrl}/wishlist`, {
                userId: userId1, // Replace with a valid userId
                productId: productId1, // Replace with a valid productId
              });
              console.log("Add to Wishlist Response for User 1:", addToWishlistResponse1.data);

              // Example 30: Add to Wishlist for another product
              const addToWishlistResponse2 = await axios.post(`${baseUrl}/wishlist`, {
                userId: userId2, // Replace with a valid userId
                productId: productId2, // Replace with a valid productId
              });
              console.log("Add to Wishlist Response for User 2:", addToWishlistResponse2.data);

              // Example 31: Get Wishlist Items for User 1
              const getWishlistResponse1 = await axios.get(`${baseUrl}/wishlist/${userId1}`);
              console.log("Get Wishlist Response for User 1:", getWishlistResponse1.data);

              // Example 32: Get Wishlist Items for User 2
              const getWishlistResponse2 = await axios.get(`${baseUrl}/wishlist/${userId2}`);
              console.log("Get Wishlist Response for User 2:", getWishlistResponse2.data);
              // Example 33: Get All Categories
              const getAllCategoriesResponse2 = await axios.get(`${baseUrl}/categories`);
              console.log("Get All Categories Response:", getAllCategoriesResponse2.data);

              // Example 34: Create a New Category
              const createCategoryResponse = await axios.post(`${baseUrl}/addCategory`, {
                  name: "New Category 1",
              });
              console.log("Create Category Response:", createCategoryResponse.data);

              // Example 35: Create Another New Category
              const createAnotherCategoryResponse = await axios.post(`${baseUrl}/addCategory`, {
                  name: "New Category 2",
              });
              console.log("Create Another Category Response:", createAnotherCategoryResponse.data);

              // Example 36: Delete a Category by ID
              const deleteCategoryResponse1 = await axios.delete(`${baseUrl}/deleteCategory/${categoryId1}`);
              console.log("Delete Category Response:", deleteCategoryResponse1.data);

              // Example 37: Delete Another Category by ID
              const deleteCategoryResponse2 = await axios.delete(`${baseUrl}/deleteCategory/${categoryId2}`);
              console.log("Delete Another Category Response:", deleteCategoryResponse2.data);
              // Example 38: Get Orders for User 1
const getOrdersUser1 = await axios.get(`${baseUrl}/orders/${userId1}`);
console.log("Get Orders Response for User 1:", getOrdersUser1.data);

// Example 39: Get Orders for User 2
const getOrdersUser2 = await axios.get(`${baseUrl}/orders/${userId2}`);
console.log("Get Orders Response for User 2:", getOrdersUser2.data);

// Example 40: Create Order for User 1
const createOrderUser1 = await axios.post(`${baseUrl}/orders`, {
    userId: userId1,
    status: "Processing",
    address: "123 Test Address"
});
console.log("Create Order Response for User 1:", createOrderUser1.data);

// Example 41: Create Order for User 2
const createOrderUser2 = await axios.post(`${baseUrl}/orders`, {
    userId: userId2,
    status: "Processing",
    address: "456 Another Address"
});
console.log("Create Order Response for User 2:", createOrderUser2.data);

// Example 42: Cancel Order
const cancelOrderResponse1 = await axios.put(`${baseUrl}/orders/cancel/${orderId1}`);
console.log("Cancel Order Response:", cancelOrderResponse1.data);

// Example 43: Cancel Another Order
const cancelOrderResponse2 = await axios.put(`${baseUrl}/orders/cancel/${orderId2}`);
console.log("Cancel Another Order Response:", cancelOrderResponse2.data);

// Example 44: Update Order to In-Transit
const updateOrderInTransit1 = await axios.put(`${baseUrl}/orders/in-transit/${orderId1}`);
console.log("Update Order to In-Transit Response:", updateOrderInTransit1.data);

// Example 45: Update Another Order to In-Transit
const updateOrderInTransit2 = await axios.put(`${baseUrl}/orders/in-transit/${orderId2}`);
console.log("Update Another Order to In-Transit Response:", updateOrderInTransit2.data);

// Example 46: Update Order to Delivered
const updateOrderDelivered1 = await axios.put(`${baseUrl}/orders/delivered/${orderId1}`);
console.log("Update Order to Delivered Response:", updateOrderDelivered1.data);

// Example 47: Update Another Order to Delivered
const updateOrderDelivered2 = await axios.put(`${baseUrl}/orders/delivered/${orderId2}`);
console.log("Update Another Order to Delivered Response:", updateOrderDelivered2.data);

// Example 48: Update Product Status to In-Transit in an Order
const updateProductInTransit = await axios.put(`${baseUrl}/orders/${orderId1}/products/${productId1}/in-transit`);
console.log("Update Product to In-Transit Response:", updateProductInTransit.data);

// Example 49: Update Another Product Status to In-Transit in an Order
const updateAnotherProductInTransit = await axios.put(`${baseUrl}/orders/${orderId2}/products/${productId2}/in-transit`);
console.log("Update Another Product to In-Transit Response:", updateAnotherProductInTransit.data);

// Example 50: Update Product Status to Delivered in an Order
const updateProductDelivered = await axios.put(`${baseUrl}/orders/${orderId1}/products/${productId1}/delivered`);
console.log("Update Product to Delivered Response:", updateProductDelivered.data);

// Example 51: Update Another Product Status to Delivered in an Order
const updateAnotherProductDelivered = await axios.put(`${baseUrl}/orders/${orderId2}/products/${productId2}/delivered`);
console.log("Update Another Product to Delivered Response:", updateAnotherProductDelivered.data);


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
