class APIFeature {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){
        let productName = this.queryStr.productName?{
            name:{
                $regex:this.queryStr.productName,
                $options: 'i'
            }  
        }:{}
        this.query.find({...productName})
        return this;
    } 

    filter() {
        const queryStrCopy = { ...this.queryStr };
        const removeFields = ['productName', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]);

        const normalized = {};
        for (const key in queryStrCopy) {
            console.log(queryStrCopy,key)
            const val = isNaN(queryStrCopy[key]) ? queryStrCopy[key] : Number(queryStrCopy[key]);
            const match = key.match(/^([^\[\]]+)\[([^\]]+)\]$/);

            if (match) {
                const [ , field, opRaw ] = match;
                const op = opRaw.startsWith('$') ? opRaw : `${opRaw}`;
                (normalized[field] ||= {})[op] = val;
            } else {
                normalized[key] = val;
            }
        }
        let queryStr = JSON.stringify(normalized);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        this.query.find(JSON.parse(queryStr));
        return this;
    }

    pageinte(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1; 
        const skip = resPerPage *  (currentPage -1);
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeature