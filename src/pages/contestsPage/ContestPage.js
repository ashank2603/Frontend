import React,{useState,useEffect} from 'react';
import Loading from '../logreg/loading.jsx';
import Navbar from '../../components/Header/Navbar';
import FooterSmall from '../../components/Footer/FooterSmall';
import { Button, Modal, ModalBody, Input, Collapse} from 'reactstrap';
import {Form,Row,Col} from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import './ContestPage.css'
import update from 'react-addons-update';
import AccordionCom from '../../components/contest/AccordionCom';
import Switch from '@material-ui/core/Switch'


//component for switch
const AntSwitch = withStyles((theme) => ({
    root: {
    float:'right'
    },
    switchBase: {
      color: 'blue',
      '&$checked': {
        transform: 'translateX(20px)',
        color: 'white',
        '& + $track': {
          opacity: 1,
          backgroundColor: 'blue',
          borderColor: 'black',
        },
      },
    },
    thumb: {
      boxShadow: 'none',
    },
    track: {
      backgroundColor: 'white',
    },
    checked: {},
  }))(Switch);


function ContestPage({info,queryStr}) {
    //queryStr is current url string

    
    const [datap,setDatap] = useState(queryStr.replace(/;/g,"&"));
    
    //Parsing into json
    const [queryDefault, setQueryDefault] = useState(queryString.parse(datap, {parseBooleans: true}, {arrayFormat: 'separator', arrayFormatSeparator: ';'}));

    console.log(queryStr)
    console.log(datap);
    console.log(queryDefault)


    const creds= JSON.parse(localStorage.getItem("creds"));
    const [show, setShow] = useState(true);
    const [problems, setProblems] = useState([]);
    const [error, setErrors] = useState(false);
    const[modalOpenDiffi,setModalOpenDiffi]=useState(false);

    const [searchText, setSearchText] = useState();

    //available difficulty levels
    const difficultyLevels=[
        "Div. 1",
        "Div. 2",
        "Div. 3",
        "Div. 4",
        "Educational",
        "Global"
    ]



    //configuring defaut display of difficulty
    const [displayDiff, setDisplayDiff] = useState(
        queryDefault.divs ? { values: [
            queryDefault.divs.includes("Div. 1"), 
            queryDefault.divs.includes("Div. 2"),
            queryDefault.divs.includes("Div. 3"),
            queryDefault.divs.includes("Div. 4"),
            queryDefault.divs.includes("Educational"),
            queryDefault.divs.includes("Global")
        ] } : {values:[false,false,false,false,false,false]}
    )


    //available difficulty filters
    const difficultyFilters = [
        'Div. 1','Div. 2','Div. 3','Div. 4','Educational','Global'
    ]


    //FIlter parameters
    const [gym,setGym] = useState(queryDefault.gym ? queryDefault.gym : false);
    const [gymCount,setGymCount] = useState(queryDefault.gym ? true : false);
    const [mentorr,setMentorr] = useState(queryDefault.mentor ? queryDefault.mentor : false);
    const [mentorrCount,setMentorrCount] = useState(queryDefault.mentor ? true : false);


    const[difficultyQueries, setDifficultyQueries]=useState(queryDefault.divs ? queryDefault.divs.split(',') : []);

    

    const [isDiffChange,setIsDiffChange] = useState(queryDefault.divs ? true: false);


    //Function to change the difficulty
    const changeDifficultyFilter = (event,lev) => {
        const res=event.target.checked;
        setIsDiffChange(true);
        const difficultyAdd=difficultyLevels[lev];
        if(res)
        {
            setDifficultyQueries([...difficultyQueries, difficultyAdd]);
            console.log(difficultyQueries);
            setDisplayDiff(update(displayDiff, {
                values: {
                    [lev]: {
                        $set: true
                    }
                }
            }));
        }
        else
        {
            const newList = difficultyQueries.filter((item) => item != difficultyFilters[lev]);
            setDifficultyQueries(newList);
            setDisplayDiff(update(displayDiff, {
                values: {
                    [lev]: {
                        $set: false
                    }
                }
            }));
        }
        
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        var urlTo="/contests?";

        if(isDiffChange && difficultyQueries.length > 0)
        {
            urlTo = urlTo + `divs=${JSON.stringify(difficultyQueries).replace(/"/g,'').replace(/]|[[]/g, '')}`;
        }
        console.log(urlTo);

        if(gymCount)
        {
            urlTo = urlTo + `;gym=${JSON.stringify(gym)}`
        }

        console.log(urlTo);
        
        if(mentorrCount)
        {
            urlTo = urlTo + `;mentor=${JSON.stringify(mentorr)}`
        }
        console.log(urlTo);

        window.location.href=urlTo;
        
    }

    //searching for a contest
    const handleSearch = (e) => {
        e.preventDefault();
        const searchUrl = `/contest/?divs=${searchText}`;
        window.location.href=searchUrl;
    }


    //opening filter block
    function openNav() {
	    document.getElementById("mySidenav1").style.width = "237px";
        document.getElementById("mySidenav1").style.opacity = "1";
	}

    //closing filter block
	function closeNav() {
	    document.getElementById("mySidenav1").style.width="0";
        document.getElementById("mySidenav1").style.opacity = "0";
	}


    useEffect(() => {
        return fetch (`https://api.codedigger.tech/contest/${queryStr}`,{
        method:"GET",
        headers:{
            "Content-type":"application/json",
            "Authorization":`Bearer ${creds.access}`
        }
    })
        .then(data => data.json())
        .then(res => setProblems(res))
        .then(show => setShow(false))
        .catch(error => setErrors(true));
    },[])

    

    //changing gym filter
    const gymChange = (e) => {
        setGym(!gym);
        setGymCount(true);
    }

    //changing mentor filter
    const mentorrChange = (e) => {
        setMentorr(!mentorr);
        setMentorrCount(true);
    }

    return (
        show==true ? <><Loading/></>:
        <>
            <Navbar />
                <h3
                    style={{
                        textAlign: 'center',
                        marginBottom: '65px',
                        marginTop: '100px'
                    }}
                >Contests</h3>
                <Button  style={{position:'absolute', bottom:'77vh', right:'6vw'}} onClick={openNav}>Filter</Button>
                <Button  style={{position:'absolute', bottom:'77vh', right:'12vw'}} onClick={() => window.location.reload()}>Refresh</Button>
                <div id="mySidenav1" className="sidenav1">
		        
         
                            <Button className="filterHeading" onClick={(e)=>setModalOpenDiffi(!modalOpenDiffi)}>Divisions</Button>
                             <Modal isOpen={modalOpenDiffi}><ModalBody>
                             <h2 style={{marginBottom:'2rem'}}>Divisions</h2>
                            <Form style={{marginBottom:'1rem'}}>
                                <div key="inline-checkbox">
                                    {difficultyLevels.map((lev,i) => {
                                        if(displayDiff.values[i])
                                        {
                                            return(
                                                <Form.Check checked={true} onChange={(event) => changeDifficultyFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                            )
                                        }
                                        else
                                        {
                                            return(
                                                <Form.Check onChange={(event) => changeDifficultyFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                            )
                                        }
                                        
                                    })}
                                </div></Form>
                                <Button onClick={(e)=>setModalOpenDiffi(false)}>Set</Button>
                            </ModalBody></Modal>

                            <div className="filterHeading" style={{
                                marginTop:'1rem',
                                fontSize:'1.2rem'
                            }}>
                                Gym: 
                                <AntSwitch 
                                    checked={gym}
                                    onChange={gymChange}
                                />
                            </div>

                            <div className="filterHeading" style={{
                                marginTop:'1rem',
                                fontSize:'1.2rem'
                            }}>
                                Solved By Mentor: 
                                <AntSwitch
                                    checked={mentorr} 
                                    onChange={mentorrChange}
                                />
                            </div>
                        
                        <br></br> <br></br>  
                    
                        <Button style={{padding:'6px',marginLeft:'12px',backgroundColor:'forestgreen'}}onClick={handleSubmit}>Apply</Button>
                        <Button style={{padding:'6px',marginLeft:'5px',backgroundColor:'firebrick'}} onClick={closeNav}>Close</Button>
		</div>
                
                
            {!problems.result? (<Loading />) : 
                (
                    <>
                    <div style={{
                        margin: '0px',
                        padding: '0px',
                        marginLeft: '100px',
                        marginRight: '100px',
                        paddingBottom:'100px'
                    }}>
                        <div className="row" style={{marginBottom:'3rem'}}>
                            <div class="input-group" style={{justifyContent:'center'}}>
                                <div class="form-outline">
                                    <input onChange={(e)=>setSearchText(e.target.value)} type="search" id="form1" class="form-control" style={{height:'3rem', width:'26rem'}}/>
                                </div>
                                <button type="button" onClick={handleSearch} class="btn btn-primary">
                                    Search 
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            {console.log(problems.result)}
                            {problems.result.map((playlist, i) => {
                                
                                return(
                                    <>
                                    
                                    <div className="col-md-6" style={{marginBottom:'1rem'}}>
                                    <AccordionCom problem={playlist}/>
                                    </div>
                                    
                                    
                                    
                            
                                    </>
                                )
                            })}
                        </div>      
                        </div>
                        
                                <FooterSmall/>
                            
                            </>
                    
                )
            }
        </>
    )
}

export default ContestPage