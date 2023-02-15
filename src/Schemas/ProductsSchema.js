export default class ProductsSchema extends Realm.Object {
    static schema = {
        name: 'Products',
        primaryKey: '_id',
        properties: {
            _id: { type: 'int', indexed: true },
            produto: 'string',
            doseha: 'string',
            completa: 'string',
            incompleta: 'string',
            totalaplic: 'string',
        }
    }
}