
const Regexname=/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
document.getElementById('attendance_submit').addEventListener('click',validate);

let myTable = document.getElementById('mytable').getElementsByTagName('tbody')[0];

let row,cell1,cell2,cell3,cell4,cell5,cell6;

let namelist=['Aravind','Ajay','Mukesh','Rani','Malar'];

// 


for(let i=0;i<5;i++){
    row=myTable.insertRow();
    cell1=row.insertCell(0);
    cell2=row.insertCell(1);
    cell3=row.insertCell(2);
    cell4=row.insertCell(3);
    cell5=row.insertCell(4);
    cell6=row.insertCell(5);
    cell1.innerHTML=i+1;
    cell2.innerHTML=namelist[i];
    cell3.innerHTML='<input type="time" class="form-control">';
    cell4.innerHTML='<input type="time" class="form-control">';
    cell5.innerHTML='<input type="checkbox" class="form-check mx-auto my-auto" value="attenance">';
    cell6.innerHTML='<input type="checkbox" class="form-check mx-auto" value="attenance" >';
   
}




function validate(){
    const Name=document.getElementById('attendance_name');
    const Subject=document.getElementById('attendance_subject');
    const ADate=document.getElementById('attendance_date');

    let today=new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today =yyyy+'-'+ mm + '-' + dd ;     

    console.log();
    

    const nameparent=Name.parentElement;
    const subjectparent=Subject.parentElement;
    const dateparent=ADate.parentElement;

    let nameerror=null,subjecterror=null,dateerror=null;

    if(!Name.value.match(Regexname)){
        nameerror='Invalid Name';
    }else if(Subject.value==="--Select --"){
        subjecterror='Select Subject';
    }else if(ADate.value==='' || today<ADate.value || today>ADate.value ){
        dateerror='Invalid Date';
    }

    nameparent.querySelector('.error').innerHTML=nameerror;
    subjectparent.querySelector('.error').innerHTML=subjecterror;
    dateparent.querySelector('.error').innerHTML=dateerror;
}


