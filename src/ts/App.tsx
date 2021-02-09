import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Test from './container/Test';
import Home from './container/Home';
import Contact from './components/Contact';
import Error from './components/Error';

import '../scss/main.scss';

const App: React.FC = () => {

    return (
        <main>
            <Switch>
                <Route path='/' component={Home} exact />
                <Route path='/test' component={Test} />
                <Route path='/contact' component={Contact} />
                <Route component={Error} />
            </Switch>
        </main>
    );

};

export default App;