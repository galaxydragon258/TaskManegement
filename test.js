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