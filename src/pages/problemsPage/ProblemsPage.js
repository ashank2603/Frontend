import React,{useState,useEffect} from 'react';
import Loading from '../logreg/loading.jsx';
import Navbar from '../../components/Header/Navbar';
import FooterSmall from '../../components/Footer/FooterSmall';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Collapse} from 'reactstrap';
import {Form,Row,Col} from 'react-bootstrap';
import queryString from 'query-string';
import { getProblems,getProblemsWithCreds } from "../../actions/problems.actions"
import './ProblemPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import update from 'react-addons-update';
import {faFolderPlus} from '@fortawesome/free-solid-svg-icons'
import AccordionCom from '../../components/problems/AccordionCom';
import { AntSwitch } from '../../components/common/Utils';


function ProblemsPage({info,queryStr}) {
    console.log("qs", queryStr);

    const queryDefault = queryString.parse(queryStr, {parseBooleans: true});

    console.log(queryDefault);

    const creds= JSON.parse(localStorage.getItem("creds"));
    const [error, setErrors] = useState(false);
    const [show, setShow] = useState(true);
    const [problems, setProblems] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [modal, setModal] = useState(false);
    const[modalOpenDiffi,setModalOpenDiffi]=useState(false);
    const[modalOpenPlat,setModalOpenPlat]=useState(false);
    const[modalOpenDiffiRange,setModalOpenDiffiRange]=useState(false);
    const [openTags,setOpenTags]=useState(false);

    const [searchText, setSearchText] = useState();
    const [tagText, setTagText] = useState();
    const [problemid, setProblemListId] = useState();
    const [problemplatform, setProblemListPlatform] = useState();


    const platforms=[
        "Codechef",
        "Codeforces",
        "Atcoder",
        "Spoj",
        "UVA"
    ];

    const difficultyLevels=[
        "Beginner",
        "Easy" ,
        "Medium",
        "Hard",
        "SuperHard",
        "Challenging"
    ]

    const defaultTags = ["string","dp","math","combinatorics", "Number Theory", "interactive","Binary Search","greedy","graph"];

    const [rangeLeft,setRangeLeft]=useState(queryDefault.range_l ? queryDefault.range_l : 0);
    const [rangeRight,setRangeRight]=useState(queryDefault.range_r ? queryDefault.range_r : 0);

    const [displayDiff, setDisplayDiff] = useState(
        queryDefault.difficulty ? { values: [
            queryDefault.difficulty.includes("B"), queryDefault.difficulty.includes("E"),queryDefault.difficulty.includes("M"),queryDefault.difficulty.includes("H"),queryDefault.difficulty.includes("S"),queryDefault.difficulty.includes("C")
        ] } : {values:[false,false,false,false,false,false]}
    )

    const [displayPlat, setDisplayPlat] = useState(
        queryDefault.platform ? {
            values:[
                queryDefault.platform.includes("C"),queryDefault.platform.includes("F"),queryDefault.platform.includes("A"),queryDefault.platform.includes("S"),queryDefault.platform.includes("U")
        ]} : {values:[false,false,false,false,false]}
    )

    const [displayTags, setDisplayTags] = useState(
        queryDefault.tags ? {
            values:[
            queryDefault.tags.includes("string"),queryDefault.tags.includes("dp"),queryDefault.tags.includes("math"),queryDefault.tags.includes("combinatorics"),queryDefault.tags.includes("Number Theory"),queryDefault.tags.includes("interactive"),queryDefault.tags.includes("Binary Search"),queryDefault.tags.includes("greedy"),queryDefault.tags.includes("graph")
        ]} : {
            values:[
            false,false,false,false,false,false,false,false,false
        ]}
    )


    const platformFilters = [
        'C', 'F', 'A', 'S', 'U'
    ];

    const difficultyFilters = [
        'B','E','M','H','S','C'
    ]

    const [queries,setQueries]=useState({
        difficulty:[],
        platform:[],
        range_l:1200,
        range_r:5000,
        tags:[]
    });

    const [mentorr,setMentorr] = useState(queryDefault.mentor ? queryDefault.mentor : false);
    const [mentorrCount,setMentorrCount] = useState(queryDefault.mentor ? true : false);


    const[platformQueries, setPlatformQueries]=useState(queryDefault.platform ? queryDefault.platform.split(',') : []);
    const[difficultyQueries, setDifficultyQueries]=useState(queryDefault.difficulty ? queryDefault.difficulty.split(',') : []);
    const[tagQueries, setTagQueries]=useState(queryDefault.tags ? queryDefault.tags.split(','):[]);

    const [diffRange, setDiffRange] = useState( queryDefault.range_l && queryDefault.range_r ? [queryDefault.range_l, queryDefault.range_r] : queryDefault.range_l ? [queryDefault.range_l,3200] : queryDefault.range_r ? [0,queryDefault.range_r] : [100,3200]);
    const [sliderChange,setSliderChange] = useState(queryDefault.range_l || queryDefault.range_r ? true:false);

    const handleSlider = (event, newValue) => {
        setSliderChange(true);
        setDiffRange(newValue);
    };

    const setLeftRangeQuery = (event) => {
        event.preventDefault();
        setRangeLeft(event.target.value);
    }

function ProblemsPage({ info, queryStr }) {
  console.log('qs', queryStr)

    // const toggle = (e) => {
    //     e.preventDefault();
    //     setModal(!modal);
    //   }

      function toggle2(event) {
        event.preventDefault();
        setModal(!modal);
        
        if(!modal)
        {
          getPlaylists();
        }
      };

    const changePlatformFilter = (event,lev) => {        
        const res=event.target.checked;
        const platformAdd=platformFilters[lev];
        if(res)
        {
            setPlatformQueries([...platformQueries,[platformAdd]]);
        
            setDisplayPlat(update(displayPlat, {
                values: {
                    [lev]: {
                        $set: true
                    }
                }
            }));

        }
        else
        {
            const newList = platformQueries.filter((item) => item != platformFilters[lev]);
            setPlatformQueries(newList);
            setDisplayPlat(update(displayPlat, {
                values: {
                    [lev]: {
                        $set: false
                    }
                }
            }));
        }
    }

  const creds = JSON.parse(localStorage.getItem('creds'))
  const [error, setErrors] = useState(false)
  const [show, setShow] = useState(true)
  const [problems, setProblems] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [modal, setModal] = useState(false)
  const [modalOpenDiffi, setModalOpenDiffi] = useState(false)
  const [modalOpenPlat, setModalOpenPlat] = useState(false)
  const [modalOpenDiffiRange, setModalOpenDiffiRange] = useState(false)
  const [openTags, setOpenTags] = useState(false)

  const [searchText, setSearchText] = useState()
  const [tagText, setTagText] = useState()
  const [problemid, setProblemListId] = useState()
  const [problemplatform, setProblemListPlatform] = useState()

  const platforms = ['Codechef', 'Codeforces', 'Atcoder', 'Spoj', 'UVA']
  const difficultyLevels = [
    'Beginner',
    'Easy',
    'Medium',
    'Hard',
    'SuperHard',
    'Challenging',
  ]

  const defaultTags = [
    'string',
    'dp',
    'math',
    'combinatorics',
    'Number Theory',
    'interactive',
    'Binary Search',
    'greedy',
    'graph',
  ]

  const [rangeLeft, setRangeLeft] = useState(
    queryDefault.range_l ? queryDefault.range_l : 0
  )
  const [rangeRight, setRangeRight] = useState(
    queryDefault.range_r ? queryDefault.range_r : 0
  )


    function addProblem(slug){
        if(!creds){
          return;
        }
      : { values: [false, false, false, false, false, false] }
  )

  const [displayPlat, setDisplayPlat] = useState(
    queryDefault.platform
      ? {
          values: [
            queryDefault.platform.includes('C'),
            queryDefault.platform.includes('F'),
            queryDefault.platform.includes('A'),
            queryDefault.platform.includes('S'),
            queryDefault.platform.includes('U'),
            // false,false,false,false,false
          ],
        }

    
          const result =  fetch (`https://api.codedigger.tech/lists/userlist/add`,{
              method:"POST",
              headers:{
                  "Content-type":"application/json",
                  "Authorization":`Bearer ${creds.access}`
              },
              body:JSON.stringify({
                  "prob_id": problemid,
                  "slug": slug,
                  "platform": p
              })
          }).then(data => data.json())
            .then(data => data.status === "FAILED"? alert("Problem has already been added to the problem list!"):alert("Problem is successfully Added to problem list."))
          
      }

    const changeTagFilter = (event,lev) => {
        const res=event.target.checked;
        const tagAdd=defaultTags[lev];
        if(res)
        {
            setTagQueries([...tagQueries, [tagAdd]]);
            setDisplayTags(update(displayTags, {
                values: {
                    [lev]: {
                        $set: true
                    }
                }
            }));
        }
        else
        {
            const newList = tagQueries.filter((item) => item != defaultTags[lev]);
            setTagQueries(newList);
            setDisplayTags(update(displayTags, {
                values: {
                    [lev]: {
                        $set: false
                    }
                }
            }));
        } 
    }
    // console.log(JSON.stringify(queries.platform).replace(/"/g,'').replace(/]|[[]/g, ''));
  }

    const changeDifficultyFilter = (event,lev) => {
        const res=event.target.checked;
        const difficultyAdd=difficultyFilters[lev];
        if(res)
        {
            setDifficultyQueries([...difficultyQueries, [difficultyAdd]]);
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
    let p
    let platform = problemplatform
    if (platform === 'Codeforces') {
      p = 'F'
    } else if (platform === 'Codechef') {
      p = 'C'
    } else if (platform === 'Atcoder') {
      p = 'A'
    } else if (platform === 'UVA') {
      p = 'U'
    } else if (platform === 'SPOJ') {
      p = 'S'
    }

    // console.log(slug, prob_id, platform)
    const result = fetch(`https://api.codedigger.tech/lists/userlist/add`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${creds.access}`,
      },
      body: JSON.stringify({
        prob_id: problemid,
        slug: slug,
        platform: p,
      }),
    })
      .then((data) => data.json())
      .then((data) =>
        data.status === 'FAILED'
          ? alert('Problem has already been added to the problem list!')
          : alert('Problem is successfully Added to problem list.')
      )
  }

  const changeTagFilter = (event, lev) => {
    // console.log(difficultyFilters[lev]);
    const res = event.target.checked
    // console.log(lev + res);
    const tagAdd = defaultTags[lev]
    if (res) {
      // console.log(queries.difficulty.push(difficultyFilters[lev]));
      setTagQueries([...tagQueries, [tagAdd]])
      setDisplayTags(
        update(displayTags, {
          values: {
            [lev]: {
              $set: true,
            },
          },
        })
      )
    } else {
      // var y=-1;
      // queries.difficulty.map((plat,i) => {
      //     if(plat==difficultyFilters[lev])
      //     {
      //         y=i;
      //     }
      // });
      // queries.difficulty.splice(y,1);
      const newList = tagQueries.filter((item) => item != defaultTags[lev])
      setTagQueries(newList)

      // console.log(newList);
      // console.log(lev);
      // console.log(defaultTags[lev]);

      setDisplayTags(
        update(displayTags, {
          values: {
            [lev]: {
              $set: false,
            },
          },
        })
      )
    }
    // console.log(JSON.stringify(queries.difficulty).replace(/"/g,'').replace(/]|[[]/g, ''));
  }

  const changeDifficultyFilter = (event, lev) => {
    // console.log(difficultyFilters[lev]);
    const res = event.target.checked
    // console.log(lev + res);
    const difficultyAdd = difficultyFilters[lev]
    if (res) {
      // console.log(queries.difficulty.push(difficultyFilters[lev]));
      setDifficultyQueries([...difficultyQueries, [difficultyAdd]])
      setDisplayDiff(
        update(displayDiff, {
          values: {
            [lev]: {
              $set: true,
            },
          },
        })
      )
    } else {
      // var y=-1;
      // queries.difficulty.map((plat,i) => {
      //     if(plat==difficultyFilters[lev])
      //     {
      //         y=i;
      //     }
      // });
      // queries.difficulty.splice(y,1);
      const newList = difficultyQueries.filter(
        (item) => item != difficultyFilters[lev]
      )
      setDifficultyQueries(newList)
      setDisplayDiff(
        update(displayDiff, {
          values: {
            [lev]: {
              $set: false,
            },
          },
        })
      )
    }
    // console.log(JSON.stringify(queries.difficulty).replace(/"/g,'').replace(/]|[[]/g, ''));
  }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!sliderChange)
        {
            if(mentorrCount)
            {
                const queryy = {
                    difficulty:JSON.stringify(difficultyQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    platform:JSON.stringify(platformQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    tags:JSON.stringify(tagQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    mentor:JSON.stringify(mentorr)
                }
    
                const finalQ = queryString.stringify(queryy,{skipEmptyString:true});
                const urlTo = `/problems/?${finalQ}`;
                window.location.href=urlTo;
            }
            else
            {
                const queryy = {
                    difficulty:JSON.stringify(difficultyQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    platform:JSON.stringify(platformQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    tags:JSON.stringify(tagQueries).replace(/"/g,'').replace(/]|[[]/g, '')
                }
    
                const finalQ = queryString.stringify(queryy,{skipEmptyString:true});
                const urlTo = `/problems/?${finalQ}`;
                window.location.href=urlTo;
            }
        }
        else
        {
            if(mentorrCount)
            {
                const queryy = {
                    difficulty:JSON.stringify(difficultyQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    platform:JSON.stringify(platformQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    tags:JSON.stringify(tagQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    range_l:JSON.stringify(diffRange[0]).replace(/"/g,'').replace(/]|[[]/g, ''),
                    range_r:JSON.stringify(diffRange[1]).replace(/"/g,'').replace(/]|[[]/g, ''),
                    mentor:JSON.stringify(mentorr)
                }
    
                const finalQ = queryString.stringify(queryy,{skipEmptyString:true});
                const urlTo = `/problems/?${finalQ}`;
                window.location.href=urlTo;
            }
            else
            {
                const queryy = {
                    difficulty:JSON.stringify(difficultyQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    platform:JSON.stringify(platformQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    tags:JSON.stringify(tagQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                    range_l:JSON.stringify(diffRange[0]).replace(/"/g,'').replace(/]|[[]/g, ''),
                    range_r:JSON.stringify(diffRange[1]).replace(/"/g,'').replace(/]|[[]/g, '')
                }
    
                const finalQ = queryString.stringify(queryy,{skipEmptyString:true});
                const urlTo = `/problems/?${finalQ}`;
                window.location.href=urlTo;
            } 

        }

        const finalQ = queryString.stringify(queryy, { skipEmptyString: true })
        const urlTo = `/problems/?${finalQ}`
        // console.log(urlTo);
        window.location.href = urlTo
      } else {
        const queryy = {
          difficulty: JSON.stringify(difficultyQueries)
            .replace(/"/g, '')
            .replace(/]|[[]/g, ''),
          platform: JSON.stringify(platformQueries)
            .replace(/"/g, '')
            .replace(/]|[[]/g, ''),
          tags: JSON.stringify(tagQueries)
            .replace(/"/g, '')
            .replace(/]|[[]/g, ''),
          range_l: JSON.stringify(diffRange[0])
            .replace(/"/g, '')
            .replace(/]|[[]/g, ''),
          range_r: JSON.stringify(diffRange[1])
            .replace(/"/g, '')
            .replace(/]|[[]/g, ''),
        }

        const finalQ = queryString.stringify(queryy, { skipEmptyString: true })
        const urlTo = `/problems/?${finalQ}`
        // console.log(urlTo);
        window.location.href = urlTo
      }
    }
  }

    function openNav() {
	    document.getElementById("mySidenav").style.width = "250px";
	}

	function closeNav() {
	    document.getElementById("mySidenav").style.width="0";
	}

  async function getPlaylists() {
    if (!creds) {
      alert('Please Login to Add Problems to Problem List!')
      return
    }
    const res = await fetch(`https://api.codedigger.tech/lists/userlist/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${creds.access}`,
      },
    })
    res
      .json()
      .then((res) => setPlaylists(res))
      .catch((error) => setErrors(true))
  }

  useEffect(async () => {
    if (creds) {
      await getProblemsWithCreds(queryStr, creds.access)
        .then((res) => setProblems(res))
        .then((show) => setShow(false))
        .catch((error) => setErrors(true))
    } else {
      await getProblems(queryStr)
        .then((res) => setProblems(res))
        .then((show) => setShow(false))
        .catch((error) => setErrors(true))
    }
  }, [])


    return (
        show==true ? <><Loading/></>:
        <>
            <Navbar />
                <h3 className="page_heading">Problems</h3>
                <Button  className="filter_button"  onClick={openNav}>Filter</Button>
                <Button  className="refresh_button" onClick={() => window.location.reload()}>Refresh</Button>
                <div id="mySidenav" className="sidenav">
                            <Button className="filterHeading" onClick={(e)=>setModalOpenDiffi(!modalOpenDiffi)}>Difficulty</Button>
                             <Modal toggle={(e)=>{setModalOpenDiffi(false)}}
                             isOpen={modalOpenDiffi}><ModalBody>
                             <h2 className="filter_titles">Difficulty</h2>
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
                            <br></br><br></br>
                            <Button className="filterHeading" onClick={(e)=>setOpenTags(!openTags)}>Tags</Button>
                             <Modal toggle={(e)=>{setOpenTags(false)}} isOpen={openTags}><ModalBody>
                             <h2 className="filter_titles">Tags</h2>
                                <Form style={{marginBottom:'1rem'}}>
                                    <div key="inline-checkbox">
                                        {defaultTags.map((lev,i) => {
                                            if(displayTags.values[i])
                                            {
                                                return(
                                                    <Form.Check checked={true} onChange={(event) => changeTagFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                                )
                                            }
                                            else
                                            {
                                                return(
                                                    <Form.Check onChange={(event) => changeTagFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                                )
                                            }
                                        })}
                                    </div>
                                    <div>
                                    <Form.Group as={Row} onSubmit={e => { e.preventDefault(); }} style={{marginTop:'1rem'}}>
                                        <Form.Label column sm="3" style={{maxWidth:'18%'}}>
                                            Your Tag
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control onKeyPress={event => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault();
                                                    tagTextAdd();
                                                }
                                                }} value={tagText} onChange={(e)=>setTagText(e.target.value)} type="text"  placeholder="Type your Tag" />
                                        </Col>
                                        <Col sm="1" style={{paddingLeft:'0'}}>
                                        <Button onClick={tagTextAdd}>Add</Button>
                                        </Col>
                                    </Form.Group>
                                    </div>
                                </Form>
                                <Row style={{marginBottom:'2rem'}}>
                                    <Col sm='3'>Your Tags</Col>
                                    <Col sm='9'>
                                        <div style={{display:'flex', flexWrap:'wrap'}}>
                                            {tagQueries.map((quer) => {
                                                return(
                                                    <>
                                                    <div className="your_tags">{quer}</div>
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </Col>
                                </Row>
                                <Button onClick={(e)=>setOpenTags(false)}>Set</Button>
                            </ModalBody> </Modal>   <br></br><br></br>
                       
                        <Button className="filterHeading" onClick={(e)=>setModalOpenPlat(!modalOpenPlat)}>Platforms</Button>
                             <Modal toggle={(e)=>{setModalOpenPlat(false)}} isOpen={modalOpenPlat}><ModalBody>
                             <h2 className="filter_titles">Platforms</h2>
                            <Form style={{marginBottom:'1rem'}}>
                                <div key="inline-checkbox">
                                    {platforms.map((lev,i) => {
                                        if(displayPlat.values[i])
                                        {
                                            return(
                                                <Form.Check checked={true} onChange={(event) => changePlatformFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                            )
                                        }
                                        else
                                        {
                                            return(
                                                <Form.Check checked={false} onChange={(event) => changePlatformFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                            )
                                        }   
                                    })}
                                </div>
                        </Form>
                        <Button onClick={(e)=>setModalOpenPlat(false)}>Set</Button>
                            </ModalBody></Modal>
                      <br></br><br></br>
                      <Button className="filterHeading" onClick={(e)=>setModalOpenDiffiRange(!modalOpenDiffiRange)}>Difficulty Range</Button>
                             <Modal toggle={(e)=>{setModalOpenDiffiRange(false)}} isOpen={modalOpenDiffiRange}><ModalBody>
                                <div style={{width:'300'}}>
                                    <Typography id="range-slider" gutterBottom>
                                        Set your Difficulty Range
                                    </Typography>
                                    <Slider
                                        value={diffRange}
                                        min={400}
                                        max={6000}
                                        onChange={handleSlider}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="range-slider"
                                    />
                                    <Typography>
                                        <strong>Your Range :</strong>
                                        <span>{diffRange[0]}</span>
                                        <span> - </span>
                                        <span>{diffRange[1]}</span>
                                    </Typography>
                                </div>
                            <Button onClick={(e)=>setModalOpenDiffiRange(false)}>Set</Button>
                       </ModalBody> </Modal>
                        <br></br> <br></br>  
                    
                        <div className="filterHeading">
                                Solved By Mentor: 
                                <AntSwitch
                                    checked={mentorr} 
                                    onChange={mentorrChange}
                                />
                            </div>
                        <Button className="sidenav_apply_button" onClick={handleSubmit}>Apply</Button>
                        <Button className="sidenav_close_button" onClick={closeNav}>Close</Button>
		</div>
                  
                  {/* dfksnldkfnk */}
            {!problems.result? (<Loading />) : 
                (
                    <>
                    <div className="problems_page" onClick={closeNav}>
                        <div className="row">
                            <div class="input-group">
                                <div class="form-outline">
                                    <input onChange={(e)=>setSearchText(e.target.value)} type="search" id="form1" class="form-control" placeholder="Search" />
                                </div>
                                <button type="button" onClick={handleSearch} class="btn btn-primary">Search </button>
                            </div>
                        </div>
                        <div>
                        {creds? <>
                                    <Modal isOpen={modal} toggle={creds.access? toggle2:null}>
                                        <ModalHeader toggle={toggle2}>Add to Problem List</ModalHeader>
                                        <ModalBody>
                                        </ModalBody>
                                        <ul>
                                        
                                        {playlists.map((list, i) => {
                                            return(
                                            <>
                                                 <li>
                                                <span className="problem_list">{list.name}</span>
                                                <Button className="add_problem_button" onClick={() => {addProblem(list.slug)}} color="success">Add</Button>           
                                                </li>
                                            </>
                                            )
                                        })}
                                        </ul>
                                        <ModalFooter>
                                        <Button color="secondary" onClick={toggle2}>Close</Button>
                                        </ModalFooter>
                                    </Modal></> : <></>}
                            
                            <div className="row">
                            <div className="col-md-6" >
                            {problems.result.slice(0,9).map((playlist, i) => {
                                return(
                                    <>
                                    <div className="col-md-12" style={{marginBottom:'1rem'}}>
                                    <AccordionCom problem={playlist}/>
                                    <span onClick={() => {
                                        setModal(!modal);
                                    if(!modal){
                                        getPlaylists();
                                    }
                                        
                                    setProblemListId(playlist.prob_id);
                                    setProblemListPlatform(playlist.platform);
                                    }} ><FontAwesomeIcon className="folder_plus_icon" icon={faFolderPlus} /></span>
                                    </div>
                                    </>
                                )
                            })}
                            </div>
                            <div className="col-md-6">
                            {problems.result.slice(10,19).map((playlist, i) => {
                                return(
                                    <>
                                    <div className="col-md-12" style={{marginBottom:'1rem'}}>
                                    <AccordionCom problem={playlist}/>
                                    <span onClick={() => {
                                        setModal(!modal);
                                    if(!modal){
                                        getPlaylists();
                                    }
                                        
                                    setProblemListId(playlist.prob_id);
                                    setProblemListPlatform(playlist.platform);
                                    }} ><FontAwesomeIcon className="folder_plus_icon" icon={faFolderPlus} /></span>
                                    </div>
                                    </>
                                )
                            })}
                            </div></div>
                        </div>      
                        </div>
                                <FooterSmall/>
                            </>
                )
            }

        </>
      )}
    </>
  )
}

export default ProblemsPage