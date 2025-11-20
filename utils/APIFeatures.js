class APIFeature {
  constructor(products, query) {
    this.products = products;
    this.query = query;
  }

  search() {
    //SEARCH FEATURES
    let productName = this.query.keyword
      ? {
          name: {
            $regex: this.query.keyword,
            $options: "i",
          },
        }
      : {};
    this.products.find({ ...productName });
    return this;
  }

  filter() {
    const queryCopy = { ...this.query };
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((field) => delete queryCopy[field]);

    const normalized = {};
    for (const key in queryCopy) {
      const val = isNaN(queryCopy[key])
        ? queryCopy[key]
        : Number(queryCopy[key]);
      const match = key.match(/^([^\[\]]+)\[([^\]]+)\]$/);

      if (match) {
        const [, field, opRaw] = match;
        const op = opRaw;
        (normalized[field] ||= {})[op] = val;
      } else {
        normalized[key] = val;
      }
    }

    let query = JSON.stringify(normalized);
    query = query.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    const filterObj = JSON.parse(query);

    if (filterObj.price) {
      filterObj.$expr = {
        $and: [
          filterObj.price.$gte !== undefined
            ? { $gte: [{ $toDouble: "$price" }, filterObj.price.$gte] }
            : {},
          filterObj.price.$lte !== undefined
            ? { $lte: [{ $toDouble: "$price" }, filterObj.price.$lte] }
            : {},
        ].filter(Boolean),
      };
    }
    if (filterObj.ratings) {
      filterObj.$expr = {
        $and: [
          filterObj.ratings.$gte !== undefined
            ? { $gte: [{ $toDouble: "$ratings" }, filterObj.ratings.$gte] }
            : {},
        ].filter(Boolean),
      };
    }
    this.products = this.products.find(filterObj);
    return this;
  }
  pageinte(resPerPage) {
    //PAGES CONTROLL FEATURES
    const currentPage = Number(this.query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.products.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeature;
