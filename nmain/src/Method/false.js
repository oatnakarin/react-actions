import React, {useState,useEffect} from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import axios from 'axios';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries,Crosshair} from 'react-vis';
import Select from 'react-select';
import 'antd/dist/antd.min.css';
import { Table,Button,Input } from 'antd';
import AlgebraLatex from 'algebra-latex'
import {
   evaluate
} from 'mathjs'


addStyles();

const False = () => {

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
  

  const main_false = async (eq,xl,xr) =>{

      let arr = [];
      let arr2 = [];

      const checkfalse = (xl,xr) =>{

        let fxL = evaluate(eq, {x: xl});
        let fxR = evaluate(eq, {x: xr});
        if((fxL >0 && fxR < 0) || (fxL <0 && fxR > 0) || (xl<xr)){
          console.log('yes!');
            return true;
        }else{
            alert("cannot calculate this equation!");
            return false;
        }
    }

    const false_cal = (xl,xr,oldx1,i) =>{

        let obj = {
          x: 0,
          y: 0
        }

        let obj2 = {

          Iteration : 0,
          X1: 0,
          XL: 0,
          XR: 0,
          FXL : 0,
          FX1: 0,
          FXR : 0,
          ERROR : 0

        }

  
  
        obj2.XL = xl;
        obj2.XR = xr;
        obj2.Iteration = obj.x = i;
        let fxL = evaluate(eq, {x: xl});
        obj2.FXL = fxL.toFixed(7);
        let fxR = evaluate(eq, {x: xr});
        obj2.FXR = fxR.toFixed(7);
        let x1 = (((xl * fxR)-(xr * fxL))/(fxR-fxL));
        obj2.X1 = x1;
        let fx1 = evaluate(eq, {x: x1});
        obj2.FX1 = fx1.toFixed(7);
        let abcilon  = Math.abs((x1-oldx1)/x1);
        obj2.ERROR = obj.y = abcilon.toFixed(9);

        arr.push(obj)
        arr2.push(obj2);


        if(abcilon < 0.000001){
          console.log("error: "+abcilon.toFixed(9))
          console.log("ans: "+x1)

            setd(arr)
            setdt(arr2);

            return;
        }else{
            if(fxR * fx1 > 0){
                false_cal(xl,x1,x1,i+1);
            }else{
                false_cal(x1,xr,x1,i+1);
            }
        }
    }
    if(checkfalse(xl,xr)){
  
        let fxL = evaluate(eq, {x: parseFloat(xl)});
        let fxR = evaluate(eq, {x: parseFloat(xr)});
        let x1 = (((parseFloat(xl) * fxR)-(parseFloat(xr) * fxL))/(fxR-fxL));
        let fx1 = evaluate(eq, {x: x1});
        if(fx1 * fxR > 0){
            false_cal(parseFloat(xl),x1,x1,1);
        }else{
            false_cal(x1,parseFloat(xr),x1,1);
        }
    }else{
        console.log('no data')
    }
      
  }

  const [crosshairValues, setCrosshairValues] = useState([]);

  function onNearestX(value, { index }) {
    let values = data[index];
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
      title: 'X1',
      dataIndex: 'X1',
      key : 'X1'
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
      title: 'FX1',
      dataIndex: 'FX1',
      key : 'FX1'

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
    main_false(selectedOption.label,selectedOption.Lvalue,selectedOption.Rvalue)
  }

  if (!dataAPI) return null;

    return (
      <div>
        <h2 style={{textAlign:'center'}}>False-Position</h2>
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
                <Button type="primary" onClick={() =>main_false(new AlgebraLatex().parseLatex(latex).toMath(),Lvalue,Rvalue)} style={{padding:'5px'}}>Submit</Button >
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
  
  export default False;