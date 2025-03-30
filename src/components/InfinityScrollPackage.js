import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Card, Space, Typography } from 'antd';

const { Text } = Typography;

const InfinityScrollPackage = () => {
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchMoreItems(); // প্রথমবার ডাটা লোড হবে
    }, []);

    async function fetchMoreItems() {
        const response = await fetch(`https://dummyjson.com/products?limit=10&skip=${page * 10}`);
        const data = await response.json();

        if (data.products.length === 0) {
            setHasMore(false); // যদি নতুন ডাটা না থাকে, তাহলে স্ক্রল বন্ধ হবে
        } else {
            setProducts(prevDatas => [...prevDatas, ...data.products]);
            setPage(prevPage => prevPage + 1);
        }
    }

    return (
        <div>
            <Card title="Infinity Scroll">
                <InfiniteScroll
                    dataLength={products.length} // বর্তমান লিস্টে কয়টি আইটেম আছে সেটা বলে
                    next={fetchMoreItems} // যখন স্ক্রল নিচে নামবে, তখন নতুন ডাটা লোড করার জন্য এই ফাংশন কল হবে
                    hasMore={hasMore} // চেক করে যে নতুন ডাটা আছে কিনা, যদি না থাকে তাহলে আর স্ক্রল হবে না
                    loader={<h4>Loading...</h4>} // নতুন ডাটা লোড হতে থাকলে "Loading..." টেক্সট দেখাবে
                    endMessage={<p style={{ textAlign: "center" }}>No more products to load</p>} // যখন সব ডাটা লোড হয়ে যাবে, তখন এই মেসেজ দেখাবে
                >
                    {products.map((item, index) => (
                        <Card style={{ margin: "10px" }} key={index} type="inner" title={"Price: " + item.price}>
                            <Space direction="vertical">
                                <Text>Description: {item.description}</Text>
                            </Space>
                        </Card>
                    ))}
                </InfiniteScroll>
            </Card>
        </div>
    );
};

export default InfinityScrollPackage;
