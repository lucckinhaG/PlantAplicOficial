import Realm from "realm";
import LoteSchema from "../Schemas/LoteSchema";
import ProductsSchema from "../Schemas/ProductsSchema";

export default async function getRealm() {
    return await Realm.open({
        path: "my-products",
        schema: [LoteSchema, ProductsSchema],
        schemaVersion: 26,
    });
}