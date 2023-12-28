
let Name=document.getElementById('report_name');
let ReportFromDate=document.getElementById('report_from_date');
let ReportToDate=document.getElementById('report_to_date');

const nameparent=Name.parentElement;
const fromdateparent=ReportFromDate.parentElement;
const todateparent=ReportToDate.parentElement;
const reporttable=document.getElementById('report_table');
const attendancereporttable=document.getElementById('AttendanceReporttable').getElementsByTagName('tbody')[0];

//Get name for Select input from database


try{
    fetch('http://localhost:8000/getnames').then(res=>{
        return res.json();
    }).then(datas=>{
        let option=document.createElement('option');
        option.value=[-1,'All'];
        option.text='All';
        Name.appendChild(option);
        datas.forEach(data => {
            option=document.createElement('option');
            option.text=data.Name;
            option.value=[data.RegisterID,data.Name];
            Name.appendChild(option);
        });
    })
}catch(error){
    console.log('Error');
}


//set maximum date in date inputs
let today=new Date();

const mm = String(today.getMonth() + 1).padStart(2, '0'); 
const yyyy = today.getFullYear();
const dd=String(today.getDate()).padStart(2,'0');

ReportFromDate.max= yyyy+'-'+ mm+'-'+dd;
ReportToDate.max= yyyy+'-'+ mm+'-'+dd;


document.getElementById('report_view').addEventListener('click',validate);
function validate(){
   
    let reportname=Name.value;
    let reportfromdate=ReportFromDate.value;
    let reporttodate=ReportToDate.value;

    let nameerror=null,fromdateerror=null,todateerror=null;

    if(reportname==='Name'){
        nameerror='Select Name';
    }
    if(reportfromdate==='' ){
        fromdateerror='Date cannot be Empty';
    }
    if(reporttodate===''){
        todateerror='Date cannot be Empty';
    }
    nameparent.querySelector('.error').innerHTML=nameerror;
    fromdateparent.querySelector('.error').innerHTML=fromdateerror;
    todateparent.querySelector('.error').innerHTML=fromdateerror;

    if(nameerror===null && fromdateerror===null && todateerror===null && datevalidate()==null){
        let row,sno=0;
        reportname=reportname.split(',')
        fetch('http://localhost:8000/getattendancereport?ID='+reportname[0]+'&FDate='+dateformat(reportfromdate)+'&TDate='+dateformat(reporttodate)).then(res=>{
            return res.json();
        }).then(datas=>{
            attendancereporttable.innerHTML='';
            if(datas.length===0){
                reporttable.style.display='none';
                let notfoundmessage=document.getElementById('notfound_message');
                notfoundmessage.innerHTML='No Data in that Date';
                setTimeout(()=>{
                    notfoundmessage.innerHTML=null;
                },3000);

            }else{
                reporttable.style.display='block';
                datas.forEach(data=>{
                    row=attendancereporttable.insertRow();
                    row.insertCell(0).innerHTML=++sno;
                    let namerow=row.insertCell(1);
                    namerow.innerHTML=data.name;
                    namerow.className='text-start';
                    row.insertCell(2).innerHTML=data.date;
                    row.insertCell(3).innerHTML=timeoperation(data.inTime);
                    row.insertCell(4).innerHTML=timeoperation(data.outTime);
                    row.insertCell(5).innerHTML=findhours(data.inTime.split(':'),data.outTime.split(':'))+' '+'Hrs';
                });
            }
        }).catch(error=>{
            console.log(error);
        })
    }
}
function findhours(tin,tout){
    let thour=Number(tout[0])-(Number(tin[0])+1);
    let tmin=Number(60-tin[1])+Number(tout[1]);
    if(60<=tmin){
        tmin-=60;
        thour++;
    }if(tmin===0){
        return thour+':00';
    }
   
    return thour+':'+tmin.toString().padStart(2,'0');
}
function dateformat(d){
    dlist=d.split('-');
    return dlist[2]+'/'+dlist[1]+'/'+dlist[0];
}
function datevalidate(){
    let message;
    if(ReportFromDate.value>ReportToDate.value && ReportToDate.value!=""){
        message="To date must be greater than from date"
    }else{
        message=null;
    }
    todateparent.querySelector('.error').innerHTML=message;
    return message
}
function timeoperation(time){
    let t=time.split(":");
    return t[0]>12? t[0]-12+`:`+ t[1] +` PM` : time+` AM` ;
}