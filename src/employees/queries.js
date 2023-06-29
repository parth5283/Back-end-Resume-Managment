const getEmployee = "select employeeid,name,email from employeepersonaldetails";
const getUser = "SELECT username,password FROM users WHERE username = $1 AND password = $2";
const getEmployeeById = "SELECT  * FROM employeepersonaldetails where employeeid = $1";
const checkEmailExists = "select * from employeepersonaldetails epd WHERE epd.email =$1";
const addEmployee =
"insert into employeepersonaldetails(name,email,phonenumber,address,zipcode,profilesummary) VALUES($1,$2,$3,$4,$5,$6)";
const removeEmployee =  "delete from employeepersonaldetails where employeeid =$1 ";
const updateEmployee ="update employeepersonaldetails SET name = $1,email = $2 WHERE employeeid = $3";
const downloadPDF ="SELECT resumefile FROM employeepersonaldetails WHERE employeeid = $1";
const addProjectDetails = "insert into employeeprojectdetails(projectname,startdate,enddate,technologiesused,rolesandresponsibilities,projectdescription) VALUES($1,$2,$3,$4,$5,$6)";
const getProjects = "select projectname,startdate,enddate,technologiesused,rolesandresponsibilities,projectdescription from employeeprojectdetails";
module.exports ={
    getEmployee,getEmployeeById,checkEmailExists,addEmployee,removeEmployee,updateEmployee,downloadPDF,getUser,addProjectDetails,getProjects
}