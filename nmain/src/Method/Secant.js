import React, {useState,useEffect} from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import axios from 'axios';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries,Crosshair} from 'react-vis';
import Select from 'react-select';
import { Table,Button,Input } from 'antd';
import {
   evaluate
} from 'mathjs'
import AlgebraLatex from 'algebra-latex';


addStyles();

const Secant = () => {

  const [dataAPI, setDa] = useState([]);
  

  useEffect(() => {

    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ2YWx1ZSI6MCwibGFiZWwiOiJ4XjQtMTMiLCJMdmFsdWUiOjEuNSwiUnZhbHVlIjoyfSx7InZhbHVlIjoxLCJsYWJlbCI6InheMyArIDQiLCJMdmFsdWUiOi0yLCJSdmFsdWUiOjF9LHsidmFsdWUiOjIsImxhYmVsIjoieF4zKjItNCIsIkx2YWx1ZSI6MSwiUnZhbHVlIjoyfSx7InZhbHVlIjozLCJsYWJlbCI6InheMyp4XjItMSIsIkx2YWx1ZSI6LTIsIlJ2YWx1ZSI6Mn1dLCJpYXQiOjE2NTE1MjQxNzd9.N-DpnLdKqhigUHnvUxw-YDY01T0wR3pW2iWQz0gXvYA";
    try {
      axios.get(`http://localhost:4000/data/${token}`).then((respond)=>{
          setDa(respond.data.data)
          console.log(respond.data.data);
        })
    } catch (err) {
      console.log(err);
    }

  }, [])

  const [latex, setLatex] = useState("");
  const [x0value, setL] = useState(0);
  const [x1value, setR] = useState(0);
  const [data, setd]=useState([{x: 0,y:0}]);
  const [dataTable, setdt]=useState();
  

  const secant = async (eq,x0,x1) =>{

      try {
        const fun = (x) =>{
            return evaluate(eq,{x:x});
        }

        let arr = [];
        let arr2 = [];

        const se = (x0,x1,oldx,i) =>{

            let obj = {
                x: 0,
                y: 0
            }

            let obj2 = {
                Iteration : 0,
                X0: 0,
                X: 0,
                X1: 0,
                FX0 : 0,
                FX1: 0,
                ERROR : 0
            }

            obj2.X0 = x0;
            obj2.X1 = x1;
            obj2.Iteration =  obj.x = i
            let fx0 = fun(x0).toFixed(6)
            obj2.FX0 = fx0
            let fx1 = fun(x1).toFixed(6)
            obj2.FX1 = fx1
            let x = x0 - (fx0*(x0-x1).toFixed(6)/(fx0-fx1))
            if(isNaN(x) || x===Infinity){
              alert("Cannot calculate this equation!")
              return;
          }
            obj2.X = x.toFixed(8);
            console.log("x is: "+x)
            let abcilon = Math.abs((x-oldx)/x)
            obj2.ERROR = obj.y = abcilon.toFixed(7);
            arr.push(obj);
            arr2.push(obj2);
        
            if(abcilon < 0.000001){
                setd(arr);
                setdt(arr2);
            }else{
                se(x,x+1,x,i+1)
            }
        }
        const M = () =>{
            let fx0 = fun(x0)
            let fx1 = fun(x1)
            let x = x0 - (fx0*(x0-x1)/(fx0-fx1))
            se(x,x+1,x,1)
        }
        M()     
      } catch (err) {
        alert("cannot calculate this equation!");
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
      title: 'X0',
      dataIndex: 'X0',
      key : 'X0'
    },
    {
      title: 'X',
      dataIndex: 'X',
      key : 'X'
    },
    {
      title: 'X1',
      dataIndex: 'X1',
      key : 'X1'
    },
    {
      title: 'FX0',
      dataIndex: 'FX0',
      key : 'FX0'
    },
    {
      title: 'FX1',
      dataIndex: 'FX1',
      key : 'FX1'

    },
    {
      title: 'ERROR',
      dataIndex: 'ERROR',
      key : 'ERROR'
    },
  ];



  const handleChange = (selectedOption) => {
    secant(selectedOption.label,selectedOption.Lvalue,selectedOption.Rvalue)
  }

  if (!dataAPI) return null;

    return (
      <div>
        <h2 style={{textAlign:'center'}}>Secant</h2>
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
                  <h3>X0 Value</h3>
                  <Input type="number" 
                    onChange ={(e) =>setL(e.target.value)}
                    required={true} 
                    value={x0value}
                    ></Input>
                </div>
                <div>
                  <h3>X1 Value</h3>
                  <Input type="number" 
                    onChange ={(e) =>setR(e.target.value)}
                    required={true} 
                    value={x1value}></Input>
                </div>
              </div>
              <div style={{marginTop:'20px'}}>
                <Button type="primary" onClick={() =>secant(new AlgebraLatex().parseLatex(latex).toMath(),x0value,x1value)} style={{padding:'5px'}}>Submit</Button >
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
  export default Secant;