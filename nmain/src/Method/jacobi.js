import React,{useState,useEffect} from 'react';
import '../App.css';
import {Button,Table}from 'antd'
import 'antd/dist/antd.min.css';
import Select from 'react-select';
import {clone} from 'mathjs';
import axios from 'axios';

function Jacobi_method() {

  let arr = [0,0,0,0];
  let dataInTable=[];
  const [datatable,setd] = useState();
  const [column,setc] = useState();
  const [dataAPI,setDa] = useState([]);
  const [matrix,setM] = useState([])
  const [val,setV] = useState([])
  const [checkm,setcc] = useState(false)
  const [arr1,setvm] = useState([])
  const [arr2,setvv] = useState([])
  const [row,setrow] = useState(0);
  const [matrixAPI,setMA] = useState([[0,0,0],[0,0,0],[0,0,0]])
  const [valAPI,setVA] = useState([0,0,0])

  let temp=0,count=0;
  let valuem = [];
  let valueval = [];

  useEffect(() => {

    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ2YWx1ZSI6MCwibGFiZWwiOiJ4XjQtMTMiLCJMdmFsdWUiOjEuNSwiUnZhbHVlIjoyfSx7InZhbHVlIjoxLCJsYWJlbCI6InheMyArIDQiLCJMdmFsdWUiOi0yLCJSdmFsdWUiOjF9LHsidmFsdWUiOjIsImxhYmVsIjoieF4zKjItNCIsIkx2YWx1ZSI6MSwiUnZhbHVlIjoyfSx7InZhbHVlIjozLCJsYWJlbCI6InheMyp4XjItMSIsIkx2YWx1ZSI6LTIsIlJ2YWx1ZSI6Mn1dLCJpYXQiOjE2NTE1MjQxNzd9.N-DpnLdKqhigUHnvUxw-YDY01T0wR3pW2iWQz0gXvYA";
    try {
      axios.get(`http://localhost:4000/matrix_data/${token}`).then((respond)=>{
          setDa(respond.data.data)
          console.log(respond.data.data);
        })
    } catch (err) {
      console.log(err);
    }

  }, [])

  var columns = [
    {
      title: "Iteration",
      dataIndex: "iteration",
      key: "iteration"
    }
];

const options = [
  { value:0,row: 2,column: 2, label: '2x2' },
  { value:1,row: 3,column: 3, label: '3x3' },
  { value:2,row: 4,column: 4, label: '4x4' },
];

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

const update = (row,column,value) =>{
    
  let newM = clone(valuem);
  newM[row][column] = Number(value);
  valuem = clone(newM);
  setvm(valuem)

}

const update2 = (i,value) =>{
  
  let newM = clone(valueval);
  newM[i] = Number(value);
  valueval = clone(newM);
  setvv(valueval)

}

const setmatrix = async (row,column) =>{
    await setVmatrix(row);
    setM([]);
    let tempM = [];
    for (let i=0 ; i<row ; i++) {
      for (let j=0 ; j<column ; j++) {
        tempM.push(<input type="number" onChange={e => update(i,j,e.target.value)} key={i+"_"+j}  />)  
      }
      tempM.push(<br/>)
  }
  setM(tempM);
  setcc(true)
}

const setval = async (n) =>{
  await setVvalue(n);
  setV([]);
  let tempM = [];
  for (let j=0 ; j<n ; j++) {
    tempM.push(<input type="number"  onChange={e => update2(j,e.target.value)} key={j} />) 
    tempM.push(<br/>) 
  }
  setV(tempM);
  setcc(true)
}


const appendTable  = async (x, error)=> {
  var tag = ''
  tag += '{"iteration": ' + (++count) + ',';
  for (var i=0 ; i<x.length ; i++) {
      tag += '"x'+(i+1)+'": '+x[i].toFixed(7)+', "error'+(i+1)+'": ' + error[i].toFixed(7);
      if (i !== x.length-1) {
          tag += ','
      }
  }
  tag += '}';
  console.log(tag)
  dataInTable.push(JSON.parse(tag));
  setd(dataInTable);
}
const jacobi = (n,i) =>{
    console.log(arr1);
    console.log(arr2)
  let tarr = Array(n);
  tarr.fill(0);
  for(let i=0;i<n;i++){}
  let terror = [];
  let countError = 0;
  for(let i=0;i<n;i++){
    temp = 0;
    for(let j=0;j<n;j++){
        if(i!==j){
          temp += -1*(arr1[i][j]*arr[j])
        }
    }
    temp = (arr2[i]+temp)/arr1[i][i];
    tarr[i] = temp;
  }
  for(let i=0;i<n;i++){
    let abcilon = Math.abs((tarr[i]-arr[i])/tarr[i]);
    if(abcilon < 0.000001){
      countError = countError+1;
    }
    terror.push(abcilon);
  }
  appendTable(tarr,terror)
  if(countError !== arr.length && i<100){
    arr = tarr;
    jacobi(n,i+1);
  }
}

const initialSchema =(n)=>{
    for (var i=1 ; i<=n ; i++) {
        columns.push({
            title: "X"+i,
            dataIndex: "x"+i,
            key: "x"+i
        },)
    }
    for (i=1 ; i<=n ; i++) {
        columns.push({
            title: "Error"+i,
            dataIndex: "error"+i,
            key: "error"+i
        },)
    }
    setc(columns);
    jacobi(n,0);
  }

  const handleChange = (selectedOption) => {
    setrow(3)
    setvm(selectedOption.dataA)
    setvv(selectedOption.dataB)
    setMA(selectedOption.dataA)
    setVA(selectedOption.dataB)
    initialSchema(3)

  }

  const handleChange2 = (selectedOption) => {
    setrow(selectedOption.row)
    setmatrix(selectedOption.row,selectedOption.column)
    setval(selectedOption.row);
  }



  return (
    <div>
      <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold'}}>jacobi</div>
        <div style={{marginLeft:'150px'}}>
          <div style={{margin:'50px 20px',columnGap:'20px',display:'flex',alignItems:'center'}}>
             <label>Select Dimentions of Matrix</label>
                <Select
                  onChange={handleChange2}
                  options={options}
                />
          </div>
          <div className="container" >
            <div>
              <div className="label">
                <label >Matrix</label>
              </div>
              <div>
                {checkm && matrix}
              </div>
            </div>
            <div>
            <div className="label">
                <label >Value</label>
              </div>
              <div>
                {checkm && val} 
              </div>
            </div>
          </div>
          <div className="container">
              <div>
                <div className="label">
                  <label >Matrix From API</label>
                </div>
                <div>
                  <input type="number"  value={matrixAPI[0][0]}  disabled/>
                  <input type="number"  value={matrixAPI[0][1]}  disabled/>
                  <input type="number"  value={matrixAPI[0][2]}  disabled/>
                </div>
                <div >
                  <input type="number"  value={matrixAPI[1][0]}  disabled/>
                  <input type="number"  value={matrixAPI[1][1]}  disabled/>
                  <input type="number"  value={matrixAPI[1][2]}  disabled/>
                </div>
                <div>
                  <input type="number"  value={matrixAPI[2][0]}  disabled/>
                  <input type="number"  value={matrixAPI[2][1]}  disabled/>
                  <input type="number"  value={matrixAPI[2][2]}  disabled/>
                </div>
              </div>
               <div>
                    <div className="label">
                        <label >Value From API</label>
                    </div>
                    <div>
                        <div>
                        <input type="number" value={valAPI[0]} disabled/>
                        </div>
                        <div>
                        <input type="number" value={valAPI[1]}  disabled/>
                        </div>
                        <div>
                        <input type="number" value={valAPI[2]}  disabled/>
                        </div>
                    </div>
                </div>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            <div>
              <Button type="primary" onClick={()=>initialSchema(row)}>Submit</Button>
            </div>   
          </div>    
        </div>  
        <div style={{margin:'50px 20px',columnGap:'20px',display:'flex',alignItems:'center'}}>
            <label>Select Data from API</label>
            <Select
                onChange={handleChange}
                options={dataAPI}
            />
        </div> 
        <div>
          <Table columns={column} dataSource={datatable}></Table>
        </div>
    </div>
  );
}

export default Jacobi_method;
