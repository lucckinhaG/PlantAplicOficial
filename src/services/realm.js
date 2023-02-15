import Realm from "realm";
import ProductsSchema from "../Schemas/ProductsSchema";

export default async function getRealm() {
    return await Realm.open({
        path: "my-products",
        schema: [ProductsSchema]
    });
}