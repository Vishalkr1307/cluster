const cluster=require("cluster")
const cpPlus=require("os").cpus().length

const  express=require("express")


if(cluster.isPrimary){
    console.log(`Master ${process.pid} running`)
    for(var i=0;i<cpPlus;i++){
        cluster.fork()
    }
}
else{
    
    const app = express()
    app.use(express.json())
    const port=2345
    const {exec,execFile,fork,spawn}=require("child_process")
    
    // exec("find /",(err,stdout,stderr)=>{
    //     if(err){
    //         console.log(`Error: ${err.message}`)
    //         return
    //     }
    //     if(stderr){
    //         console.log(`Error: ${stderr.message}`)
    //         return
    //     }
    //     console.log(stdout)

    // })
    // execFile("./demo.md",(err,stdout,stderr)=>{
    //     if(err){
    //         console.log(`Error: ${err.message}`)
    //         return
    //     }
    //     if(stderr){
    //         console.log(`Error: ${stderr.message}`)
    //         return
    //     }
    //     console.log(stdout)

    // })
    // var child=spawn("find",['/'])

    // child.stdout.on("data",(data)=>{
    //     console.log(`stdout: ${data}`)
    // })
    // child.stderr.on("data",(data)=>{
    //     console.log(`stderr: ${data}`)
    // });
    // child.on("error",(err)=>{
    //     console.log(`error: ${err.message}`)
    // })

    // child.on("exit",(code,signal)=>{
    //     if(code) console.log(`process exited with code ${code}`)
    //     if(signal) console.log(`process killed with signal ${signal}`)
    //     console.log("exit code")


    // })
    app.get("/one",(re,res)=>{
        var sum=0;
        for(var i=0;i<1e9;i++){
            sum+=i
        }
        res.status(200).json(sum);
    })
    app.get("/two",async (req,res)=>{
        const data=await new Promise((res,rej)=>{

            var sum=0;
            for(var i=0;i<1e9;i++){
                sum+=i
            }
            res(sum)
        })
        res.status(200).json(data)
    })

    app.get("/three",(req,res)=>{
        const child=fork("./longtask.js")
       
        child.send("start")
        child.on("message",(sum)=>{
            res.status(200).json(sum)
        })
    })


    app.get("/",(req,res)=>{
        res.send({message:process.pid})
    })
    app.listen(port,()=>{
        console.log(`Running ${process.pid}, listening on ${port}`)
    })

}