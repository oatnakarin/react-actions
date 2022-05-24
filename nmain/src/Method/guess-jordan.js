import React,{useState,useEffect} from "react";
import axios from 'axios';
import '../App.css'
import Select from 'react-select';
import {clone,lcm,abs,add,multiply,subtract} from 'mathjs';
function Guess_jordan() {
  const [ans,setans] = useState()
  const [dataAPI,setDa] = useState();
  const [matrix,setM] = useState([])
  const [val,setV] = useState([])
  const [matrixAPI,setMA] = useState([[0,0,0],[0,0,0],[0,0,0]])
  const [valAPI,setVA] = useState([0,0,0])
  const [lastmatrixF,setMF] = useState([])
  const [lastvalF,setVF] = useState([])
  const [checkm,setc] = useState(false)
  const [valm,setvm] = useState([])
  const [valv,setvv] = useState([])
  const [row,setrow] = useState(0);

  const options = [
    { value:0,row: 2,column: 2, label: '2x2' },
    { value:1,row: 3,column: 3, label: '3x3' },
    { value:2,row: 4,column: 4, label: '4x4' },
  ];

  let valuem = [];
  let valueval = [];

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


  const setmatrix = async (row,column) =>{
      await setVmatrix(row);
      setM([]);
      let tempM = [];
      for (let i=0 ; i<row ; i++) {
        for (let j=0 ; j<column ; j++) {
          tempM.push(<input type="number"  onChange={e => update(i,j,e.target.value)} key={i+"_"+j}  />)  
        }
        tempM.push(<br/>)
    }
    setM(tempM);
    setc(true)
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
    setc(true)
  }

  const setlastM = (m,tmatrix) =>{
    console.log(tmatrix)
    let tempM = [];
    for (let i=0 ; i<m ; i++) {
      for (let j=0 ; j<m ; j++) {
        tempM.push(<input type="number"  value={tmatrix[i][j]} key={i+"_"+j}  disabled/>)  
      }
      tempM.push(<br/>)
    }
    setMF(tempM);
    setc(true)
  }

  const setlastV = (m,tmatrix) =>{
    console.log(tmatrix)
    let tempM = [];
    for (let j=0 ; j<m ; j++) {
      tempM.push(<input type="number"  value={tmatrix[j]} key={j} disabled/>) 
      tempM.push(<br/>) 
    }
    setVF(tempM);
    setc(true)
  }

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

  const Guess_jor = (n,MatrixA,MatrixB)=>{
    //สามเหลี่ยมล่าง
  let A = clone(MatrixA)
  let B = clone(MatrixB)
  for(let i=0;i<A.length-1;i++){
    let run = 0;
    for(let j=0;j<i+1;j++){
      let temp = clone(A);
      let stock;
      if(temp[i+1][j]===0) break;
    
      let val = lcm(temp[run][j],temp[i+1][j]);
      let temp1 = abs(val/temp[run][j]);
      let temp2 = abs(val/temp[i+1][j]);
      let tempB = B[run]*temp1;
      B[i+1] = B[i+1]*temp2;
      let clonerow1 = multiply(clone(temp[run]),temp1);
      let clonerow2 = multiply(clone(temp[i+1]),temp2);
      if(clonerow1[j]+clonerow2[j]===0){
        stock = add(clonerow1,clonerow2);
        B[i+1] = tempB+B[i+1];
      }else{
        stock = subtract(clonerow1,clonerow2);
        B[i+1] = tempB-B[i+1];
      }
      temp[i+1] = clone(stock);
      A = clone(temp);
      run++;
    }
  }
  //สามเหลี่ยมบน
  for(let i=A.length-1;i>0;i--){
    let run = A.length-1;
    for(let j=A.length-1;j>i-1;j--){
      let temp = clone(A);
      let stock;
      if(temp[i-1][j]===0) break;
    
      let val = lcm(temp[run][j],temp[i-1][j]);
      let temp1 = abs(val/temp[run][j]);
      let temp2 = abs(val/temp[i-1][j]);
      let tempB = B[run]*temp1;
      B[i-1] = B[i-1]*temp2;
      let clonerow1 = multiply(clone(temp[run]),temp1);
      let clonerow2 = multiply(clone(temp[i-1]),temp2);
      if(clonerow1[j]+clonerow2[j]===0){
        stock = add(clonerow1,clonerow2);
        B[i-1] = tempB+B[i-1];
      }else{
        stock = subtract(clonerow1,clonerow2);
        B[i-1] = tempB-B[i-1];
      }
      temp[i-1] = clone(stock);
      A = clone(temp);
      run--;
    }
  }
  //ทำให้เป็นรูปของ jordan
  for(let i=0;i<A.length;i++){
    let temp = A[i][i];
    A[i][i] = A[i][i]/temp;
    B[i] = B[i]/temp;
  }
  setlastM(n,A)
  setlastV(n,B)
  let tempans = "Answer: ";
  for(let i=0;i<B.length;i++){
    if(i<B.length-1)
    tempans += B[i]+" , ";
    else
    tempans += B[i];
  }
  setans(tempans);
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

  const handleChange = (selectedOption) => {
    setMA(selectedOption.dataA);
    setVA(selectedOption.dataB);
    Guess_jor(3,selectedOption.dataA,selectedOption.dataB)

  }

  const handleChange2 = (selectedOption) => {
    setrow(selectedOption.row)
    setmatrix(selectedOption.row,selectedOption.column)
    setval(selectedOption.row);
  }

  return (
  <div>
    <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold'}}>Guess-Jordan</div>
      <div style={{marginLeft:'150px'}}>
      <div style={{width:'150px'}}>
            <Select
              onChange={handleChange2}
              options={options}
            />
        </div>
        <div style={{display:'flex',flexDirection:'column'}}>
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
          <div className="container">
              <div>
                <div className="label">
                  <label >Last Matrix</label>
                </div>
                <div>
                  {checkm && lastmatrixF}
                </div>
              </div>
               <div>
                    <div className="label">
                        <label >Last Value</label>
                    </div>
                    <div>
                        {checkm && lastvalF}
                    </div>
                </div>
          </div>
        </div>
      <div style={{display:'flex',gap:'20px',marginBottom:'25px',justifyContent:'center',fontSize:'20px',fontWeight:"bold"}}>
        <div>
          {ans}
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'15px',marginBottom:'20px'}}>
        <div>
          <label>Select Data From API</label>
        </div>
        <div style={{width:'150px'}}>
            <Select
              onChange={handleChange}
              options={dataAPI}
            />
        </div>
      </div>
      <button onClick={()=>Guess_jor(row,valm,valv)}>submit</button>
    </div>
  </div>
  );
}
export default Guess_jordan;