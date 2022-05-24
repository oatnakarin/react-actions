import React, {useState,useEffect} from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import axios from 'axios';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries,Crosshair} from 'react-vis';
import Select from 'react-select';
import { Table,Button,Input } from 'antd';
import {
   evaluate,abs, isNaN
} from 'mathjs'
import  AlgebraLatex from 'algebra-latex';


addStyles();

const Onepoint = () => {

  const [dataAPI, setDa] = useState([]);
  

  useEffect(() => {

    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ2YWx1ZSI6MCwibGFiZWwiOiJ4XjQtMTMiLCJMdmFsdWUiOjEuNSwiUnZhbHVlIjoyfSx7InZhbHVlIjoxLCJsYWJlbCI6InheMyArIDQiLCJMdmFsdWUiOi0yLCJSdmFsdWUiOjF9LHsidmFsdWUiOjIsImxhYmVsIjoieF4zKjItNCIsIkx2YWx1ZSI6MSwiUnZhbHVlIjoyfSx7InZhbHVlIjozLCJsYWJlbCI6InheMyp4XjItMSIsIkx2YWx1ZSI6LTIsIlJ2YWx1ZSI6Mn1dLCJpYXQiOjE2NTE1MjQxNzd9.N-DpnLdKqhigUHnvUxw-YDY01T0wR3pW2iWQz0gXvYA";
    try {
      axios.get(`http://localhost:4000/onepoint/${token}`).then((respond)=>{
          setDa(respond.data.data)
          console.log(respond.data.data);
        })
    } catch (err) {
      console.log(err);
    }

  }, [])

  const [latex, setLatex] = useState("");
  const [x1value, setX] = useState(0);
  const [data, setd]=useState([{x: 0,y:0}]);
  const [dataTable, setdt]=useState();
  

  const Onepoint_main = async (eq,x1) =>{

    console.log(eq);

        let arr = [];
        let arr2 = [];

        try {
        const onePoint_cal = (x,oldX,i) => {

                let obj = {
                    x: 0,
                    y: 0
                }

                let obj2 = {
                    Iteration : 0,
                    X: 0,
                    Oldx: 0,
                    ERROR : 0
                }

                let currentx = evaluate(eq,{x:x});
                console.log("cur "+currentx);
                if(isNaN(currentx) || currentx===Infinity){
                    alert("Cannot calculate this equation!")
                    return;
                }
                console.log("cur "+currentx);
                obj2.X = currentx;
                obj.x = obj2.Iteration = i;
                obj2.Oldx = oldX;
                let absolute = abs((currentx  - oldX) / currentx);
                obj2.ERROR = obj.y = absolute.toFixed(8);
                arr.push(obj);
                arr2.push(obj2);
                if (absolute < 0.000001) {
                    setd(arr);
                    setdt(arr2);
                } else {
                    onePoint_cal(currentx,currentx,i+1);
                }
            
            }

            onePoint_cal(x1,0,1)

        } catch (err) {
            alert("Cannot calculate this equation!")
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
      title: 'X',
      dataIndex: 'X',
      key : 'X'
    },
    {
      title: 'Oldx',
      dataIndex: 'Oldx',
      key : 'Oldx'
    },
    {
      title: 'ERROR',
      dataIndex: 'ERROR',
      key : 'ERROR'
    },
  ];



  const handleChange = (selectedOption) => {
    Onepoint_main(selectedOption.label,selectedOption.x1);
  }

  if (!dataAPI) return null;

    return (
      <div>
        <h2 style={{textAlign:'center'}}>One-point</h2>
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
                  <h3>X Value</h3>
                  <Input type="number" 
                    onChange ={(e) =>setX(e.target.value)}
                    required={true} 
                    value={x1value}></Input>
                </div>
              </div>
              <div style={{marginTop:'20px'}}>
                <Button type="primary" onClick={() =>Onepoint_main(new AlgebraLatex().parseLatex(latex).toMath(),x1value)} style={{padding:'5px'}}>Submit</Button >
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

  export default Onepoint;