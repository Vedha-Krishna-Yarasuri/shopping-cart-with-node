var mongojs = require("mongojs");
var db = mongojs(connectionString,[collections]);
var express=require("express");
var app = express();


app.use(express.static("public"));
app.get("/login",function(req,res)
{
	res.sendFile(__dirname+"/public/login.html");
});

app.get("/register",function(req,res)
{
	res.sendFile(__dirname+"/public/register.html");
});

var m="";
var b="";
app.get("/login-done",function(req,res)
{

	var object={
		email:req.query.username,
		password:req.query.passwd
	}


	db.practicals.find(object,function(err,data)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(data.length>0)
			{ 
				db.practicals.update({ email:data[0].email},{$set:{status:1}});
				console.log(data);
				res.sendFile(__dirname+"/public/cart.html");
				console.log("Status Updated")
			
				
			}
			else
			{
				res.send("entered details are wrong")
			}
		}
	});

});


app.get("/register-done",function(req,res)
{
	if(req.query.password_1==req.query.password_2)
	{		
		var m=req.query.number;


			var obj={
				fname:req.query.firstname,
				lname:req.query.lastname,
				email:req.query.username,
				password:req.query.password_1,
				mobile:m,
				status:0
			}
			var new_obj={
						email:req.query.username,
					}

			db.practicals.insert(obj,function(err,data)
			{	
				if(err)
				{
					console.log(err)
				}
				else
				{
					res.sendFile(__dirname+"/public/login.html")
				}
			});



			db.practcals.insert(new_obj,function(err,data)
			{
				if(err)
					console.log(err);
				else
					console.log("ALL SET FOR NEW USER");
			})
		
	}
	else
	{
		res.send("passwords do not match");
	}

	
});

app.get('/orders',function(req,res)
{
	var check={
		status:1
	}



var items=	{
				phone:req.query.quantity1,
				laptop:req.query.quantity2,
				tv:req.query.quantity3,
				fridge:req.query.quantity4,
				sofa:req.query.quantity5
			}

var keys=Object.keys(items);
var values=Object.values(items);
console.log(keys);
console.log(values);

var last = keys.length;
	db.practicals.find(check,function(err,data)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(data.length>0)
			{
				console.log(data[0].email);
				var change={
					email:data[0].email
				}
				
				db.practcals.find(change,function(err,data)
				{
					
					if(err)
					{
						console.log(err);
					}
					else
					{
						if (data.length>0)
						{
							for(i=0;i<last;i++)
							{

							if(values[i]>0)
							{
								var key=keys[i];
								key=key.toString();
								var val=values[i];
								val=val.toString();
								var hi=JSON.parse('{ "keys[i].toString()":"values[i].toString()" }');
								db.practcals.update(change,{$set:hi});
							}
						}
							
					}
					}

				})
			 }
		}
	})

});


app.listen(4000,function()
{
	console.log("SERVER STARTED SUCCESSFULLY................")
})
