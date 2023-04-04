export default class LoteSchema extends Realm.Object {
    static schema = {
        name: 'Lote',
        primaryKey: '_id',
        properties: {
            _id: { type: 'int', indexed: true },
            createDate: 'string',
            fazenda: 'string',
            operador: 'string',
            veiculo: 'string',
            identific: 'string',
            area: 'string',
            tanque: 'string',
            vazao: 'string',
            plantio: 'string',
            haaplic: 'string',
            fullaplic: 'string',
            unfullaplic: 'string',
            produtos: 'Products[]',
        }
    }
}