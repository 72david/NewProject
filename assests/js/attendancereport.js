
const Regexname=/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
document.getElementById('attendancereport_submit').addEventListener('click',validate);
function validate(){
    let Name=document.getElementById('attendance_name');
    let Subject=document.getElementById('attendance_subject');
    let ADate=document.getElementById('attendance_month');
    
    const nameparent=Name.parentElement;
    const subjectparent=Subject.parentElement;
    const dateparent=ADate.parentElement;

    Name=Name.value;
    Subject=Subject.value;
    ADate=ADate.value;

    let thismonth=new Date();
   
    const mm = String(thismonth.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = thismonth.getFullYear();

    thismonth =yyyy+'-'+ mm;

    console.log(ADate.value>thismonth);
    

    

    let nameerror=null,subjecterror=null,montherror=null;

    if(!Name.match(Regexname)){
        nameerror='Invalid Name';
    }else if(Subject==="--Select --"){
        subjecterror='Select Subject';
    }else if(ADate==='' || ADate<'2022-01' || ADate > thismonth ){
        montherror='Invalid Date';
    }

    nameparent.querySelector('.error').innerHTML=nameerror;
    subjectparent.querySelector('.error').innerHTML=subjecterror;
    dateparent.querySelector('.error').innerHTML=montherror;
}