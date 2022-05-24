import React, {useState,useEffect} from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import axios from 'axios';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries,Crosshair} from 'react-vis';
import Select from 'react-select';
import { Table,Button,Input } from 'antd';
import 'antd/dist/antd.min.css';
import AlgebraLatex from 'algebra-latex'
import {
  derivative,evaluate,abs
  } from 'mathjs';


addStyles();

const Newton = () => {

  const [dataAPI, setDa] = useState([]); 

  useEffect(() => {

    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ2YWx1ZSI6MCwibGFiZWwiOiJ4XjQtMTMiLCJMdmFsdWUiOjEuNSwiUnZhbHVlIjoyfSx7InZhbHVlIjoxLCJsYWJlbCI6InheMyArIDQiLCJMdmFsdWUiOi0yLCJSdmFsdWUiOjF9LHsidmFsdWUiOjIsImxhYmVsIjoieF4zKjItNCIsIkx2YWx1ZSI6MSwiUnZhbHVlIjoyfSx7InZhbHVlIjozLCJsYWJlbCI6InheMyp4XjItMSIsIkx2YWx1ZSI6LTIsIlJ2YWx1ZSI6Mn1dLCJpYXQiOjE2NTE1MjQxNzd9.N-DpnLdKqhigUHnvUxw-YDY01T0wR3pW2iWQz0gXvYA";
    try {
      axios.get(`http://localhost:4000/newton/${token}`).then((respond)=>{
          setDa(respond.data.data)
          console.log(respond.data.data);
        })
    } catch (err) {
      console.log(err);
    }


  }, [])

  const [latex, setLatex] = useState("");
  const [x1, setx1] = useState(0);
  const [data, setd]=useState([{x: 0,y:0}]);
  const [dataTable, setdt]=useState();


  const main_newton = async (eq,x1) =>{

      let arr = [];
      let arr2 = [];
    try {
      const Fderi = (x) =>{
          return evaluate(derivative(eq,'x').toString(),{x:x})
      }

      const F = (x) =>{
        return evaluate(eq,{x:x});
    }

    const Newton_Rap = (Xi,oldx,i) =>{

      let obj = {
        x: 0,
        y: 0
      }

      let obj2 = {

        Iteration : 0,
        X1: 0,
        OldX1 : 0,
        ERROR : 0

      }
      obj2.Iteration = obj.x = i;
      obj2.X1 =  Xi;
      obj2.OldX1 = oldx;
      let x = Xi - (F(Xi)/Fderi(Xi));
      if(isNaN(x) || x===Infinity){
        alert("Cannot calculate this equation!")
        return;
      }
      console.log("x : "+x);
      console.log("x : "+oldx);
      let abcilon = abs((x-oldx)/x);
      obj.y = obj2.ERROR = abcilon.toFixed(6);
      console.log("abcilon: "+abcilon.toFixed(6));
      arr.push(obj);
      arr2.push(obj2);
      if(abcilon<0.000001){
          setd(arr);
          setdt(arr2);
          console.log(arr);
       /*   console.log("Final abcilon: "+abcilon.toFixed(6))
          console.log("answer x: "+x);*/
      }else{
          Newton_Rap(x,x,i+1);
      }
    }

    Newton_Rap(x1,0,1)

  } catch (err) {
        alert("cannot calculate this equation!");
  }
}

  const [crosshairValues, setCrosshairValues] = useState([]);

  function onNearestX(value, { index }) {
    let values = data[index];
 //   console.log("values: "+JSON.stringify(values));
    setCrosshairValues([values]);
  }

  function titleFormat([item]) {
 //   console.log("JSON: "+JSON.stringify(item))
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
      key : 'IterationX'
    },
    {
      title: 'X1',
      dataIndex: 'X1',
     key : 'X1X'
    },
    {
      title: 'OldX1',
      dataIndex: 'OldX1',
      key : 'OldX1X'
    },
    {
      title: 'ERROR',
      dataIndex: 'ERROR',
      key : 'ERRORX'
    },
  ];



  const handleChange = (selectedOption) => {
    main_newton(selectedOption.label,selectedOption.x1)
  }

  if (!dataAPI) return null;

    return (
      <div>
        <h2 style={{textAlign:'center'}}>Newton-Rapshon</h2>
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
                  <h3>X1 Value</h3>
                  <Input type="number" 
                    onChange ={(e) =>setx1(e.target.value)}
                    required={true} 
                    value={x1}
                    ></Input>
                </div>
              </div>
              <div style={{marginTop:'20px'}}>
                <Button type="primary" onClick={() =>main_newton(new AlgebraLatex().parseLatex(latex).toMath(),x1)} style={{padding:'5px'}}>Submit</Button >
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

  export default Newton;