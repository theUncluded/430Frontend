import React, { useState, useEffect } from 'react';
import { useProducts } from './ProductContext';
import { useCart } from './CartContext';
import { useSearchParams } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
    const { products, loading } = useProducts();
    const { addToCart } = useCart();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const searchTerm = searchParams.get("search") || "";

    useEffect(() => {
        let filtered = products;

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        const minPriceNum = minPrice === '' ? 0 : parseFloat(minPrice);
        const maxPriceNum = maxPrice === '' ? Infinity : parseFloat(maxPrice);
        filtered = filtered.filter(product => product.price >= minPriceNum && product.price <= maxPriceNum);

        if (selectedRatings.length > 0) {
            filtered = filtered.filter(product =>
                selectedRatings.some(range => {
                    const [min, max] = range.split('-').map(Number);
                    return product.rating >= min && product.rating <= max;
                })
            );
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, minPrice, maxPrice, selectedRatings, selectedCategories]);

    const ratingRanges = [
        { label: "4-5 Stars", range: "4-5" },
        { label: "3-4 Stars", range: "3-4" },
        { label: "2-3 Stars", range: "2-3" },
        { label: "1-2 Stars", range: "1-2" }
    ];
    const uniqueCategories = [...new Set(products.map(p => p.category))];

    const handleMinPriceChange = (e) => setMinPrice(e.target.value);
    const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

    const handleRatingChange = (range) => {
        setSelectedRatings(prev =>
            prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
        );
    };

    const handleClearSearch = () => setSearchParams({});

    const sortByNew = () => setFilteredProducts(prev => [...prev].sort((a, b) => b.product_id - a.product_id));
    const sortByPriceAscending = () => setFilteredProducts(prev => [...prev].sort((a, b) => a.price - b.price));
    const sortByPriceDescending = () => setFilteredProducts(prev => [...prev].sort((a, b) => b.price - a.price));
    const sortByRating = () => setFilteredProducts(prev => [...prev].sort((a, b) => b.rating - a.rating));

    if (loading) return <p>Loading products...</p>;

    return (
        <div className="product-list-container">
            <div className="sidebar">
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search for Products"
                        value={searchTerm}
                        onChange={(e) => setSearchParams({ search: e.target.value })}
                    />
                    {searchTerm && (
                        <button onClick={handleClearSearch} className="clear-search-btn">Clear</button>
                    )}
                </div>

                <div className="price-filter">
                    <h3>Price Range</h3>
                    <div className="price-inputs">
                        <label>
                            Min Price:
                            <input
                                type="number"
                                value={minPrice}
                                onChange={handleMinPriceChange}
                                placeholder="0"
                                className="price-input"
                            />
                        </label>
                        <label>
                            Max Price:
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={handleMaxPriceChange}
                                placeholder="500"
                                className="price-input"
                            />
                        </label>
                    </div>
                </div>

                <div id="ratingOptions">
                    <h3>Rating</h3>
                    {ratingRanges.map(({ label, range }) => (
                        <label key={range}>
                            <input
                                type="checkbox"
                                value={range}
                                onChange={() => handleRatingChange(range)}
                            />
                            {label}
                        </label>
                    ))}
                </div>

                <div id="categoryOptions">
                    <h3>Category</h3>
                    {uniqueCategories.map(category => (
                        <label key={category}>
                            <input
                                type="checkbox"
                                value={category}
                                onChange={() => setSelectedCategories(prev =>
                                    prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
                                )}
                            />
                            {category}
                        </label>
                    ))}
                </div>
            </div>

            <div className="product-content">
                <div className="sorting">
                    <button onClick={sortByNew}>Sort by New</button>
                    <button onClick={sortByPriceAscending}>Price Ascending</button>
                    <button onClick={sortByPriceDescending}>Price Descending</button>
                    <button onClick={sortByRating}>Rating</button>
                </div>

                <div className="products">
                    {filteredProducts.map(product => (
                        <div key={product.product_id} className="product-card">
                            <img src={`/Images/p${product.product_id}.jpg`} alt={product.product_name} onError={(e) => e.target.src = '/images/default.jpg'} />
                            <p className="product-rating">Rating: {product.rating}</p>
                            <div className="product-info">
                                <p className="product-title" title={product.product_name}>{product.product_name}</p>
                                <p className="product-price">${product.price}</p>
                            </div>
                            <button onClick={() => addToCart(product)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
