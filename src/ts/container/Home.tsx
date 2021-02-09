import React  from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from './About';
import Input from './Input';
import Graph from './Graph';

const Home = (): JSX.Element => {
    const showAbout =  useSelector((state: IUser) => state.user.isAbout);
    const showInput = !showAbout ? true : false;
    const showGraph = useSelector((state: IInput) => state.input.showGraph);

    return (
        <div className="container">
            <Header />
            <div className="container-inner">
                {showAbout && <About />}
                {showInput && <Input />}
                {showGraph && <Graph />}
            </div>
            <Footer />
        </div>
    );
};

export default Home;