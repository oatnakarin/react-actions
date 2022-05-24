import React, { useState , useEffect} from 'react';
import { evaluate } from "mathjs";
import axios  from "axios";

const Bisection = () => {
    const [API, setAPI] = useState();
    const [selectedFn, setSelected] = useState(null);

    useEffect(() => {

         axios.get('http://localhost:4000/func').then((respond) => {
             setAPI(respond.data);


             
             console.log(API);
        })
        
    },[]);


    return (
        <div>
           hello
         </div>      
    )
};
                 
export default Bisection; 