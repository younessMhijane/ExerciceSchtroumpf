import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import schtroumpf from './contracts/schtroumpf.json';
import './App.css';

const App = () => {
  const [contract, setContract] = useState(null);
  const [tab1Value, setTab1Value] = useState('');
  const [tab2Value, setTab2Value] = useState('');
  const [tab1, setTab1] = useState([]);
  const [tab2, setTab2] = useState([]);
  const [result, setResult] = useState(null);

  //*****************/clearTabs/********************/
  const clearTabs = useCallback(async () => {
    try {
      await contract.methods.clearTab1().send({ from: '0xCfdA4eCe2649F60580a6C5Fbc577C52dD0aC4A14', gas: 1000000 });
      await contract.methods.clearTab2().send({ from: '0xCfdA4eCe2649F60580a6C5Fbc577C52dD0aC4A14', gas: 1000000 });
      setTab1([]);
      setTab2([]);
    } catch (error) {
      console.error('Error clearing tabs', error);
    }
  }, [contract]);

  //*****************/         /********************/
  useEffect(() => {
    async function init() {
      const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      const web3Instance = new Web3(provider);

      try {
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = schtroumpf.networks[networkId];
        const instance = new web3Instance.eth.Contract(
          schtroumpf.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract(instance);
      } catch (error) {
        console.error('User denied account access or something went wrong.', error);
      }
    }
    init();
  }, []);

  //*****************/        /********************/
  useEffect(() => {
    if (contract) { // Vérifie si le contrat est défini
      clearTabs(); // Appel à clearTabs lors du chargement initial de la page
    }
  }, [clearTabs, contract]);

  //*****************/addToTab/********************/
  const addToTab = async (tab, value) => {
    try {
      await contract.methods[`addToTab${tab}`](value).send({ from: '0xCfdA4eCe2649F60580a6C5Fbc577C52dD0aC4A14', gas: 1000000 });
      tab === 1 ? setTab1([...tab1, value]) : setTab2([...tab2, value]);
      tab === 1 ? setTab1Value('') : setTab2Value('');
    } catch (error) {
      console.error(`Error adding to tab ${tab}`, error);
    }
  };

  //*****************/calculateSchtroumpf/********************/
  const calculateSchtroumpf = async () => {
    try {
      const result = await contract.methods.schtroumpfTab().call();
      setResult(result.toString());
    } catch (error) {
      console.error('Error calculating Schtroumpf', error);
    }
  };

  return (
    <div className='divcenter'>
      <h1>Schtroumpf Calculator</h1>
      <div>
        <label htmlFor="tab1">Tab 1:</label>
        <input type="text" id="tab1" value={tab1Value} onChange={(e) => setTab1Value(e.target.value)} />
        <button onClick={() => addToTab(1, parseInt(tab1Value))}>Add to Tab 1</button>
        <div className="tab-container">
          {tab1.map((value, index) => (
            <div className="tab-value" key={index}>{value}</div>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="tab2">Tab 2:</label>
        <input type="text" id="tab2" value={tab2Value} onChange={(e) => setTab2Value(e.target.value)} />
        <button onClick={() => addToTab(2, parseInt(tab2Value))}>Add to Tab 2</button>
        <div className="tab-container">
          {tab2.map((value, index) => (
            <div className="tab-value" key={index}>{value}</div>
          ))}
        </div>
      </div>
      <button onClick={clearTabs}>Clear Tabs</button>
      <button className='calc' onClick={calculateSchtroumpf}>Calculate Schtroumpf</button>
      {result !== null && (
        <div>
          <h2>Result: {result}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
