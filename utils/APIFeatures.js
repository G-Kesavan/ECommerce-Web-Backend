class APIFeature {
    constructor(products, query){
        this.products = products
        this.query = query
    }

    search(){   //SEARCH FEATURES
        let productName = this.query.productName?{
            name:{
                $regex:this.query.productName,
                $options: 'i'
            }  
        }:{}
        this.products.find({...productName})
        return this;
    } 

    filter() {      //FILTER FEATURES
        const queryCopy = { ...this.query };
        const removeFields = ['productName', 'limit', 'page'];
        removeFields.forEach(field => delete queryCopy[field]);

        const normalized = {};      //NORMALIZED
        for (const key in queryCopy) {
            const val = isNaN(queryCopy[key]) ? queryCopy[key] : Number(queryCopy[key]);
            const match = key.match(/^([^\[\]]+)\[([^\]]+)\]$/);

            if (match) {
                const [ , field, opRaw ] = match;
                const op = opRaw.startsWith('$') ? opRaw : `${opRaw}`;
                (normalized[field] ||= {})[op] = val;
            } else {
                normalized[key] = val;
            }
        }
        let query = JSON.stringify(normalized);

        query = query.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        this.products.find(JSON.parse(query));
        return this;
    }

    pageinte(resPerPage){       //PAGES CONTROLL FEATURES
        const currentPage = Number(this.query.page) || 1; 
        const skip = resPerPage *  (currentPage -1);
        this.products.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeature