const bodyParser = require('body-parser');
const { json } = require('body-parser');
const express=require('express');
const router = express.Router();

const conect_sql = require('../modelo_datos_bbdd/conexion_con_bbdd')
const {mostrar_repuesto , crear_repuesto, ingresar_stock, validar_repuerto_id} = require('../modelo_datos_bbdd/operaciones')


router.get('/gerente',(req,res)=>{
    res.render('layouts/gerente_index')
})

router.get('/recepcionista',(req,res)=>{
    res.render('layouts/index-recepcionista')
})

router.get('/crear_orden', (req,res)=>{
    res.render('layouts/crear_orden_trabajo')
})

router.post('/crear_orden_p',async(req,res)=>{  //ejemplo de crear un cliente en sql
    console.log(req.body)
    const { nombrecompleto , dni, localidad, direccion,celular,email,marca,modelo,descripcion_falla } = req.body;
    const error_orden=[]

    if(!nombrecompleto){
        error_orden.push({text:'ingrese nombre completo'})
    }
    if(!dni){
        error_orden.push({text:'ingrese el dni'})
    }
    if(!localidad){
        error_orden.push({text:'ingrese localidad'})
    }
    if(!email){
        error_orden.push({text:'ingrese email'})
    }
    if(!direccion){
        error_orden.push({text:'ingrese direccion'})
    }
    if(!celular){
        error_orden.push({text:'ingrese numero de celular'})
    }
    if(!marca){
        error_orden.push({text:'ingrese marca'})
    }
    if(!modelo){
        error_orden.push({text:'ingrese modelo'})
    }
    if(!descripcion_falla){
        error_orden.push({text:'ingrese descripcion de la falla'})
    }

    if(error_orden.length>0){
        res.render('layouts/crear_orden_trabajo',{
            error_orden,
            nombrecompleto,
            dni,
            localidad,
            direccion,
            celular,
            email,
            marca,
            modelo,
            descripcion_falla
        })
    }

    else{
        celular_int=parseInt(celular)
        dni_int =parseInt(dni)
        const cliente={
            dni : dni_int,
            nombrecompleto,
            celular : celular_int,
            direccion,
            email,
            localidad,
        }

        let datos_traidos //aca se guarda en 1 si ya existe el dni y en 0 sino

        try {
            conect_sql.query(`SELECT COUNT(dni) AS ID FROM clientes WHERE dni =${cliente.dni}`,function(err, rows){ //revisa si ya existe el dni
                if(err)throw err;
                datos_traidos=rows[0].ID
                res.status(200).send('perfecto')
            })
        } catch (err) {
            console.log("huno un error")
            throw err;
        }
        
        if(datos_traidos==1){ //si ya esiste
            res.redirect('/crear_orden_g')
            return
        }
        else{ //si el usuario no existe
            await conect_sql.query('INSERT INTO clientes set ?',[cliente]);
            res.status(200).send('perfecto')
        }

        //else{
          //  await conect_sql.query('INSERT INTO clientes set ?',[cliente]);
           // res.status(200).send('perfecto')
        //}

    }
})


router.post('/crear_orden_existe_usuario',async(req,res)=>{
    const{dni,marca,modelo,descripcion_falla}= req.body
    const error_orden=[]

    if(!dni){
        error_orden.push({text:'Dni incorrecto'})
    }
    if(!marca){
        error_orden.push({text:'marca incorrecta'})
    }
    if(!modelo){
        error_orden.push({text:'modelo incorrecto'})
    }
    if(!descripcion_falla){
        error_orden.push({text:'falta Descripcion'})
    }
    let int_dni=parseInt(dni)

    let orden_trabajo={ //esquema para enviar a la base de datos
        estado: 2,
        descripcion_falla: descripcion_falla,
        fk_marca: marca,
        fk_modelo: modelo,
        fk_cliente: int_dni
    }
    
    try {
        await conect_sql.query(`INSERT INTO orden_trabajo set ?`,[orden_trabajo])
    } catch (err) {
        if(err)throw err;
    }
})

router.get('/crear_orden_g',(req,res)=>{
    res.render('layouts/crear_orden_trabajo_cliente_existe')
})


router.get('/sigin',(req,res)=>{
    res.render('layouts/sigin')
})
router.post('/sigin',(req,res)=>{ //completar
    res.render('layouts/sigin')
})

router.get('/tecnico',(req,res)=>{
    res.render('layouts/mis_ordenes_trabajo')
})

router.get('/tecnico/ordenes',(req,res)=>{
    res.render('layouts/ordenes_trabajo_lista')
})

router.get('/admin',(req,res)=>{
    res.render('layouts/lista_usuario')
})

router.get('/admin/crear_usuario',(req,res)=>{
    res.render('layouts/crear_usuario')
})

router.post('/admin/crear_usuario', async(req,res)=>{
    console.log(req.body)
    const {puesto,DNI,nombreyapellido,fecha_ingreso,numerocelular,email}= req.body

    const error_orden=[]

    if(!DNI){
        error_orden.push({text:'Dni incorrecto'})
    }
    if(!puesto){
        error_orden.push({text:'Puesto incorrecto'})
    }
    if(!nombreyapellido){
        error_orden.push({text:'Nombre Y Apellido incorrecto'})
    }
    if(!fecha_ingreso){
        error_orden.push({text:'falta Fecha de Ingreso'})
    }
    if(!numerocelular){
        error_orden.push({text:'Falta Numero de Celular'})
    }
    if(!email){
        error_orden.push({text:'Email Incorrecto o no Ingresado'})
    }
    let dni_int =parseInt(DNI)
    let numero_int=parseInt(numerocelular)

    let nuevo_usuario_g={ //esquema para enviar a la base de datos (general)
        dni: dni_int,
        puesto: puesto,
        nombreyapellido: nombreyapellido,
        fecha_ingreso: fecha_ingreso,
        numerocelular: numero_int,
        email:email
    }
    let nuevo_usuario_t={ //esquema para enviar a la base de datos (tecnico)
        dni: dni_int,
        nombreyapellido: nombreyapellido,
        fecha_ingreso: fecha_ingreso,
        numerocelular: numero_int,
        email:email
    }
    
    console.log("puesto elegido: "+nuevo_usuario.puesto)
    if(nuevo_usuario.puesto=="TECNICO"){
        try {
            
            await conect_sql.query(`INSERT INTO usuarios_tecnicos set ?`,[nuevo_usuario_t])
        } catch (err) {
            if(err)throw err;
        }
    }
    else{
        try {
            await conect_sql.query(`INSERT INTO usuarios_general set ?`,[nuevo_usuario_g])
        } catch (err) {
            if(err)throw err;
        }
    }
    res.send(200,"usuario creado") //completar con redirect
    

})

router.get('/stock', async(req,res)=>{

    await mostrar_repuesto(conect_sql,(resultado)=>{ //busca los repuestos y los envia al front
        console.log(resultado[0])
        res.render('layouts/lista_repuestos',{resultado})  //completar el front (hbs)

    }) 
})

router.get('/stock/crear_repuesto',(req,res)=>{
    res.render('layouts/crear_repuesto')
})

router.post('/stock/crear_repuesto',async (req,res)=>{
    let error_orden={text:'Repuesto creado con exito'}
    const{ nombre,distribuidor,cantidad,precio,descripcion }=req.body
    let cantidad_int= parseInt(cantidad)
    let precio_int= parseInt(precio)

    let esquema={
        nombre:nombre,
        distribuidor:distribuidor,
        cantidad:cantidad_int,
        precio:precio_int,
        descripcion:descripcion
    }
    try {
        await crear_repuesto(conect_sql,esquema,(datos_res) =>{
            console.log(datos_res)
        })
    } catch (error) {
        console.log(error)
    }
    
    res.redirect('/stock/crear_repuesto')
    return;
})

router.get('/stock/ingresar_stock',(req,res)=>{  //carga los repuestos y los manda al front
    mostrar_repuesto(conect_sql ,(respuesta)=>{
        console.log(respuesta)
        res.render('layouts/sumar_repuesto',{repuestos_de_bbdd:respuesta})
    })
    
})

router.post('/stock/ingresar_stock',(req,res)=>{
    const{repuesto,cantidad}=req.body
    const error_orden=[]

    if(!repuesto && !isNaN(parseInt(repuesto)) ){
        error_orden.push({text:'Error al ingresar Repuesto'})
    }
    if(!cantidad && !isNaN(parseInt(cantidad)) ){
        error_orden.push({text:'Error al ingresar Cantidad'})
    }

    if(error_orden>0){
        res.redirect('/stock/ingresar_stock',{error_orden})
        return
    }
    else{

    }

    let datos={
        id_repuesto:parseInt(repuesto),
        cantidad:parseInt(cantidad)
    }
    validar_repuerto_id

    ingresar_stock(conect_sql,datos,(respuesta)=>{
        console.log(respuesta)
    })
    //res.render('layouts/sumar_repuesto')
})



module.exports=router;
