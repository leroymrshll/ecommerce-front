import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";

export default function HomePage({product, newProducts}) {
    return (
        <div>
            <Header />
            <Featured product={product} />
            <NewProducts products={newProducts} />
        </div>
    );
}

export async function getServerSideProps () {
    const featuredProductId = "662fca3580b56bd68e5d0668";
    await mongooseConnect();
    const product = await Product.findById(featuredProductId);
    const newProducts = await Product.find({}, null, {sort: {"_id" : -1}, limit: 6});
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
        }
    }
}