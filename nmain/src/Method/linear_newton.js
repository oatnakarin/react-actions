import React,{useState,useEffect} from 'react';
import '../App.css';
import {Button}from 'antd'
import 'antd/dist/antd.min.css';
import Select from 'react-select';
import {clone} from 'mathjs';
import axios from 'axios';

function Linear_new() {

  const [dataAPI,setDa] = useState(); //api
  const [matrix,setM] = useState([])  //matrix field
  const [val,setV] = useState([])  //matrix field
  const [checkm,setcc] = useState(false) //check
  const [arr1,setvm] = useState([]) //matrix val
  const [arr2,setvv] = useState([]) //value val
  const [matrixAPI,setMA] = useState([0,0,0,0,0,0]) //api
  const [valAPI,setVA] = useState([0,0,0,0,0,0])
  const [ansC,setC] = useState();
  const [ans,setans] = useState()
  const [point1,setpoint1] = useState(0);
  const [point2,setpoint2] = useState(0);
  const [x,setx] = useState(0);
  

  let valuem = [];
  let valueval = [];

const options = [
  { value:0,row: 4, label: '4' },
  { value:1,row: 5, label: '5' },
  { value:2,row: 6, label: '6' },
  { value:3,row: 7, label: '7' },
  { value:4,row: 8, label: '8' },
];

useEffect(() => {

    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ2YWx1ZSI6MCwibGFiZWwiOiJ4XjQtMTMiLCJMdmFsdWUiOjEuNSwiUnZhbHVlIjoyfSx7InZhbHVlIjoxLCJsYWJlbCI6InheMyArIDQiLCJMdmFsdWUiOi0yLCJSdmFsdWUiOjF9LHsidmFsdWUiOjIsImxhYmVsIjoieF4zKjItNCIsIkx2YWx1ZSI6MSwiUnZhbHVlIjoyfSx7InZhbHVlIjozLCJsYWJlbCI6InheMyp4XjItMSIsIkx2YWx1ZSI6LTIsIlJ2YWx1ZSI6Mn1dLCJpYXQiOjE2NTE1MjQxNzd9.N-DpnLdKqhigUHnvUxw-YDY01T0wR3pW2iWQz0gXvYA";
    try {
      axios.get(`http://localhost:4000/linear/${token}`).then((respond)=>{
          setDa(respond.data.data)
          console.log(respond.data.data);
        })
    } catch (err) {
      console.log(err);
    }

  }, [])

const setVmatrix = (size) =>{
  let arr1 = [];
  let arr2 = [];
  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      arr2.push(0);
    }
    arr1.push(arr2);
    arr2 = [];
  }
  valuem = clone(arr1);
}

const setVvalue = (size) =>{
  let arr1 = [];
    for(let j=0;j<size;j++){
      arr1.push(0);
    }
  valueval = clone(arr1);
}

const update = (n,value) =>{
    
  let newM = clone(valuem);
  newM[n] = Number(value);
  valuem = clone(newM);
  setvm(valuem)

}

const update2 = (i,value) =>{
  
  let newM = clone(valueval);
  newM[i] = Number(value);
  valueval = clone(newM);
  setvv(valueval)

}

const setmatrix = async (row) =>{
    await setVmatrix(row);
    setM([]);
    let tempM = [];
    for (let i=0 ; i<row ; i++) {
      tempM.push(<input type="number" onChange={e => update(i,e.target.value)} key={i+"_"} placeholder={i+1} />)  
    }
  tempM.push(<br/>)
  setM(tempM);
  setcc(true)
}

const setval = async (n) =>{
  await setVvalue(n);
  setV([]);
  let tempM = [];
  for (let j=0 ; j<n ; j++) {
    tempM.push(<input type="number"  onChange={e => update2(j,e.target.value)} key={j} placeholder={j+1} />) 
  //  tempM.push(<br/>) 
  }
  setV(tempM);
  setcc(true)
}


const linear_new = (arr1,arr2,point1,point2,x) =>{

    console.log(arr1)
    console.log(arr2)
    console.log(point1)
    console.log(point2)

  if(point1 < 1 || point1 >arr1.length){
    alert("ระบุจุดที่ต้องการผิด!");
    return;
  }else if((point2 < 1 || point2 >arr1.length)){
    alert("ระบุจุดที่ต้องการผิด!");
    return;
  }
  let ans = [];
  let c0 = arr2[point1-1];
  let c1 = (arr2[point2-1]-arr2[point1-1])/(arr1[point2-1]-arr1[point1-1]);
  let temp = "";
  ans.push(c0);ans.push(c1);
  for(let i=0;i<2;i++){
    if(i<1)
    temp += "C"+(i)+" : "+ans[i].toFixed(6)+" , ";
    else
    temp += "C"+(i)+" : "+ans[i].toFixed(6);
  }
  setC(temp); temp = "";
  temp = "Answer: "+(c0+(c1*(x-arr1[point1-1]))).toFixed(6);
  setans(temp)

}


  const handleChange = (selectedOption) => {
     let a1 = selectedOption.dataA
     let a2 = selectedOption.dataB
     let p1 = Number(selectedOption.point1)
     let p2 = Number(selectedOption.point2)
     let x = Number(selectedOption.x);
     setMA(selectedOption.dataA);
     setVA(selectedOption.dataB);
     linear_new(a1,a2,p1,p2,x)
     setcc(true)
     
  }

  const handleChange2 = (selectedOption) => {
    setmatrix(selectedOption.row,selectedOption.column)
    setval(selectedOption.row);
  }



  return (
    <div>
      <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold'}}>Quadratic Newton Divide Difference</div>
        <div style={{marginLeft:'150px'}}>
          <div style={{margin:'50px 20px',columnGap:'20px',display:'flex',alignItems:'center'}}>
             <label>Select number of point</label>
                <Select
                  onChange={handleChange2}
                  options={options}
                />
          </div>
          <div className="container" >
            <div>
              <div className="label">
                <label >X</label>
              </div>
              <div>
                {checkm && matrix}
                <div className="label">
                  <label >F(X)</label>
                </div>
                {checkm && val} 
              </div>
            </div>
          </div>
          <div className="container" >
            <div>
              <div className="label">
                <label >X FROM API</label>
              </div>
                <input type="number"  value={matrixAPI[0]}  disabled/>
                <input type="number"  value={matrixAPI[1]}  disabled/>
                <input type="number"  value={matrixAPI[2]}  disabled/>
                <input type="number"  value={matrixAPI[3]}  disabled/>
                <input type="number"  value={matrixAPI[4]}  disabled/>
                <input type="number"  value={matrixAPI[5]}  disabled/>
              <div>
                <div className="label">
                  <label >F(X) FROM API</label>
                </div>
                <input type="number"  value={valAPI[0]}  disabled/>
                <input type="number"  value={valAPI[1]}  disabled/>
                <input type="number"  value={valAPI[2]}  disabled/>
                <input type="number"  value={valAPI[3]}  disabled/>
                <input type="number"  value={valAPI[4]}  disabled/>
                <input type="number"  value={valAPI[5]}  disabled/>
              </div>
            </div>
          </div>
          <div style={{marginBottom:'15px',marginLeft:'35px',display:'flex',columnGap:'10px',alignItems:'center'}}>
            <label>X</label>
            <input onChange={(e)=>setx(e.target.value)} />
          </div>
          <div style={{marginBottom:'15px',display:'flex',columnGap:'10px',alignItems:'center'}}>
            <label>Point 1</label>
            <input onChange={(e)=>setpoint1(e.target.value)} />
          </div>
          <div style={{marginBottom:'15px',display:'flex',columnGap:'10px',alignItems:'center'}}>
            <label>Point 2</label>
            <input onChange={(e)=>setpoint2(e.target.value)} />
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            <div>
              <Button type="primary" onClick={()=>linear_new(arr1,arr2,point1,point2,x)}>Submit</Button>
            </div>   
          </div>    
        </div>  
        <div style={{margin:'50px 20px',columnGap:'20px',display:'flex',alignItems:'center'}}>
            <label>Select Data from API</label>
            <Select
                onChange={handleChange}
                options={dataAPI}
            />
        <div style={{marginLeft:'400px',columnGap:'50px',display:'flex'}}>
            <div style={{fontSize:'25px'}}>
            {checkm && ansC}
            </div>
            <div style={{fontSize:'25px'}}>
            {checkm && ans}
            </div>
        </div>
        </div> 
    </div>
  );
}

export default Linear_new;
