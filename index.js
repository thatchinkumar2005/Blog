import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
const app = express();
const port = 3000;

var blog_content;
var blogList;
var edit_id;

fs.readFile("blogs/blogs_list.json", (err, dat)=>{
    blogList = JSON.parse(dat);
 });



app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("./public"))

app.get("/", (req, res)=>{

    fs.readFile("blogs/blogs_list.json", (err, dat)=>{
        blogList = JSON.parse(dat);
     });
     
     res.render("index.ejs", {blogList : blogList});
});


app.get("/read", (req, res)=>{
    var blog_id = req.query.id;

    fs.readFile("blogs/blog" + blog_id + ".json", "utf-8", (err, dat)=>{
        var blog = JSON.parse(dat);
        blog_content = blog.content;
        blog_id = blog.blog_id;
        var blog_title = blog.blog_title;
        res.render("read.ejs", {
            id : blog_id,
            content  : blog_content,
            blog_title:blog_title
        })
        
    });

})

app.get("/create", (req, res)=>{
    res.render("create.ejs");
})

app.post("/save", (req, res)=>{
    var new_blog_title = req.body.title;
    var new_blog_content = req.body.content
    
    fs.readFile("blogs/blogs_list.json", (err, dat)=>{
        blogList = JSON.parse(dat);
     });

     if(blogList.length===0){
        id = 1;
     }else{
         
         var id = blogList[blogList.length - 1].id + 1;
     }

     
     blogList.push({id : id, blog_title : new_blog_title});

     fs.writeFile("blogs/blogs_list.json", JSON.stringify(blogList), (err)=>{
        if (err) throw err;
        console.log("success!");
     });

    

     var blog = {
        blog_id : id,
        blog_title : new_blog_title,
        content : new_blog_content,
        author : "me"
     }

     fs.writeFile("blogs/blog"+id+".json", JSON.stringify(blog), (err)=>{
        if (err) throw err;
        console.log("Success!");
     })

     res.redirect("/");


     

     

})

app.get("/edit", (req, res)=>{

    edit_id = req.query.id;

    fs.readFile("blogs/blog" + edit_id + ".json", "utf-8", (err, dat)=>{
        var blog = JSON.parse(dat);
        var blog_title = blog.blog_title;
        var blog_content = blog.content;
        var blog_author = blog.author;

        res.render("edit.ejs", {
            blog_title : blog_title,
            content : blog_content,
            id : edit_id
            })

        
    });



})

app.post("/edit_save", (req, res)=>{
    var edit_id = req.query.id;
    var edit_title = req.body.title;
    var edit_content = req.body.content;

    // fs.unlink("blogs/blog"+edit_id+".json");

    //Modifying the bloglist json

    fs.readFile("blogs/blogs_list.json", "utf-8", (err, dat)=>{
        blogList = JSON.parse(dat);
    })

    for(var i = 0; i<blogList.length; i++){
        if(blogList[i].id == edit_id){
            blogList[i].blog_title = edit_title;
            
        }

    }

    fs.writeFile("blogs/blogs_list.json", JSON.stringify(blogList) , (err)=>{
        console.log("success");
    });

    var edit_blog = {
        blog_id : edit_id,
        blog_title : edit_title,
        content : edit_content,
        author : "me"
    }

    fs.writeFile("blogs/blog"+edit_id+".json", JSON.stringify(edit_blog), (err)=>{
        console.log("success");
    })

    res.redirect("/")



})

app.get("/delete", (req, res)=>{
    var del_id = req.query.id

    fs.readFile("blogs/blogs_list.json", "utf-8", (err, dat)=>{
        blogList = JSON.parse(dat);
    })

    for(var i = 0; i<blogList.length; i++){
        if(blogList[i].id == del_id){
            blogList.splice(i, 1);
        }
    }

    fs.writeFile("blogs/blogs_list.json", JSON.stringify(blogList) , (err)=>{
        console.log("success");
    });

    fs.unlink("blogs/blog"+edit_id+".json", (err)=>{
        console.log("unlinked!");
    })

    res.redirect("/")


})
            





app.listen(port, ()=>{
    console.log(`Server running successfully on ${port}`);
})