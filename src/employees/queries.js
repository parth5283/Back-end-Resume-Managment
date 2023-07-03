const getEmployee = "select * from employeepersonaldetails";
const getUser = "SELECT username,password FROM userdetails WHERE username = $1 AND password = $2";
const getEmployeeById = "SELECT  * FROM employeepersonaldetails where employeeid = $1";
const checkEmailExists = "select * from employeepersonaldetails epd WHERE epd.email =$1";
const addEmployee =
"insert into employeepersonaldetails(name,email,phonenumber,address,zipcode,profilesummary) VALUES($1,$2,$3,$4,$5,$6) returning employeeid";
const removeEmployee =  "delete from employeepersonaldetails where employeeid =$1 ";
const updateEmployee ="update employeepersonaldetails SET name = $1,email = $2 WHERE employeeid = $3";
const downloadPDF ="SELECT resumefile FROM employeepersonaldetails WHERE employeeid = $1";
const addProjectDetails = "insert into employeeprojectdetails(employeeid,projectname,startdate,enddate,technologiesused,rolesandresponsibilities,projectdescription) VALUES($1,$2,$3,$4,$5,$6,$7)";
const addCertificateDetails = "insert into certificateandskillsdetails(employeeid,certificationname,certificationdate,certificationexpirydate,technicalskills) VALUES($1,$2,$3,$4,$5)";
const getProjects = "select projectname,startdate,enddate,technologiesused,rolesandresponsibilities,projectdescription from employeeprojectdetails";
module.exports ={
    getEmployee,getEmployeeById,checkEmailExists,addEmployee,removeEmployee,updateEmployee,downloadPDF,getUser,
    addProjectDetails,getProjects,addCertificateDetails
}