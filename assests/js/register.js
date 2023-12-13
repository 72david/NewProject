
const Regexemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const RegexPhone=/^(\+\d{1,3}[- ]?)?\d{10}$/;

let Gendervalue;
let updateID;

try{
    fetch('http://localhost:8000/getsubjects').then(res=>{
        return res.json();
    }).then(subjects=>{
        const select=document.getElementById('register_subject');
        
        subjects.forEach(subject=>{
            let option=document.createElement("option");
            option.text=subject.subjectName;
            option.value=subject.subjectID;
            select.appendChild(option);
           
        });
    });
}catch(error){
    console.log(error);
}    




document.getElementById('register_view_hide').addEventListener('click',()=>{
    
    document.getElementById('register_view_hide').style.display="none";
    document.getElementById('student_datas').style.display="none";
    document.getElementById('register_view').style.display="block";

});


document.getElementById('register_back').addEventListener('click',()=>{
    document.getElementById('Preview_container').style.display="none";
});
document.getElementById('register_preview').addEventListener('click',validate);

document.getElementById('register_submit').addEventListener('click',()=>{insertintodatabase('POST','http://localhost:8000/register')});

document.getElementById('register_update').addEventListener('click',()=>{insertintodatabase('PUT','http://localhost:8000/updatedata')});

async function insertintodatabase(Method,url){
   
    let Firstname=document.getElementById('first_name').value;
    let Secondname=document.getElementById('second_name').value;
    let Subject=document.getElementById('register_subject').value;
    let Dateofbirth=document.getElementById('dateofbirth').value;
    selectgender(document.querySelectorAll('input[name="gender"]'));
    let Gender=Gendervalue;
    let Phoneno=document.getElementById('phoneno').value;
    let Email=document.getElementById('register_email').value;
    let Message=document.getElementById('register_message').value;
   
    const update = {
        registerID:updateID,
        firstName: Firstname,
        secondName:Secondname,
        subject: Subject,
        dateOFBirth: Dateofbirth,
        gender:Gender,
        phoneno:Phoneno,
        email:Email,
        message:Message
        };
    

    const request={
        method:Method,
        headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(update),
            };

    try {
      
        const response = await fetch(url,request);

        const data = await response.json();

        document.getElementById('Preview_container').style.display="none";
        setregisterStatusMessage(data.message);

        cleardata();
        
        document.getElementById('students_data_table').querySelector('tbody').innerHTML='';
        insertdatatotable();
        document.getElementById('register_update').style.display='none';
        document.getElementById('register_submit').style.display='block';

      } catch (error) {
        console.log(error);
      }  
}

document.getElementById('register_clear').addEventListener('click',cleardata);







function validate(){

    let Firstname=document.getElementById('first_name');
    let Secondname=document.getElementById('second_name');
    let Subject=document.getElementById('register_subject');
    let Dateofbirth=document.getElementById('dateofbirth');
    let Gender=document.querySelectorAll('input[name="gender"]');
    let Phoneno=document.getElementById('phoneno');
    let Email=document.getElementById('register_email');
    let Message=document.getElementById('register_message');
    let Checkbot=document.getElementById('check_bot');

    const fnameparent=Firstname.parentElement;
    const snameparent=Secondname.parentElement;
    const subjectparent=Subject.parentElement;
    const dateofbirthparent=Dateofbirth.parentElement;
    const genderparent=document.getElementById('gender').parentElement;
    const phonenoparent=Phoneno.parentElement;
    const emailparent=Email.parentElement;
    const messageparent=Message.parentElement;
    const checkparent=Checkbot.parentElement;

    
    Firstname=Firstname.value;
    Secondname=Secondname.value;
    Subject=Subject.value;
    Dateofbirth=Dateofbirth.value;
    Phoneno=Phoneno.value;
    Email=Email.value;
    Message=Message.value;
    Checkbot=Checkbot.checked;
    
    let fnameerror=validatename(Firstname,false),snameerror=validatename(Secondname,true)
        ,gendererror=selectgender(Gender),phonenoerror=validatemobileno(Phoneno)
        ,dateofbirtherror=(Dateofbirth==='')?'Select Date Of Birth':null
        ,emailerror=validateeamil(Email),subjecterror=null
        ,messageerror=null,checkerror=null;
    if(Subject==="--Select --"){
        subjecterror='Select Subject';
    }
    if(Message.length<20){
        messageerror='Atleast 20 characters'
    }
    if(!Checkbot){
        checkerror='Tick check box';
    }


    fnameparent.querySelector('.error').innerHTML=fnameerror;
    snameparent.querySelector('.error').innerHTML=snameerror;
    subjectparent.querySelector('.error').innerHTML=subjecterror;
    phonenoparent.querySelector('.error').innerHTML=phonenoerror;
    dateofbirthparent.querySelector('.error').innerHTML=dateofbirtherror;
    genderparent.querySelector('.error').innerHTML=gendererror;
    emailparent.querySelector('.error').innerHTML=emailerror;
    messageparent.querySelector('.error').innerHTML=messageerror;
    checkparent.querySelector('.error').innerHTML=checkerror;
    
    
    if(null===fnameerror&& null===snameerror&& null===subjecterror && 
        null===phonenoerror && null===dateofbirtherror && null===gendererror
       & null===emailerror && null===messageerror && null===checkerror){

            document.getElementById('prev_name').innerHTML=Firstname+" "+Secondname;
            document.getElementById('prev_phonenumber').innerHTML=Phoneno;
            document.getElementById('prev_subject').innerHTML=Subject;
            document.getElementById('prev_gender').innerHTML=Gendervalue;
            document.getElementById('prev_dateofbirth').innerHTML=Dateofbirth;
            document.getElementById('prev_message').innerHTML=Message;
            document.getElementById('prev_email').innerHTML=Email;
            
        
            document.getElementById('Preview_container').style.display="block";

           
        }
           
}
function setregisterStatusMessage(message){
    const registerStatusmessage=document.getElementById('register_status');
    registerStatusmessage.innerHTML=message;
    setTimeout(()=>{
        registerStatusmessage.innerHTML="";
    },3000);
}

function validatename(name,second){
    let message=null;
    if(name===''){
        if(second)
            return message;
        message="First Name can't be empty";
    }  
    else if(name.match(/[^A-Za-z\s]/g))
        message="Name can contain only Characters";
    return message;
}
function selectgender(gender){
    let message="Select Gender";
    // console.log(gender);
    gender.forEach(element => {
        if(element.checked===true){
            Gendervalue=element.value;
            message= null;
        }
    });
    return message;
}
function validatemobileno(num){
    let message=null;
    if(num==='')
        message="Phone number can't be empty";
    else if(num.match(/[a-zA-z]/g))
        message="Phone number Can't contain characters";
    else if(num.length!=10 && !num.match(/[^0-9]/g))
        message='Phone number Must has 10 number';
    else if(!num.match(RegexPhone))
        message='Invalid Phone Number';
    return message;
}
function validateeamil(email){
    let message=null;
    if(email==='')
        message="Email can't be Empty";
    else if(!email.match(Regexemail))
        message='Invalid Email';
    return message;
}

function cleardata(){
    document.getElementById('first_name').value=null;
    document.getElementById('second_name').value=null;
    document.getElementById('register_subject').querySelectorAll('option')[0].selected='selected';
    document.getElementById('dateofbirth').value=null;
    document.querySelectorAll('input[name="gender"]').forEach(element=>{
        element.checked=false;
    });
    document.getElementById('phoneno').value=null;
    document.getElementById('register_email').value=null;
    document.getElementById('register_message').value=null;
    document.getElementById('check_bot').checked=false;

    document.getElementById('register_update').style.display='none';
    document.getElementById('register_submit').style.display='block';

}


// Table Scripts


document.getElementById('register_view').addEventListener('click',function(){
    
    insertdatatotable();
    const tbody = document.getElementById('students_data_table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";
    document.getElementById('register_view_hide').style.display="block";
    document.getElementById('student_datas').style.display="block";
    document.getElementById('register_view').style.display="none";
});

function insertdatatotable(){
   
    const table=document.getElementById('students_data_table').getElementsByTagName('tbody')[0];

    let sno=0;
    
    fetch("http://localhost:8000/studentsdata")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
       
        data.forEach(data=>{

            sno++;
    
            row=table.insertRow();
         
            row.insertCell(0).innerHTML=sno;
            row.insertCell(1).innerHTML='<td>'+data.firstName+((data.secondName!=null)?" "+data.secondName:"")+'</td>';
            cell3=row.insertCell(2).innerHTML='<td>'+data.phoneno+'</td>';
            cell4=row.insertCell(3).innerHTML='<td>'+data.dateOFBirth+'</td>';
            cell5=row.insertCell(4).innerHTML='<td>'+data.gender+'</td>';
            cell6=row.insertCell(5).innerHTML='<td>'+data.email+'</td>';
            cell7=row.insertCell(6).innerHTML='<td>'+data.subject+'</td>';
            cell8=row.insertCell(7).innerHTML='<td><div class="class="message-cell">'+data.message+'</div></td>';
            cell9=row.insertCell(8).innerHTML='<td class="" >'+
            '<button class="btn btn-success mb-2 me-2" onclick="editstudent('+data.registerID+')">Edit</button>'
            +'<button class="btn btn-danger mb-2" onclick="deletestudentdata('+data.registerID+')">Delete</button></td>';
        });
    })
    .catch(error => {
        console.error(error);
    });
    
}

function editstudent(ID){
    document.getElementById('register_update').style.display='block';
    document.getElementById('register_submit').style.display='none';
    fetch('http://localhost:8000/student?ID='+ID).then(res=>{
        return res.json();
    }).then(data=>{
        updateID=ID;
        setdata(data);
    }).catch(error=>{
        console.log(error);
    });
}

function deletestudentdata(ID){

    if(confirm('Are sure you want to delete this record')){
        fetch("http://localhost:8000/deletedata?ID="+ID, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                return response.json();
               
            }).then(data=>{
                console.log(data);
                document.getElementById('students_data_table').querySelector('tbody').innerHTML='';
                insertdatatotable();
            })
            .catch(error => {
                console.error(error);
            });
    }
}

function setdata(data){
        document.getElementById('first_name').value=data.firstName;
        document.getElementById('second_name').value=data.secondName;
        document.getElementById('register_subject').querySelectorAll('option').forEach(option=>{
            if(option.value===data.subject){
                option.selected='selected';
            }
        })
        document.getElementById('dateofbirth').value=data.dateOFBirth;
        document.querySelectorAll('input[name="gender"]').forEach(element => {
            if(element.value===data.gender){
                element.checked=true;
            }
        });
        
        document.getElementById('phoneno').value=data.phoneno;
        document.getElementById('register_email').value=data.email;
        document.getElementById('register_message').value=data.message;
       
        
}