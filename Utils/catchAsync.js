module.exports = myfn =>{
    return (req, res, next)=>{
        // myfn(req, res, next).catch((err) => {
        //     console.log(err)
        //     next(err)
        // })
        myfn(req, res, next).catch(next)
    }
}