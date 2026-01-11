const config = {
    name:"mark"
}

console.log(config)

if(true){
    config.age = 17
}

console.log(config)


const header = {
    'Content-type':'application/json'
}

header['Authorization'] = `Bearer ${'justine'}`


console.log(header)


const queryParam =  new  URLSearchParams();

queryParam.append('name','JSUTINE');
queryParam.append('age','20')

const baseUrl = `localhost:3000/base?${queryParam.toString()}`


const filters = {
    category: "books",
    price: "low",
    available: true
};


Object.keys(filters).forEach(key=>{
    queryParam.append(key,filters[key])
})

console.log(queryParam.toString())

