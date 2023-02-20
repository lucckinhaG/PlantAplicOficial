export default class LoteSchema extends Realm.Object {
    static schema = {
        name: 'Lote',
        primaryKey: 'name',
        properties: {
            operador: 'string',
            veiculo: 'string',
            identific: 'string',
            area: 'string',
            tanque: 'string',
            vazao: 'string',
            haaplic: 'string',
            fullaplic: 'string',
            unfullaplic: 'string',
            produtos: 'Products[]',
        }
    }
}