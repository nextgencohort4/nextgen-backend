const Product = require('../models/product');

// Recommend products based on same size or price
const recommendProducts = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find products with the same size or price
        const recommendedProducts = await Product.find({
            $or: [
                { sizes: { $in: product.sizes } },
                { price: product.price }
            ],
            _id: { $ne: productId } // Exclude the original product
        });

        res.status(200).json(recommendedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {recommendProducts}