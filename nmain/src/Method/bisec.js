import React, {useState,useEffect} from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import axios from 'axios';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries,Crosshair} from 'react-vis';
import Select from 'react-select';

import { Table,Button,Input } from 'antd';
import {
  evaluate
} from 'mathjs';
import AlgebraLatex from 'algebra-latex';


addStyles();

const Bisection = () => {

  const [dataAPI, setDa] = useState([]); 

  useEffect(() => {

    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ2YWx1ZSI6MCwibGFiZWwiOiJ4XjQtMTMiLCJMdmFsdWUiOjEuNSwiUnZhbHVlIjoyfSx7InZhbHVlIjoxLCJsYWJlbCI6InheMyArIDQiLCJMdmFsdWUiOi0yLCJSdmFsdWUiOjF9LHsidmFsdWUiOjIsImxhYmVsIjoieF4zKjItNCIsIkx2YWx1ZSI6MSwiUnZhbHVlIjoyfSx7InZhbHVlIjozLCJsYWJlbCI6InheMyp4XjItMSIsIkx2YWx1ZSI6LTIsIlJ2YWx1ZSI6Mn1dLCJpYXQiOjE2NTE1MjQxNzd9.N-DpnLdKqhigUHnvUxw-YDY01T0wR3pW2iWQz0gXvYA";
    try {
      axios.get(`http://localhost:4000/data/${token}`).then((respond)=>{
        setDa(respond.data.data)
      })
    }catch(err){

    }
    
  }, [])

  const [latex, setLatex] = useState("");
  const [Lvalue, setL] = useState(0);
  const [Rvalue, setR] = useState(0);
  const [data, setd]=useState([{x: 0,y:0}]);
  const [dataTable, setdt]=useState();

  const main_bisec = async (eq,xl,xr) =>{

      let arr = [];
      let arr2 = [];

      const checkbisec = (xl,xr) =>{
        let fxL = evaluate(eq, {x: xl});
        let fxR = evaluate(eq, {x: xr});
        
        if((fxL >0 && fxR < 0) || (fxL <0 && fxR > 0)){
            console.log("yes!")
            return true;
        }else{
            alert("cannot calculate this equation!");
            return false;
        }
    }

    const bisec = (xl,xr,oldxm,i) =>{
      console.log("eq: "+eq+" xl: "+xl+" xr: "+xr)

        let obj = {
          x: 0,
          y: 0
        }

        let obj2 = {

          Iteration : 0,
          XM: 0,
          XL: 0,
          XR: 0,
          FXL : 0,
          FXM: 0,
          FXR : 0,
          ERROR : 0

        }

        let xM = (xl+xr)/2;
        console.log("XM: "+xM)
        obj2.XM = xM;
        obj2.XL = xl;
        obj2.XR = xr;
        obj2.Iteration = obj.x = i;
        let fxM = evaluate(eq, {x: xM});
        obj2.FXM = fxM.toFixed(7);
        let fxl = evaluate(eq, {x: xl});
        obj2.FXL = fxl.toFixed(7);
        let fxR = evaluate(eq, {x: xr});
        obj2.FXR = fxR.toFixed(7);
        let abcilon  = Math.abs((xM-oldxm)/xM);
        obj2.ERROR = obj.y = abcilon.toFixed(7);

        arr.push(obj)
        arr2.push(obj2);


        if(abcilon < 0.000001){
          console.log("ans: "+xM)

            setd(arr)
            setdt(arr2);

            return;
        }else{
            if(fxR * fxM > 0){
                bisec(xl,xM,xM,i+1);
            }else{
                bisec(xM,xr,xM,i+1);
            }
        }
    }
    if(checkbisec(xl,xr)){
      let xM = (parseFloat(xl)+ parseFloat(xr))/2;
      let fxM = evaluate(eq, {x: xM});
      let fxR = evaluate(eq, {x: xr});
     if(fxM * fxR > 0){
          bisec(parseFloat(xl),xM,xM,1);
      }else{
          bisec(xM,parseFloat(xr),xM,1);
      }
    }
  }

  const [crosshairValues, setCrosshairValues] = useState([]);

  function onNearestX(value, { index }) {
    let values = data[index];
 //   console.log("value: "+values);
    setCrosshairValues([values]);
  }

  function titleFormat([item]) {
    return {
      title: "iteration: ",
      value: item.x
    };
  }

  function format([item]) {
    return [
      {
        title: "Error: ",
        value: item.y
      }
    ];
  }

  
  const columns = [
    {
      title: 'Iteration',
      dataIndex: 'Iteration',
      key : 'Iteration'
    },
    {
      title: 'XL',
      dataIndex: 'XL',
      key : 'XL'
    },
    {
      title: 'XM',
      dataIndex: 'XM',
      key : 'XM'
    },
    {
      title: 'XR',
      dataIndex: 'XR',
      key : 'XR'
    },
    {
      title: 'FXL',
      dataIndex: 'FXL',
      key : 'FXL'
    },
    {
      title: 'FXM',
      dataIndex: 'FXM',
      key : 'FXM'

    },
    {
      title: 'FXR',
      dataIndex: 'FXR',
      key : 'FXR'
    },
    {
      title: 'ERROR',
      dataIndex: 'ERROR',
      key : 'ERROR'
    },
  ];



  const handleChange = (selectedOption) => {
    main_bisec(selectedOption.label,selectedOption.Lvalue,selectedOption.Rvalue)
  }

  if (!dataAPI) return null;

    return (
      <div>
        <h2 style={{textAlign:'center'}}>Bisection</h2>
        <div style={{display:'flex',gap:'70px',justifyContent:"center"}}>
            <div>
              <XYPlot
                    width={500}
                    height={500}
              >
                    <HorizontalGridLines />
                    <LineSeries
                        color="red"
                        data={data}
                        onNearestX={onNearestX}
                    />
                    <Crosshair
                      values={crosshairValues}
                      titleFormat={titleFormat}
                      itemsFormat={format}
                    />
                    <XAxis />
                    <YAxis />
              </XYPlot>
            </div>
          <div style={{border: '1px solid black',width:'400px',height:'400px',padding:'20px'}}>
            <div >
                <h3>Math Equation</h3>
                  <EditableMathField style={{width:'250px'}}
                  latex={latex}
                  onChange={(mathField) => {
                  setLatex(mathField.latex());
                  }}
                  disabled={true}/>
              </div>
              <div>
              </div>
              <div style={{display: "flex",gap: '15px'}}>
                <div>
                  <h3>L Value</h3>
                  <Input type="number" 
                    onChange ={(e) =>setL(e.target.value)}
                    required={true} 
                    value={Lvalue}
                    ></Input>
                </div>
                <div>
                  <h3>R Value</h3>
                  <Input type="number" 
                    onChange ={(e) =>setR(e.target.value)}
                    required={true} 
                    value={Rvalue}></Input>
                </div>
              </div>
              <div style={{marginTop:'20px'}}>
                <Button type="primary" onClick={() =>main_bisec(new AlgebraLatex().parseLatex(latex).toMath(),Lvalue,Rvalue)} style={{padding:'5px'}}>Submit</Button >
              </div>
              <div style={{display:'flex',gap:'15px',alignItems:'baseline',marginTop:'15px'}}>
                <div>
                  <h4>Example Equaion: </h4>
                </div>
                <div style={{width:'150px'}}>
                  <Select
                    onChange={handleChange}
                    options={dataAPI}
                  />
                </div>
              </div>
            </div>
        </div>
        <div style={{width:'1200px',marginLeft:'auto',marginRight:'auto',marginTop:'15px'}}>
          <Table dataSource={dataTable} columns={columns} />
        </div>
      </div>
    );
  };
  export default Bisection;