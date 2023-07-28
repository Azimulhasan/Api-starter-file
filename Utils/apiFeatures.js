class APIFeatures{
    constructor(query, queryString){
        this.query = query
        this.queryString = queryString
    }
    filter(){
        // catching quary data
        const queryObj = { ...this.queryString }

        // excluding some fields
        const excludedFlelds = ['page','sort','limit','fields']
        excludedFlelds.forEach((el)=> delete queryObj[el])

        // Adding to $ to [gte/gt/lte/lt]
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr))
        
        return this
    }
    sort(){
        // Sorting method
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
  
        }else{
            this.query = this.query.sort("-createdAt")
        }

        return this
    }
    limitFields(){
        //Field Limiting
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ')
            console.log(fields)
            this.query = this.query.select(fields)
        }else{
            this.query = this.query.select('-__v')
        }
        return this
    }
    
    pagination(){
        //Pagination Functions
        const page = this.queryString.page * 1 || 1; // defaults as 1 if page was not provided
        const limit = this.queryString.limit * 1 || 10
        const skip = (page - 1) * limit 

        this.query = this.query.skip(skip).limit(limit)

        // if(this.queryString.page){
        //     const newNFTs = await NFT.countDocuments()
        //     if(skip >= newNFTs) {
        //         throw (new Error("This page does not exist") )
        //     }
        // }

        return this

    }
    
}

module.exports = APIFeatures