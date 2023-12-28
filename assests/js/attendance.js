const intime=document.getElementById('in_time');
const outtime=document.getElementById('out_time');
const Name=document.getElementById('namelist');
const Attendance_date=document.getElementById('attendance_date');


const intimeparent=intime.parentElement;
const outtimeparent=outtime.parentElement;
const nameparent=Name.parentElement;
const dateparent=Attendance_date.parentElement;

const addbutton= document.getElementById('attendance_add');
const updatebutton= document.getElementById('attendance_update');
const updatecancelbutton=document.getElementById('attendance_update_cancel');

let today=new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();

today =yyyy+'-'+ mm + '-' + dd ; 
Attendance_date.max=today;




addbutton.addEventListener('click',()=>{validate('http://localhost:8000/addattendance','POST')});
updatebutton.addEventListener('click',()=>{validate('http://localhost:8000/updateattendace','PUT')});

fetch('http://localhost:8000/getnames').then(res=>{
    return res.json();
}).then(data=>{
    data.forEach(element => {
        var option=document.createElement('option');

        option.text=element.Name;
        option.value=[element.RegisterID,element.Name];
        Name.appendChild(option);
    });
}).catch(error=>{
    console.log("Error");
});

function validateouttime(){
    let Intime=intime.value;
    let Outtime=outtime.value;
    if(Intime>=Outtime && Outtime!=''){
        let error="Out-time must be Greaterthan in-time";
        outtimeparent.querySelector('.error').innerHTML=error;
        return error;
    }else{
        outtimeparent.querySelector('.error').innerHTML='';
        return null;
    }
}

function validate(url,m){

    let nameerror=null,intimeerror=null,outtimeerror=null,dateerror=null;

    let studentname=Name.value;
    let Intime=intime.value;
    let Outtime=outtime.value;
    let Attendancedate=Attendance_date.value;
    

    if(studentname==='Name'){
        nameerror="Select Name";
    }
    if(Attendancedate===''){
        dateerror='Date cannot be Empty';
    }
    if(Intime===''){
        intimeerror='Intime cannot be Empty';
    }
    if(Outtime===''){
        outtimeerror='Outime cannot be Empty';
    }else{
        outtimeerror=validateouttime();
    }

    nameparent.querySelector('.error').innerHTML=nameerror;
    intimeparent.querySelector('.error').innerHTML=intimeerror;
    outtimeparent.querySelector('.error').innerHTML=outtimeerror;
    dateparent.querySelector('.error').innerHTML=dateerror;

    
    if(nameerror===null && intimeerror===null && outtimeerror===null && dateerror===null){
        studentname=studentname.split(',');
        let datelist=Attendancedate.split('-');
        Attendancedate=datelist[2]+'/'+datelist[1]+'/'+datelist[0];
        let newid=studentname[0].toString()+datelist[2].toString()+datelist[1].toString()+datelist[0].toString();
        const request={
            method:m,
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                registerID:studentname[0],  
                date:Attendancedate,
                name:studentname[1],
                inTime:Intime.substring(0,5),
                outTime:Outtime.substring(0,5),
                attendanceID:newid,
            },)
        };
        try{
            fetch(url,request).then(res=>{
                return res.json();
            }).then(data=>{
                setsucessmessage(data.message);
                clearinput();
                addattendancedadtaintable();
            })
        }catch(error){
            console.log("ERROR");
        }
        if(m==='PUT'){
            addbutton.style.display='block';
            updatebutton.style.display='none';
            updatecancelbutton.style.display='none';
            Name.disabled='';
        }
    }
}

function setsucessmessage(message){
    const Smessage=document.getElementById('success_message');
    Smessage.innerHTML=message;
    setTimeout(() => {
        Smessage.innerHTML=null;
    }, 3000);
}
function clearinput(){
    Name.value='';
    intime.value='';
    outtime.value='';
    Attendance_date.value='';
}

updatecancelbutton.addEventListener('click',()=>{
    clearinput();
    addbutton.style.display='block';
    updatebutton.style.display='none';
    updatecancelbutton.style.display='none';
    Name.disabled='';
});

// Table
let myTable = document.getElementById('mytable').getElementsByTagName('tbody')[0];

addattendancedadtaintable();    



function addattendancedadtaintable(){
    myTable.innerHTML='';
    let row,sno=0;
    try{
        fetch('http://localhost:8000/getattendancedetails').then(res=>{
            return res.json();
        }).then(datas=>{
            datas.forEach(data=>{
                sno++;
                row=myTable.insertRow();
                row.insertCell(0).innerHTML=sno;
                let namecell= row.insertCell(1);
                namecell.innerHTML=data.name;
                namecell.className='text-start';
                row.insertCell(2).innerHTML=data.date;
                row.insertCell(3).innerHTML=data.inTime;
                row.insertCell(4).innerHTML=data.outTime;
                row.insertCell(5).innerHTML=`<td class="" >
                <button class="btn btn-success  me-2" onclick="editattendance(${data.attendanceID})">Edit</button>
                <button class="btn btn-danger " onclick="deleteattendancedata(${data.attendanceID})" >Delete</button></td>`;
            })
        });
    }catch(error){
        console.log("Error");
    }
}

function editattendance(ID){
    addbutton.style.display='none';
    updatebutton.style.display='block';
    Name.disabled='disabled';  
    updatecancelbutton.style.display='block'; 
    setdata(ID);
}
function setdata(ID){
    fetch('http://localhost:8000/getattendancedata?ID='+ID).then(res=>{
        return res.json();
    }).then(data=>{
        setname(data.name);
        intime.value=data.inTime+':00';
        outtime.value=data.outTime+':00';
        let datelist=data.date.split('/');
        Attendance_date.value=datelist[2].toString()+'-'+datelist[1].toString()+'-'+datelist[0].toString();
        console.log(datelist[2]+'-'+datelist[1]+'-'+datelist[0]);
    }).catch(error=>{
        console.log("ERROR");
    });
}
function setname(sname){
    Name.querySelectorAll('option').forEach(opt=>{
        if(opt.value.includes(sname)){
            opt.selected="selected";
        }
    });
}
function deleteattendancedata(ID){

    if(confirm('Are you sure ?')){
        const request={
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
        };

        fetch(`http://localhost:8000/deleteattendance?attendanceID=${ID}`,request).then(res=>{
            return res.json();
        }).then(data=>{
            setsucessmessage(data.message);
            addattendancedadtaintable();
        }).catch(error=>{
            console.log("Error");
        });
    }
    
}

