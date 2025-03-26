// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string productId; // MongoDB's ObjectId (for reference)
        string farmerId;  // Farmer's ID from MongoDB
        uint256 price;    // Product price in Wei
        uint256 timestamp; // Timestamp for authenticity
    }

    mapping(string => Product) public products;

    event ProductAdded(string productId, string farmerId, uint256 price, uint256 timestamp);

    // ➤ Add Product Reference (Admin Signs the Transaction)
    function addProduct(string memory _productId, string memory _farmerId, uint256 _price) public {
        require(bytes(products[_productId].productId).length == 0, "Product already exists.");

        products[_productId] = Product({
            productId: _productId,
            farmerId: _farmerId,  // Store farmer's MongoDB ID instead of wallet
            price: _price,
            timestamp: block.timestamp
        });

        emit ProductAdded(_productId, _farmerId, _price, block.timestamp);
    }

    // ➤ Get Product Details
    function getProductDetails(string memory _productId) public view returns (string memory, uint256, uint256) {
        require(bytes(products[_productId].productId).length != 0, "Product not found.");
        Product memory product = products[_productId];
        return (product.farmerId, product.price, product.timestamp);
    }
}
