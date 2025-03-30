import React, { useEffect, useRef, useState } from 'react'

import { Card, Space, Typography } from 'antd';
const { Text, Link } = Typography;

const InfinityScroll = () => {

    const [products, setProducts] = useState([]);

    const [hasMore, setHasMore] = useState(true)

    const [page, setPage] = useState(0)

    const elementRef = useRef(null);

    function onIntersection(entries) {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMore) {
            fetchMoreItems()
        }
    }

    useEffect(() => {
        // Intersection Observer তৈরি করছি, যা scroll করার সময় নির্দিষ্ট element এর সাথে ইন্টারসেক্ট হচ্ছে কিনা তা চেক করবে
        const observer = new IntersectionObserver(onIntersection)

        // যদি observer এবং elementRef (যেটা লোডিং ডিভ কে পয়েন্ট করছে) থাকে, তাহলে সেটিকে observe করবো
        if (observer && elementRef.current) {
            observer.observe(elementRef.current)
        }

        // যখন component unmount হবে, তখন observer disconnect করে দিচ্ছি
        return () => {
            if (observer) {
                observer.disconnect()
            }
        }
    }, products) // যখন products আপডেট হবে তখন effect পুনরায় চলবে


    async function fetchMoreItems() {
        // fetch the next batch of products
        const response = await fetch(`https://dummyjson.com/products?limit=10&skip=${page * 10}`)

        const data = await response.json()
        if (data.products.length == 0) {
            setHasMore(false)
        } else {
            setProducts(prevDatas => [...prevDatas, ...data.products])
            setPage(prevPage => prevPage + 1)
        }
    }

    return (
        <div>

            <Card title="Infinity Scroll">

                {products &&
                    products.map((item, index) => (

                        <Card style={{ margin: "10px" }} key={index} type="inner" title={"Price: " + item.price} >
                            <Space direction="vertical">
                                <Text>description: {item.description}</Text>
                            </Space>
                        </Card>
                    ))}

                {
                    hasMore &&
                    <div ref={elementRef}>Load More ....</div>
                }


            </Card>

        </div>
    )
}

export default InfinityScroll