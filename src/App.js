import './App.css';
import { useState, useEffect } from "react";
import { auth, db, app } from "./firebase-config";
import { collection, getDocs, addDoc, query, where, orderBy, limit, Timestamp,doc, deleteDoc, updateDoc} from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";


function App({ isAuth}) {
  const [links,setLinks] = useState([]);
  const linksCollectionRef = collection(db, "link");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const today = new Date().toLocaleString();
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [search, setSearch] = useState("");
  const [showupdate, setShowUpdate] = useState(false);
  const [updateid, setUpdateId] = useState("");
  const [message, setMessage] = useState("");
  const [showtoast, setShowToast] = useState(false);
  const [load, setLoad] = useState(false);
  let navigate = useNavigate(); 
  const [currentuser, setCurrentUser] = useState("");

  const handleClose = () => {
    setShow(false);
    setTitle("");
    setDescription("");
    setUrl("");
    setShowUpdate(false);
  }
  const handleShow = (breakpoint) => {
    setShow(true);
    setFullscreen(breakpoint);
  }

  const SearchData = async() =>{
    setLoad(true);
    const search1 = search.toUpperCase();
    const q2=query(linksCollectionRef, where("SearchArray", "array-contains", search1));
    const data = await getDocs(q2);
    setLinks(data.docs.map((doc) => ({...doc.data(), id:doc.id})));
    setLoad(false);
  }

  const GetCurrentUser =  () =>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
        getLinks();
      } 
    });
  }

  const getLinks = async() =>{
    setLoad(true);
    const q = query(linksCollectionRef, where("user", "==", currentuser), orderBy("created", "desc"),limit(200));
    const data = await getDocs(q);
    setLinks(data.docs.map((doc) => ({...doc.data(), id:doc.id})));
    setLoad(false);
  };

  const DeleteLink = async (id) =>{
    setLoad(true);
    const LinkDoc = doc(db, "link", id);
    await deleteDoc(LinkDoc);
    getLinks();
    setShowToast(true);
    setMessage("Record Deleted Successfully");
    ChangeToast();
    setLoad(false);
  }

  const UpdateLink = async () =>{
    setLoad(true);
    const LinkDoc = doc(db,"link",updateid);
    const newfields = {title:title.toUpperCase(),description:description,url:url}
    await updateDoc(LinkDoc, newfields);
    setShowUpdate(false);
    setShow(false);
    setShowToast(true);
    setMessage("Record Updated Successfully");
    getLinks();
    SetEmptyInp();
    ChangeToast();
    setLoad(false);
  }

  useEffect(()=>{
   if(!isAuth){
    navigate("/login");
   }
   else{
    GetCurrentUser();
    console.log("changed");
   }
  },[currentuser]);

  const CreateLink = async()=>{
    setLoad(true);
    const SearchArray = title.toUpperCase().split(" ");
    await addDoc(linksCollectionRef, {title:title.toUpperCase(),description:description,url:url,date:today,SearchArray:SearchArray,created:Timestamp.now(),user:currentuser});
    getLinks();
    SetEmptyInp();
    setShow(false);
    setShowToast(true);
    setMessage("Record Created Successfully");
    ChangeToast();
    setLoad(false);
  }

  const SetEmptyInp = ()=>{
    setTitle("");
    setDescription("");
    setUrl("");
  }

  const ChangeToast = () =>{
    setTimeout(()=>{
      setShowToast(false)
    },3000);
  }

  function Toast(){
    return (
      <>
      <div class="alert alert-dismissible alert-success" role="alert">
      {message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      </>
    )
  }

  function Main(){
    return(
      <>
      <div id='inner-body'>
      {links.length==0 ? <h3 style={{marginTop:"1rem",color:"white"}}>No data available</h3> : <p style={{display:"none"}}></p>}
        {links.map((i) => {
          return (
            <>
            
              <Card id='card' key={i.id}>
                  <Card.Body>
                    <Card.Title>{i.title}</Card.Title>
                    
                    <a href={i.url} id='link'>{i.url}</a>
                    <p>{i.description}</p>
                    
                    <Button  size="sm" style={{marginRight:'0.3rem'}} variant="info" onClick={() =>{
                      setTitle(i.title);
                      setDescription(i.description);
                      setUrl(i.url);
                      setUpdateId(i.id);
                      setShowUpdate(true);
                      setShow(true);
                    }}>Edit</Button>
                    <Button onClick={() => DeleteLink(i.id)}  size="sm" variant="danger">Delete</Button>
                    <span id='date'>{i.date}</span>
                  </Card.Body>
                </Card>
          </>
        )
      })}
    </div>
      </>
    )
  }

  return (
    <>
    <nav class="navbar" style={{backgroundColor:'#256D85'}}>
      <div class="container-fluid">
        <a class="navbar-brand" style={{color:'white'}}>My Links <span>&nbsp;<Button size="sm" variant="link" style={{color:'white',fontWeight:'600'}} onClick={getLinks}>All Links</Button></span></a>
        <div class="d-flex" role="Search">
          <input onChange={(event)=>setSearch(event.target.value)} class="form-control me-2" type="search" placeholder="keyword" aria-label="Search"/>
          <button onClick={SearchData} class="btn btn-warning">🔍</button>
          <button class="btn btn-dark" style={{marginLeft:'0.5rem'}} onClick={handleShow}>Add</button>
        </div>
      </div>
    </nav>
      <Modal show={show} fullscreen={fullscreen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Link</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {load && <h3 style={{color:'black'}}>Please wait!! Loading...</h3>}
            <Form>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={title} type="text" onChange={(event)=>{setTitle(event.target.value)}}  placeholder="Title"
                  
                  autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="url">
                <Form.Label>Url</Form.Label>
                <Form.Control
                  value={url} type="url" onChange={(event)=>{setUrl(event.target.value)}}  placeholder="Url"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="description"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3}
              value={description} type="text" onChange={(event)=>{setDescription(event.target.value)}}  placeholder="Description"
              />
            </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              {showupdate == false ? <Button variant="primary" onClick={CreateLink}>Save Changes</Button> : <Button variant="primary" onClick={()=>UpdateLink()}>Update</Button>}
          </Modal.Footer>
      </Modal>
      <div id='body'>
      <div style={{margin:"0.5rem"}}>
       {showtoast && <Toast /> }
      </div>
      {load ? <h3 style={{color:'yellow'}}>Loading...</h3> : <Main />}
    </div>
    </>
  );
}

export default App;
