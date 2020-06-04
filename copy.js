var child_process = require('child_process');
var readline = require('readline')
var util = require('util');
var shell = require("shelljs");
var fs=require("fs");

function copy(source, target, callback) {
    child_process.exec(
        util.format('cp -r %s/* %s', source, target), callback);
}

//清空目录
// shell.exec(`cd ../../backstageupload`)
// shell.exec(`deleteFile.sh`,(code, stdout, stderr)=>{
//     if(code){
//         console.log(code)
//     }
//     copyFile()
// });
// fs.readdir("../../backstageupload",(err,files)=>{
//     if(err){
//         console.log(err)
//     }
//     let files1=files.filter((element)=>element!=='.svn'&&element!=='favicon.ico'&&element!=='index.html'&&element!=="manifest.json"&&!element.includes("precache-manifes")&&element!=="robots.txt"&&element!=="service-worker.js");
//     files1.map((element)=>{
//         deleteFolder(`../../backstageupload/${element}`)
//     })
//     //单独删index.html和favicon.ico
//     if(files1.includes("favicon.ico")){
//         fs.unlink(`../../backstageupload/favicon.ico`,(err)=>{if(err)console.log(err)});
//     }
//     if(files1.includes("manifest.json")){
//         fs.unlink(`../../backstageupload/manifest.json`,(err)=>{if(err)console.log(err)});
//     }
//     if(files1.includes("index.html")){
//         fs.unlink(`../../backstageupload/index.html`,(err)=>{if(err)console.log(err)});
//     }
//     console.log("目录已删除");
//     copyFile()
// })
copyAndDeleteFile("../../../target/ztldb-web/manage/");
function copyAndDeleteFile(url){
    fs.readdir(url,(err,files)=>{
        if(err){
            console.log(err)
        }
        let files1=files.filter((element)=>element!=='.svn'&&element!=='favicon.ico'&&element!=='index.html'&&element!=="manifest.json"&&!element.includes("precache-manifes")&&element!=="robots.txt"&&element!=="service-worker.js");
        files1.map((element)=>{
            deleteFolder(`${url}${element}`)
        })
        //单独删index.html和favicon.ico
        if(files1.includes("favicon.ico")){
            fs.unlink(`${url}favicon.ico`,(err)=>{if(err)console.log(err)});
        }
        if(files1.includes("manifest.json")){
            fs.unlink(`${url}manifest.json`,(err)=>{if(err)console.log(err)});
        }
        if(files1.includes("index.html")){
            fs.unlink(`${url}index.html`,(err)=>{if(err)console.log(err)});
        }
        console.log("目录已删除");
        copyFile(url)
    })
}

function deleteFolder(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
// shell.exec(`cd ../../backstageupload;ls | grep -v .svn | xargs rm -rf`,{encoding:'buffer'},(code, stdout, stderr)=>{
//     console.log(code, stdout, stderr)
// })

// shell.cd('../../backstageupload');
// // I assume you actually want to exclude files ending with ".svn", which your
// // original regex didn't correctly specify.
// var nonSvnFiles = shell.ls().grep('-v', '\\.svn$').split(os.EOL);
// shell.rm('-rf', nonSvnFiles)
// shell.exec(`ls`)
// shell.exec(`cd ../../backstageupload;rm -rf !(.svn)`)
// shell.exec(`ls | grep -v .svn | xargs rm -rf`)

function copyFile(url){
//复制
    copy("./dist", url, function(err) {
        if (err) {
            console.log(err)
        }
        console.log(`文件已复制`)
        question()
    });
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function question(){
    rl.question('是否提交(y/n)', (answer) => {
        if (answer === 'y') {
            submit()
        } else {
            rl.close();
        }
    })
}
function submit() {
    rl.question('请输入提交信息:  ', (answer) => {
        //提交文件
        shell.cd('../../../target/ztldb-web/manage/');
        shell.exec("pwd")
        // shell.exec(`svn propset svn:ignore node_modules`)
        shell.exec(`svn add * --force`);
        shell.exec(`svn ci -m ${answer}`);
        shell.exec(`explorer .`);
    });
}