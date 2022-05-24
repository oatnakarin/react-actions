import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,Link
} from "react-router-dom";
import Bisection from './Method/bisec';
import False from "./Method/false";
import Onepoint from "./Method/One_point";
import Secant from "./Method/Secant";
import Newton from "./Method/Newton-Rapshon"
import Cramer_main from "./Method/cramer";
import Guess_elimination from "./Method/guess-eli";
import Guess_jordan from "./Method/guess-jordan";
import 'antd/dist/antd.min.css';
import Jacobi_method from "./Method/jacobi";
import Seidel_method from "./Method/seidel";
import LU from "./Method/lu";
import Linear_new from "./Method/linear_newton";
import Quadratic_new from "./Method/quadatic_newton";

  const App = () =>{
    return (
      <div> 
        <Router>
          <ul>
            <li>
              <Link to='/Method/bisec'>Bisection</Link>
            </li>
            <li>
              <Link to='/Method/false'>False-point</Link>
            </li>
            <li>
              <Link to='/Method/Newton-Rapshon'>Newton-Rapshon</Link>
            </li>
            <li>
              <Link to='/Method/Secant'>Secant</Link>
            </li>
            <li>
              <Link to='/Method/Onepoint'>One-point</Link>
            </li>
            <li>
              <Link to='/Method/cramer'>Cramer Rule</Link>
            </li>
            <li>
              <Link to='/Method/guess-eli'>Guess-Elimination</Link>
            </li>
            <li>
              <Link to='/Method/guess-jordan'>Guess-Jordan</Link>
            </li>
            <li>
              <Link to='/Method/jacobi'>Jacobi</Link>
            </li>
            <li>
              <Link to='/Method/seidel'>Seidel</Link>
            </li>
            <li>
              <Link to='/Method/lu'>LU Decompose</Link>
            </li>
            <li>
              <Link to='/Method/linear_newton'>Linear Newton Divide Difference</Link>
            </li>
            <li>
              <Link to='/Method/quadatic_newton'>Quadratic Newton Divide Difference</Link>
            </li>
          </ul>
          <Switch>
            <Route path='/Method/bisec' exact component={Bisection}/>
            <Route path='/Method/false' exact component={False}/>
            <Route path='/Method/Newton-Rapshon' exact component={Newton}/>
            <Route path='/Method/Secant' exact component={Secant}/>
            <Route path='/Method/Onepoint' exact component={Onepoint}/>
            <Route path='/Method/cramer' exact component={Cramer_main}/>
            <Route path='/Method/guess-eli' exact component={Guess_elimination}/>
            <Route path='/Method/guess-jordan' exact component={Guess_jordan}/>
            <Route path='/Method/jacobi' exact component={Jacobi_method}/>
            <Route path='/Method/seidel' exact component={Seidel_method}/>
            <Route path='/Method/lu' exact component={LU}/>
            <Route path='/Method/linear_newton' exact component={Linear_new}/>
            <Route path='/Method/quadatic_newton' exact component={Quadratic_new}/>
          </Switch>
        </Router>
      </div>
    );
  }
  export default App;