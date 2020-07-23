const fs = require ("fs")
const data = require ("./data.json")
const utils = require ("./utils")
const intl = require ("intl")

exports.index = function (req,res) {
    
    let teachers = data.teachers.map( teacher => {
        const newTeacher = {
            ...teacher,
            materias: teacher.materias.split (",")
        }
        return newTeacher
    })


    return res.render("teachers", {teachers})

    
}

exports.post = function (req,res) {

    const keys = Object.keys (req.body)

    for (key of keys) {
        if (req.body[key] == "") {
          return res.send ("Por favor, preencha todos os campos!!")
        }
    }


    let {avatar_url,name,birth,escolaridade,tipo_aula,materias} = req.body

    birth = Date.parse (birth)
    const created_at = Date.now()
    const id = Number (data.teachers.length + 1)

    data.teachers.push ({
        id,
        name,
        avatar_url,
        birth,
        escolaridade,
        tipo_aula,
        materias,
        created_at
    })

    fs.writeFile ("data.json", JSON.stringify (data, null, 2), function (err){
        if (err) return res.send ("Write files error!")
    
        return res.redirect ("/teachers")
    })
}

exports.show = function (req,res) {

    const {id} = req.params 
    const foundTeacher = data.teachers.find (function (teachers){
        return teachers.id == id
    }) 
    
    if (!foundTeacher) return res.send("Professor(a) não encontrado!!")

    const teachers = {
        ...foundTeacher,
        age: utils.age(foundTeacher.birth),
        escolaridade: utils.graduation(foundTeacher.escolaridade),
        tipo_aula: foundTeacher.tipo_aula.split(","),
        materias: foundTeacher.materias.split(","),
        created_at: new intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at),
    }

    return res.render("show-teacher", {teachers})
}

exports.edit = function (req,res) {

    const {id} = req.params 
    const foundTeacher = data.teachers.find (function (teachers){
        return teachers.id == id
    }) 
    
    if (!foundTeacher) return res.send("Professor(a) não encontrado!!")

    const teacher = {
        ...foundTeacher,
        birth: utils.date(foundTeacher.birth)
    }

    return res.render ("teacher-edit", {teacher})

}

exports.put = function (req,res) {

    const {id} = req.body 
    let index = 0 

    const foundTeacher = data.teachers.find (function (teachers, foundIndex) {
        if ( id == teachers.id) { 
            index = foundIndex
            return true    
        }
    })  
    
        if (!foundTeacher) return res.send("Professor(a) não encontrado!!")
    
         const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
        }

        data.teachers[index] = teacher

        fs.writeFile ("data.json", JSON.stringify (data,null,2), function (err) {
            if (err) return res.send ("Professor(a) não encontrado!!")

            return res.redirect (`/teachers/${id}`)
            
        })

}

exports.delete = function (req,res) {

    const {id} = req.body

    const filteredTeacher = data.teachers.filter (function (teacher) {
        return teacher.id != id
    })

    data.teachers = filteredTeacher 

    fs.writeFile ("data.json", JSON.stringify (data,null,2), function (err) {
        if (err) return res.send ("Professor(a) não encontrado!!")

        return res.redirect (`/teachers`)
        
    })


}