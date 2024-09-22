import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import api from "../../../config";
import { useNavigate } from "react-router-dom";

function Search (){
  const [infoSearch,setinfoSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate()

  const handleSearch = async () =>{
    console.log(infoSearch)
    const response = await api.post("search",infoSearch)
    console.log(response.data)
    const {token} = response.data
    localStorage.setItem("token",token)
    navigate("/home")
  }

  return (
    <div className="container p-4">
    <InputGroup >
      <FormControl
        placeholder="Search"
        value={infoSearch}
        onChange={(e)=>setinfoSearch(e.target.value)}
        onFocus={()=>{setIsFocused(true)}}
        onBlur={()=>{setIsFocused(false)}}
      />
      <Button
        variant="primary"
        onClick={handleSearch}
      >
        <FaSearch />
      </Button>
    </InputGroup>
  </div>
  );
};

export default Search;